// Text-edit engine. Runs in the loader (the only Reviseo code with access to
// the customer page's DOM). Lets a client click any text on the page, type a
// replacement in place, and accumulate a batch of suggested copy changes.
//
// All UI (mode banner, save/cancel toolbar) lives in a Shadow DOM styled with
// Reviseo's design tokens (see web/app/(main)/globals.css) so it looks like
// the rest of the product while host-page CSS can't restyle it. Element
// highlights are inline styles applied over a saved per-element baseline —
// `syncElementStyles` is the single place visual state is rendered, so
// hover/edit/marker styles can never leak or stack.
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

// Reviseo dark-theme tokens (oklch from globals.css, hex fallbacks for
// browsers without oklch()).
const T = {
	primary: "#6d3df5",
	primaryOklch: "oklch(0.5053 0.235 286.8637)",
	primaryHover: "#5c2fe0",
	card: "#242424",
	cardOklch: "oklch(0.2264 0 0)",
	foreground: "#ebebeb",
	mutedForeground: "#b5b5b5",
	border: "rgba(255, 255, 255, 0.1)",
	destructive: "#e5484d",
	font: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
};

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

export class TextEditEngine {
	private active = false;
	private callbacks: Callbacks | null = null;

	private edits: TextEditRecord[] = [];
	/** Elements currently carrying an applied suggestion. */
	private applied = new Map<
		string,
		{ el: HTMLElement; originalHTML: string }
	>();

	/** Each element's untouched inline `style` attribute, captured the first
	 *  time the engine styles it. All visual states are rendered on top of
	 *  this baseline, so releasing an element is a plain attribute restore. */
	private baseline = new Map<HTMLElement, string | null>();

	private hoverEl: HTMLElement | null = null;

	private editingEl: HTMLElement | null = null;
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

	/** Exit mode. Restores every element to its original markup and styles;
	 *  recorded edits stay (sessionStorage) for later. */
	stop() {
		if (!this.active) return;
		this.active = false;

		this.cancelEditing(true);
		this.hoverEl = null;

		for (const { el, originalHTML } of this.applied.values()) {
			el.innerHTML = originalHTML;
		}
		this.applied.clear();

		// Every element the engine ever styled goes back to its untouched
		// inline style — nothing can be left behind.
		for (const [el, style] of this.baseline) {
			if (style === null) el.removeAttribute("style");
			else el.setAttribute("style", style);
		}
		this.baseline.clear();

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
			this.applied.delete(id);
			this.releaseElement(tracked.el);
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
	// Styling: single renderer over a per-element baseline
	// ------------------------------------------------------------------

	/** Capture the element's untouched inline style once. */
	private touch(el: HTMLElement) {
		if (!this.baseline.has(el)) {
			this.baseline.set(el, el.getAttribute("style"));
		}
	}

	private isApplied(el: HTMLElement): boolean {
		for (const entry of this.applied.values()) {
			if (entry.el === el) return true;
		}
		return false;
	}

	/** Render the element's current visual state from scratch: baseline
	 *  first, then exactly the styles its state calls for. */
	private syncElementStyles(el: HTMLElement) {
		const base = this.baseline.get(el);
		if (base === undefined) return; // never touched
		if (base === null) el.removeAttribute("style");
		else el.setAttribute("style", base);

		const editing = el === this.editingEl;
		const hovered = el === this.hoverEl;
		const applied = this.isApplied(el);

		if (editing) {
			el.style.outline = `2px solid ${T.primary}`;
			el.style.outlineOffset = "3px";
			el.style.borderRadius = "2px";
			el.style.cursor = "text";
			// plaintext-only editing forces pre-wrap rendering; without this,
			// source-formatting newlines/indentation show up as fake centering.
			el.style.whiteSpace = "normal";
			return;
		}

		if (applied) {
			el.style.textDecoration = `underline dashed ${T.primary}`;
			el.style.textDecorationThickness = "2px";
			el.style.textUnderlineOffset = "4px";
			el.style.cursor = "pointer";
		}

		if (hovered) {
			el.style.outline = `2px dashed ${T.primary}`;
			el.style.outlineOffset = "3px";
			el.style.borderRadius = "2px";
			el.style.cursor = "pointer";
		}
	}

	/** Element leaves the engine entirely → baseline restore + forget. */
	private releaseElement(el: HTMLElement) {
		const base = this.baseline.get(el);
		if (base !== undefined) {
			if (base === null) el.removeAttribute("style");
			else el.setAttribute("style", base);
			this.baseline.delete(el);
		}
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
		this.touch(el);
		this.syncElementStyles(el);
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
		const el = this.hoverEl;
		this.hoverEl = null;
		if (el) this.syncElementStyles(el);
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
		this.editingOriginalHTML = existing
			? existing[1].originalHTML
			: el.innerHTML;
		this.editingRecordId = existing ? existing[0] : null;

		this.touch(el);

		// Plain-text editing: flatten to normalized text so the source
		// markup's newlines/indentation can't render as phantom whitespace.
		el.textContent = normalizeText(el.innerText);

		this.syncElementStyles(el);

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
		if (!el) return;

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
			this.applied.set(record.id, {
				el,
				originalHTML: this.editingOriginalHTML,
			});
		}

		this.editingEl = null;
		this.editingRecordId = null;
		this.syncElementStyles(el);
		this.hideToolbar();
		this.persist();
		this.renderBanner();
		this.callbacks?.onEditsChanged(this.getEdits());
	}

	private cancelEditing(silent = false) {
		const el = this.editingEl;
		if (!el) return;

		el.contentEditable = "false";
		el.blur();

		if (this.editingRecordId) {
			// Was already an applied edit → back to the suggested text.
			const record = this.edits.find((r) => r.id === this.editingRecordId);
			el.textContent = record?.suggestedText ?? "";
		} else {
			el.innerHTML = this.editingOriginalHTML;
		}

		this.editingEl = null;
		this.editingRecordId = null;
		this.syncElementStyles(el);
		if (!this.isApplied(el)) this.releaseElement(el);
		if (!silent) this.hideToolbar();
	}

	/** Revert an in-progress re-edit back to the page's original text. */
	private revertEditing() {
		const el = this.editingEl;
		const id = this.editingRecordId;
		if (!el || !id) return;

		el.contentEditable = "false";
		el.blur();
		el.innerHTML = this.editingOriginalHTML;

		this.edits = this.edits.filter((r) => r.id !== id);
		this.applied.delete(id);

		this.editingEl = null;
		this.editingRecordId = null;
		this.releaseElement(el);
		this.hideToolbar();
		this.persist();
		this.renderBanner();
		this.callbacks?.onEditsChanged(this.getEdits());
	}

	private applySuggestion(record: TextEditRecord, el: HTMLElement) {
		this.touch(el);
		const originalHTML = el.innerHTML;
		el.textContent = record.suggestedText;
		this.applied.set(record.id, { el, originalHTML });
		this.syncElementStyles(el);
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
	// Shadow DOM UI (Reviseo design tokens)
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
			* { box-sizing: border-box; font-family: ${T.font}; -webkit-font-smoothing: antialiased; }
			.banner {
				position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
				display: flex; align-items: center; gap: 12px;
				background: ${T.card};
				background: ${T.cardOklch};
				color: ${T.foreground}; font-size: 13px; line-height: 1;
				padding: 10px 10px 10px 16px;
				border: 1px solid ${T.border}; border-radius: 16px;
				box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
				animation: slideDown .25s cubic-bezier(.2,.9,.3,1.15);
				white-space: nowrap;
			}
			@keyframes slideDown { from { opacity: 0; transform: translate(-50%, -12px); } to { opacity: 1; transform: translate(-50%, 0); } }
			.banner .hint { color: ${T.mutedForeground}; }
			.banner .count {
				min-width: 22px; height: 22px; padding: 0 7px;
				display: inline-flex; align-items: center; justify-content: center;
				background: ${T.primary};
				background: ${T.primaryOklch};
				color: #fff; border-radius: 999px; font-weight: 600; font-size: 12px;
			}
			.banner button { border: none; cursor: pointer; font-size: 13px; font-family: inherit; }
			.review {
				background: ${T.primary};
				background: ${T.primaryOklch};
				color: #fff; font-weight: 500;
				padding: 9px 14px; border-radius: 10px; transition: background .15s;
			}
			.review:hover { background: ${T.primaryHover}; }
			.review:disabled { background: rgba(255,255,255,.08); color: ${T.mutedForeground}; cursor: default; }
			.exit {
				background: transparent; color: ${T.mutedForeground};
				width: 30px; height: 30px; border-radius: 10px;
				display: inline-flex; align-items: center; justify-content: center;
				transition: background .15s, color .15s;
			}
			.exit:hover { background: rgba(255,255,255,.08); color: ${T.foreground}; }
			.toolbar {
				position: fixed; display: none; align-items: center; gap: 6px;
				background: ${T.card};
				background: ${T.cardOklch};
				padding: 6px; border: 1px solid ${T.border}; border-radius: 12px;
				box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
			}
			.toolbar button {
				border: none; cursor: pointer; font-size: 12px; font-weight: 500;
				font-family: inherit;
				padding: 8px 12px; border-radius: 8px;
				display: inline-flex; align-items: center; gap: 6px;
				transition: background .15s;
			}
			.save {
				background: ${T.primary};
				background: ${T.primaryOklch};
				color: #fff;
			}
			.save:hover { background: ${T.primaryHover}; }
			.cancel { background: rgba(255,255,255,.08); color: ${T.foreground}; }
			.cancel:hover { background: rgba(255,255,255,.14); }
			.revert { background: transparent; color: ${T.destructive}; }
			.revert:hover { background: rgba(229,72,77,.12); }
			.kbd { color: ${T.mutedForeground}; font-weight: 400; font-size: 11px; }
			.save .kbd { color: rgba(255,255,255,.7); }
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
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${T.primary}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
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
		const toolbarHeight = 46;
		const gap = 10;

		// Above the element; below if it would leave the viewport (or collide
		// with the banner area).
		let top = rect.top - toolbarHeight - gap;
		if (top < 64) top = rect.bottom + gap;

		let left = rect.left;
		const maxLeft = window.innerWidth - 250;
		if (left > maxLeft) left = maxLeft;
		if (left < 8) left = 8;

		this.toolbar.style.top = `${top}px`;
		this.toolbar.style.left = `${left}px`;
	}
}
