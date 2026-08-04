// Text-edit engine. Runs in the loader (the only Reviseo code with access to
// the customer page's DOM). Lets a client click any text on the page, type a
// replacement in place, and accumulate a batch of suggested copy changes.
//
// All UI (mode banner, save/cancel toolbar) lives in a closed Shadow DOM so
// host-page CSS can't restyle it and vice versa. Element highlights use
// save/restore of inline styles — no stylesheet injection, so strict CSP
// style-src policies can't break the tool.
//
// The engine — not the page DOM — is the source of truth for edits: if the
// host framework re-renders and stomps our in-place preview, the recorded
// edits survive (and persist across reloads via sessionStorage).

export type TextEditRecord = {
	id: string;
	selector: string;
	elementTag: string;
	originalText: string;
	suggestedText: string;
	pageUrl: string;
};

type Callbacks = {
	/** Edit count changed (banner badge + review button live elsewhere too). */
	onEditsChanged: (edits: TextEditRecord[]) => void;
	/** User clicked "Review & submit" in the banner. */
	onReview: (edits: TextEditRecord[]) => void;
	/** Mode ended (Esc or ✕). Edits are kept; page text is restored. */
	onExit: () => void;
};

const STORAGE_KEY = "__reviseo_text_edits_v1";
const ACCENT = "#8b5cf6";
const ACCENT_DARK = "#7c3aed";

// Elements that never make sense as text-edit targets.
const SKIP_TAGS = new Set([
	"html",
	"body",
	"input",
	"textarea",
	"select",
	"option",
	"script",
	"style",
	"iframe",
	"img",
	"video",
	"audio",
	"canvas",
	"svg",
	"path",
	"br",
	"hr",
]);

function normalizeText(text: string): string {
	return text.replace(/\s+/g, " ").trim();
}

function randomId(): string {
	return `te_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Direct (non-descendant) visible text content of an element. */
function hasDirectText(el: Element): boolean {
	for (const node of el.childNodes) {
		if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim()) {
			return true;
		}
	}
	return false;
}

/** Shortest reasonably-robust CSS selector: nearest id anchor, then
 *  :nth-of-type steps. Best-effort — originalText is the durable fallback. */
function computeSelector(el: Element): string {
	if (el.id) return `#${CSS.escape(el.id)}`;

	const parts: string[] = [];
	let node: Element | null = el;

	while (node && node !== document.body) {
		const tag = node.tagName.toLowerCase();

		if (node.id) {
			parts.unshift(`#${CSS.escape(node.id)}`);
			return parts.join(" > ");
		}

		let index = 1;
		let sibling = node.previousElementSibling;
		while (sibling) {
			if (sibling.tagName === node.tagName) index++;
			sibling = sibling.previousElementSibling;
		}
		parts.unshift(`${tag}:nth-of-type(${index})`);
		node = node.parentElement;
	}

	return `body > ${parts.join(" > ")}`;
}

type SavedStyle = {
	outline: string;
	outlineOffset: string;
	cursor: string;
	textDecoration: string;
	textDecorationThickness: string;
	textUnderlineOffset: string;
};

function saveStyle(el: HTMLElement): SavedStyle {
	return {
		outline: el.style.outline,
		outlineOffset: el.style.outlineOffset,
		cursor: el.style.cursor,
		textDecoration: el.style.textDecoration,
		textDecorationThickness: el.style.textDecorationThickness,
		textUnderlineOffset: el.style.textUnderlineOffset,
	};
}

function restoreStyle(el: HTMLElement, saved: SavedStyle) {
	el.style.outline = saved.outline;
	el.style.outlineOffset = saved.outlineOffset;
	el.style.cursor = saved.cursor;
	el.style.textDecoration = saved.textDecoration;
	el.style.textDecorationThickness = saved.textDecorationThickness;
	el.style.textUnderlineOffset = saved.textUnderlineOffset;
}

export class TextEditEngine {
	private active = false;
	private callbacks: Callbacks | null = null;

	private edits: TextEditRecord[] = [];
	/** Elements currently carrying an applied suggestion. */
	private applied = new Map<
		string,
		{ el: HTMLElement; originalHTML: string; savedStyle: SavedStyle }
	>();

	private hoverEl: HTMLElement | null = null;
	private hoverSaved: SavedStyle | null = null;

	private editingEl: HTMLElement | null = null;
	private editingSaved: SavedStyle | null = null;
	private editingOriginalHTML = "";
	private editingRecordId: string | null = null;

	private host: HTMLDivElement | null = null;
	private shadow: ShadowRoot | null = null;
	private banner: HTMLDivElement | null = null;
	private toolbar: HTMLDivElement | null = null;

	private cleanupFns: Array<() => void> = [];

	constructor() {
		try {
			const raw = sessionStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) this.edits = parsed;
			}
		} catch {
			// sessionStorage unavailable — edits just won't survive reloads.
		}
	}

	getEdits(): TextEditRecord[] {
		return [...this.edits];
	}

	isActive(): boolean {
		return this.active;
	}

	start(callbacks: Callbacks) {
		if (this.active) return;
		this.active = true;
		this.callbacks = callbacks;

		this.mountShadowUI();
		this.reapplyStoredEdits();
		this.renderBanner();

		const onOver = (e: Event) => this.handleMouseOver(e as MouseEvent);
		const onOut = (e: Event) => this.handleMouseOut(e as MouseEvent);
		const onClick = (e: Event) => this.handleClick(e as MouseEvent);
		const onKey = (e: KeyboardEvent) => this.handleKeydown(e);
		const onReposition = () => this.positionToolbar();

		document.addEventListener("mouseover", onOver, true);
		document.addEventListener("mouseout", onOut, true);
		document.addEventListener("click", onClick, true);
		window.addEventListener("keydown", onKey, true);
		window.addEventListener("scroll", onReposition, true);
		window.addEventListener("resize", onReposition);

		this.cleanupFns.push(() => {
			document.removeEventListener("mouseover", onOver, true);
			document.removeEventListener("mouseout", onOut, true);
			document.removeEventListener("click", onClick, true);
			window.removeEventListener("keydown", onKey, true);
			window.removeEventListener("scroll", onReposition, true);
			window.removeEventListener("resize", onReposition);
		});
	}

	/** Exit mode. Restores every element to its original markup; recorded
	 *  edits stay (sessionStorage) for the next session or submission. */
	stop() {
		if (!this.active) return;
		this.active = false;

		this.cancelEditing(true);
		this.clearHover();

		for (const { el, originalHTML, savedStyle } of this.applied.values()) {
			el.innerHTML = originalHTML;
			restoreStyle(el, savedStyle);
		}
		this.applied.clear();

		for (const fn of this.cleanupFns) fn();
		this.cleanupFns = [];

		this.host?.remove();
		this.host = null;
		this.shadow = null;
		this.banner = null;
		this.toolbar = null;

		const cb = this.callbacks;
		this.callbacks = null;
		cb?.onExit();
	}

	/** Remove one edit (from the review modal). Restores that element. */
	removeEdit(id: string) {
		this.edits = this.edits.filter((e) => e.id !== id);
		const tracked = this.applied.get(id);
		if (tracked) {
			tracked.el.innerHTML = tracked.originalHTML;
			restoreStyle(tracked.el, tracked.savedStyle);
			this.applied.delete(id);
		}
		this.persist();
		this.renderBanner();
		this.callbacks?.onEditsChanged(this.getEdits());
	}

	/** Batch submitted — forget everything and leave the page untouched. */
	clearAfterSubmit() {
		this.edits = [];
		this.persist();
		this.stop();
	}

	// ------------------------------------------------------------------
	// Interaction
	// ------------------------------------------------------------------

	private findEditable(start: EventTarget | null): HTMLElement | null {
		let node = start instanceof Element ? start : null;
		while (node && node !== document.body) {
			if (node instanceof HTMLElement) {
				const tag = node.tagName.toLowerCase();
				if (node.closest("#reviseo-container")) return null;
				if (this.host && (node === this.host || this.host.contains(node)))
					return null;
				if (!SKIP_TAGS.has(tag) && hasDirectText(node)) return node;
			}
			node = node.parentElement;
		}
		return null;
	}

	private handleMouseOver(e: MouseEvent) {
		if (this.editingEl) return;
		const el = this.findEditable(e.target);
		if (!el || el === this.hoverEl) return;

		this.clearHover();
		this.hoverEl = el;
		this.hoverSaved = saveStyle(el);
		el.style.outline = `2px dashed ${ACCENT}`;
		el.style.outlineOffset = "2px";
		el.style.cursor = "pointer";
	}

	private handleMouseOut(e: MouseEvent) {
		if (!this.hoverEl) return;
		const related = e.relatedTarget;
		if (related instanceof Node && this.hoverEl.contains(related)) return;
		if (e.target === this.hoverEl || this.hoverEl.contains(e.target as Node)) {
			this.clearHover();
		}
	}

	private clearHover() {
		if (this.hoverEl && this.hoverSaved) {
			// Don't wipe the applied-edit marker styles.
			const appliedEntry = [...this.applied.values()].find(
				(a) => a.el === this.hoverEl,
			);
			restoreStyle(this.hoverEl, this.hoverSaved);
			if (appliedEntry) this.markApplied(this.hoverEl);
		}
		this.hoverEl = null;
		this.hoverSaved = null;
	}

	private handleClick(e: MouseEvent) {
		// Inside our own UI → let it through.
		if (this.host && e.composedPath().includes(this.host)) return;

		// Text mode swallows page interactions (links must not navigate).
		e.preventDefault();
		e.stopPropagation();

		if (this.editingEl) {
			const target = e.target;
			if (
				target instanceof Node &&
				(target === this.editingEl || this.editingEl.contains(target))
			) {
				return; // clicking inside the text being edited
			}
			this.commitEditing();
			return;
		}

		const el = this.findEditable(e.target);
		if (el) this.beginEditing(el);
	}

	private handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			e.preventDefault();
			e.stopPropagation();
			if (this.editingEl) {
				this.cancelEditing();
			} else {
				this.stop();
			}
			return;
		}

		if (e.key === "Enter" && this.editingEl && !e.shiftKey) {
			const target = e.target;
			if (
				target instanceof Node &&
				(target === this.editingEl || this.editingEl.contains(target))
			) {
				e.preventDefault();
				e.stopPropagation();
				this.commitEditing();
			}
		}
	}

	// ------------------------------------------------------------------
	// Editing lifecycle
	// ------------------------------------------------------------------

	private beginEditing(el: HTMLElement) {
		this.clearHover();

		const existing = [...this.applied.entries()].find(([, a]) => a.el === el);

		this.editingEl = el;
		this.editingSaved = saveStyle(el);
		this.editingOriginalHTML = existing
			? existing[1].originalHTML
			: el.innerHTML;
		this.editingRecordId = existing ? existing[0] : null;

		el.style.outline = `2px solid ${ACCENT}`;
		el.style.outlineOffset = "2px";
		el.style.cursor = "text";
		el.style.textDecoration = "none";

		try {
			(el as HTMLElement & { contentEditable: string }).contentEditable =
				"plaintext-only";
		} catch {
			el.contentEditable = "true";
		}
		el.focus();

		this.showToolbar(Boolean(existing));
	}

	private commitEditing() {
		const el = this.editingEl;
		if (!el || !this.editingSaved) return;

		const suggested = normalizeText(el.innerText);
		const originalText = normalizeText(
			(() => {
				const probe = document.createElement(el.tagName.toLowerCase());
				probe.innerHTML = this.editingOriginalHTML;
				return probe.textContent ?? "";
			})(),
		);

		el.contentEditable = "false";
		el.blur();

		if (!suggested || suggested === originalText) {
			// Nothing actually changed → same as cancel.
			this.cancelEditing();
			return;
		}

		const existingId = this.editingRecordId;
		if (existingId) {
			const record = this.edits.find((r) => r.id === existingId);
			if (record) record.suggestedText = suggested;
			const tracked = this.applied.get(existingId);
			if (tracked) restoreStyle(el, this.editingSaved);
			this.markApplied(el);
		} else {
			const record: TextEditRecord = {
				id: randomId(),
				selector: computeSelector(el),
				elementTag: el.tagName.toLowerCase(),
				originalText,
				suggestedText: suggested,
				pageUrl: window.location.href,
			};
			this.edits.push(record);
			restoreStyle(el, this.editingSaved);
			this.applied.set(record.id, {
				el,
				originalHTML: this.editingOriginalHTML,
				savedStyle: this.editingSaved,
			});
			this.markApplied(el);
		}

		this.editingEl = null;
		this.editingSaved = null;
		this.editingRecordId = null;
		this.hideToolbar();
		this.persist();
		this.renderBanner();
		this.callbacks?.onEditsChanged(this.getEdits());
	}

	private cancelEditing(silent = false) {
		const el = this.editingEl;
		if (!el || !this.editingSaved) return;

		el.contentEditable = "false";
		el.blur();

		if (this.editingRecordId) {
			// Was already an applied edit → back to the suggested text.
			const record = this.edits.find((r) => r.id === this.editingRecordId);
			el.textContent = record?.suggestedText ?? "";
			restoreStyle(el, this.editingSaved);
			this.markApplied(el);
		} else {
			el.innerHTML = this.editingOriginalHTML;
			restoreStyle(el, this.editingSaved);
		}

		this.editingEl = null;
		this.editingSaved = null;
		this.editingRecordId = null;
		if (!silent) this.hideToolbar();
	}

	/** Revert an in-progress re-edit back to the page's original text. */
	private revertEditing() {
		const el = this.editingEl;
		const id = this.editingRecordId;
		if (!el || !this.editingSaved || !id) return;

		el.contentEditable = "false";
		el.blur();
		el.innerHTML = this.editingOriginalHTML;
		restoreStyle(el, this.editingSaved);

		this.edits = this.edits.filter((r) => r.id !== id);
		this.applied.delete(id);

		this.editingEl = null;
		this.editingSaved = null;
		this.editingRecordId = null;
		this.hideToolbar();
		this.persist();
		this.renderBanner();
		this.callbacks?.onEditsChanged(this.getEdits());
	}

	/** Dashed-underline marker on elements carrying a suggestion. */
	private markApplied(el: HTMLElement) {
		el.style.textDecoration = `underline dashed ${ACCENT}`;
		el.style.textDecorationThickness = "2px";
		el.style.textUnderlineOffset = "4px";
		el.style.cursor = "pointer";
	}

	private applySuggestion(record: TextEditRecord, el: HTMLElement) {
		const savedStyle = saveStyle(el);
		const originalHTML = el.innerHTML;
		el.textContent = record.suggestedText;
		this.applied.set(record.id, { el, originalHTML, savedStyle });
		this.markApplied(el);
	}

	/** After reload / re-entering mode: re-show stored suggestions in place
	 *  where the element still exists and its text still matches. */
	private reapplyStoredEdits() {
		for (const record of this.edits) {
			if (record.pageUrl !== window.location.href) continue;
			if (this.applied.has(record.id)) continue;
			try {
				const el = document.querySelector(record.selector);
				if (
					el instanceof HTMLElement &&
					normalizeText(el.innerText) === record.originalText
				) {
					this.applySuggestion(record, el);
				}
			} catch {
				// Invalid selector for this DOM — the record itself still stands.
			}
		}
	}

	private persist() {
		try {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.edits));
		} catch {
			// Best-effort only.
		}
	}

	// ------------------------------------------------------------------
	// Shadow DOM UI
	// ------------------------------------------------------------------

	private mountShadowUI() {
		const host = document.createElement("div");
		host.id = "reviseo-text-edit-ui";
		host.style.cssText =
			"position:fixed;z-index:2147483646;top:0;left:0;width:0;height:0;";
		document.documentElement.appendChild(host);
		this.host = host;
		this.shadow = host.attachShadow({ mode: "open" });

		const style = document.createElement("style");
		style.textContent = `
			:host { all: initial; }
			* { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
			.banner {
				position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
				display: flex; align-items: center; gap: 10px;
				background: rgba(17, 17, 22, 0.92);
				-webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
				color: #fff; font-size: 13px; line-height: 1;
				padding: 10px 10px 10px 16px; border-radius: 999px;
				box-shadow: 0 8px 24px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.08);
				animation: slideDown .25s cubic-bezier(.2,.9,.3,1.2);
				white-space: nowrap;
			}
			@keyframes slideDown { from { opacity: 0; transform: translate(-50%, -12px); } to { opacity: 1; transform: translate(-50%, 0); } }
			.banner .hint { opacity: .65; }
			.banner .count {
				min-width: 22px; height: 22px; padding: 0 6px;
				display: inline-flex; align-items: center; justify-content: center;
				background: ${ACCENT}; border-radius: 999px; font-weight: 600; font-size: 12px;
			}
			.banner button { border: none; cursor: pointer; font-size: 13px; }
			.review {
				background: ${ACCENT}; color: #fff; font-weight: 600;
				padding: 8px 14px; border-radius: 999px; transition: background .15s;
			}
			.review:hover { background: ${ACCENT_DARK}; }
			.review:disabled { background: rgba(255,255,255,.14); color: rgba(255,255,255,.4); cursor: default; }
			.exit {
				background: transparent; color: rgba(255,255,255,.6);
				width: 28px; height: 28px; border-radius: 999px;
				display: inline-flex; align-items: center; justify-content: center;
			}
			.exit:hover { background: rgba(255,255,255,.12); color: #fff; }
			.toolbar {
				position: fixed; display: none; align-items: center; gap: 6px;
				background: rgba(17, 17, 22, 0.94);
				padding: 6px; border-radius: 12px;
				box-shadow: 0 8px 24px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.08);
			}
			.toolbar button {
				border: none; cursor: pointer; font-size: 12px; font-weight: 600;
				padding: 7px 12px; border-radius: 8px;
				display: inline-flex; align-items: center; gap: 5px;
			}
			.save { background: ${ACCENT}; color: #fff; }
			.save:hover { background: ${ACCENT_DARK}; }
			.cancel { background: rgba(255,255,255,.1); color: rgba(255,255,255,.85); }
			.cancel:hover { background: rgba(255,255,255,.18); }
			.revert { background: transparent; color: #f87171; }
			.revert:hover { background: rgba(248,113,113,.12); }
			.kbd { opacity: .55; font-weight: 400; font-size: 11px; }
		`;
		this.shadow.appendChild(style);

		const banner = document.createElement("div");
		banner.className = "banner";
		this.shadow.appendChild(banner);
		this.banner = banner;

		const toolbar = document.createElement("div");
		toolbar.className = "toolbar";
		this.shadow.appendChild(toolbar);
		this.toolbar = toolbar;
	}

	private renderBanner() {
		if (!this.banner) return;
		const count = this.edits.length;
		this.banner.innerHTML = `
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${ACCENT}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
			<span>Click any text to edit</span>
			<span class="hint">Esc exits</span>
			<span class="count">${count}</span>
			<button type="button" class="review" ${count === 0 ? "disabled" : ""}>Review &amp; submit</button>
			<button type="button" class="exit" aria-label="Exit text edit mode">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
			</button>
		`;
		this.banner
			.querySelector(".review")
			?.addEventListener("click", () =>
				this.callbacks?.onReview(this.getEdits()),
			);
		this.banner
			.querySelector(".exit")
			?.addEventListener("click", () => this.stop());
	}

	private showToolbar(isExistingEdit: boolean) {
		if (!this.toolbar) return;
		this.toolbar.innerHTML = `
			<button type="button" class="save">
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
				Save <span class="kbd">↵</span>
			</button>
			<button type="button" class="cancel">Cancel <span class="kbd">Esc</span></button>
			${isExistingEdit ? '<button type="button" class="revert">Revert</button>' : ""}
		`;
		this.toolbar
			.querySelector(".save")
			?.addEventListener("click", () => this.commitEditing());
		this.toolbar
			.querySelector(".cancel")
			?.addEventListener("click", () => this.cancelEditing());
		this.toolbar
			.querySelector(".revert")
			?.addEventListener("click", () => this.revertEditing());

		this.toolbar.style.display = "flex";
		this.positionToolbar();
	}

	private hideToolbar() {
		if (this.toolbar) this.toolbar.style.display = "none";
	}

	private positionToolbar() {
		if (!this.toolbar || !this.editingEl) return;
		const rect = this.editingEl.getBoundingClientRect();
		const toolbarHeight = 44;
		const gap = 8;

		// Above the element; below if it would leave the viewport (or collide
		// with the banner area).
		let top = rect.top - toolbarHeight - gap;
		if (top < 64) top = rect.bottom + gap;

		let left = rect.left;
		const maxLeft = window.innerWidth - 240;
		if (left > maxLeft) left = maxLeft;
		if (left < 8) left = 8;

		this.toolbar.style.top = `${top}px`;
		this.toolbar.style.left = `${left}px`;
	}
}
