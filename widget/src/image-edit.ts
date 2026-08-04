// Image-edit engine. Runs in the loader (the only Reviseo code with access
// to the customer page's DOM). Lets a client click any <img> and swap it for
// an uploaded / pasted / linked replacement with a live in-place preview,
// accumulating a batch of suggested image replacements.
//
// The replacement UI itself (file upload, URL, clipboard paste) lives in the
// modal iframe on the Reviseo origin — the loader only picks the element and
// applies the preview. Uploaded previews arrive as data URLs because blob
// URLs don't cross origins and the serve route needs cookies the customer
// page can't always send; they're kept in memory only (sessionStorage keeps
// the record, not the pixels).

import {
	computeSelector,
	randomId,
	readStoredRecords,
	SKIP_TAGS,
	T,
	writeStoredRecords,
} from "./edit-shared";

export type ImageEditRecord = {
	id: string;
	selector: string;
	pageUrl: string;
	originalSrc: string;
	/** Bucket key when the replacement was uploaded/pasted. */
	newKey?: string;
	/** Remote URL when the client linked an image. */
	newUrl?: string;
};

export type ImagePickContext = {
	originalSrc: string;
	naturalWidth: number;
	naturalHeight: number;
	isExisting: boolean;
};

type Callbacks = {
	onEditsChanged: (edits: ImageEditRecord[]) => void;
	onReview: (edits: (ImageEditRecord & { previewUrl?: string })[]) => void;
	/** An image was clicked — open the replacement picker in the modal. */
	onPick: (ctx: ImagePickContext) => void;
	onExit: () => void;
};

export const IMAGE_EDITS_STORAGE_KEY = "__reviseo_image_edits_v1";

export class ImageEditEngine {
	private active = false;
	private callbacks: Callbacks | null = null;

	private edits: ImageEditRecord[] = [];
	private applied = new Map<
		string,
		{ el: HTMLImageElement; originalSrc: string; originalSrcset: string }
	>();
	/** In-memory only: record id → data URL for uploaded previews. */
	private previews = new Map<string, string>();
	/** Untouched inline `style` attribute per element (first touch). */
	private baseline = new Map<HTMLElement, string | null>();

	private hoverEl: HTMLImageElement | null = null;
	/** Element awaiting a replacement from the modal picker. */
	private pickingEl: HTMLImageElement | null = null;

	private host: HTMLDivElement | null = null;
	private shadow: ShadowRoot | null = null;
	private banner: HTMLDivElement | null = null;
	private tip: HTMLDivElement | null = null;
	private tipEl: HTMLElement | null = null;

	private cleanupFns: Array<() => void> = [];

	constructor() {
		this.edits = readStoredRecords<ImageEditRecord>(IMAGE_EDITS_STORAGE_KEY);
	}

	getEdits(): ImageEditRecord[] {
		return [...this.edits];
	}

	/** Records enriched with in-memory previews, for the review modal. */
	getReviewEdits(): (ImageEditRecord & { previewUrl?: string })[] {
		return this.edits.map((edit) => ({
			...edit,
			previewUrl: this.previews.get(edit.id),
		}));
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
		const onReposition = () => this.positionTip();

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

	/** Exit mode. Restores every image; records stay stored. */
	stop() {
		if (!this.active) return;
		this.active = false;

		this.pickingEl = null;
		this.hoverEl = null;

		for (const { el, originalSrc, originalSrcset } of this.applied.values()) {
			el.src = originalSrc;
			if (originalSrcset) el.setAttribute("srcset", originalSrcset);
		}
		this.applied.clear();

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
		this.tip = null;
		this.tipEl = null;

		const cb = this.callbacks;
		this.callbacks = null;
		cb?.onExit();
	}

	removeEdit(id: string) {
		this.edits = this.edits.filter((e) => e.id !== id);
		this.previews.delete(id);
		const tracked = this.applied.get(id);
		if (tracked) {
			tracked.el.src = tracked.originalSrc;
			if (tracked.originalSrcset)
				tracked.el.setAttribute("srcset", tracked.originalSrcset);
			this.applied.delete(id);
			this.releaseElement(tracked.el);
		}
		this.persist();
		this.renderBanner();
		this.callbacks?.onEditsChanged(this.getEdits());
	}

	clearAfterSubmit() {
		this.edits = [];
		this.previews.clear();
		this.persist();
		this.stop();
	}

	/** The modal picked a replacement for the pending element. */
	applyPick(input: { displayUrl: string; key?: string; url?: string }) {
		const el = this.pickingEl;
		this.pickingEl = null;
		if (!el || !this.active) return;

		const existing = [...this.applied.entries()].find(([, a]) => a.el === el);

		if (existing) {
			const record = this.edits.find((r) => r.id === existing[0]);
			if (record) {
				record.newKey = input.key;
				record.newUrl = input.url;
				if (input.key) this.previews.set(record.id, input.displayUrl);
				else this.previews.delete(record.id);
			}
			el.src = input.displayUrl;
		} else {
			const record: ImageEditRecord = {
				id: randomId("ie"),
				selector: computeSelector(el),
				pageUrl: window.location.href,
				originalSrc: el.currentSrc || el.src,
				newKey: input.key,
				newUrl: input.url,
			};
			this.edits.push(record);
			if (input.key) this.previews.set(record.id, input.displayUrl);
			this.applied.set(record.id, {
				el,
				originalSrc: el.src,
				originalSrcset: el.getAttribute("srcset") ?? "",
			});
			this.touch(el);
			// srcset would override our preview src at some viewports.
			el.removeAttribute("srcset");
			el.src = input.displayUrl;
			this.markApplied(el);
		}

		this.persist();
		this.renderBanner();
		this.callbacks?.onEditsChanged(this.getEdits());
	}

	/** The modal picker closed without choosing anything. */
	cancelPick() {
		this.pickingEl = null;
	}

	/** Revert one applied element from the modal picker. */
	revertPick() {
		const el = this.pickingEl;
		this.pickingEl = null;
		if (!el) return;
		const entry = [...this.applied.entries()].find(([, a]) => a.el === el);
		if (entry) this.removeEdit(entry[0]);
	}

	// ------------------------------------------------------------------
	// Styling
	// ------------------------------------------------------------------

	private touch(el: HTMLElement) {
		if (!this.baseline.has(el)) {
			this.baseline.set(el, el.getAttribute("style"));
		}
	}

	private releaseElement(el: HTMLElement) {
		const base = this.baseline.get(el);
		if (base !== undefined) {
			if (base === null) el.removeAttribute("style");
			else el.setAttribute("style", base);
			this.baseline.delete(el);
		}
	}

	private isApplied(el: HTMLElement): boolean {
		for (const entry of this.applied.values()) {
			if (entry.el === el) return true;
		}
		return false;
	}

	private syncElementStyles(el: HTMLElement) {
		const base = this.baseline.get(el);
		if (base === undefined) return;
		if (base === null) el.removeAttribute("style");
		else el.setAttribute("style", base);

		if (this.isApplied(el)) this.markApplied(el);

		if (el === this.hoverEl) {
			el.style.outline = `2px dashed ${T.primary}`;
			el.style.outlineOffset = "3px";
			el.style.cursor = "pointer";
		}
	}

	private markApplied(el: HTMLElement) {
		el.style.outline = `1px dashed ${T.primary}`;
		el.style.outlineOffset = "2px";
		el.style.cursor = "pointer";
	}

	// ------------------------------------------------------------------
	// Interaction
	// ------------------------------------------------------------------

	private findImage(start: EventTarget | null): HTMLImageElement | null {
		let node = start instanceof Element ? start : null;
		while (node && node !== document.body) {
			if (node.closest("#reviseo-container")) return null;
			if (this.host && (node === this.host || this.host.contains(node)))
				return null;
			if (node instanceof HTMLImageElement) return node;
			// Click often lands on a wrapper (e.g. <picture>, a link) — check
			// for a single direct image inside it.
			if (
				!(node instanceof HTMLImageElement) &&
				!SKIP_TAGS.has(node.tagName.toLowerCase())
			) {
				const images = node.querySelectorAll("img");
				if (images.length === 1) return images[0];
			}
			node = node.parentElement;
		}
		return null;
	}

	private handleMouseOver(e: MouseEvent) {
		const el = this.findImage(e.target);
		if (!el || el === this.hoverEl) return;

		this.clearHover();
		this.hoverEl = el;
		this.touch(el);
		this.syncElementStyles(el);

		const entry = [...this.applied.entries()].find(([, a]) => a.el === el);
		if (entry) {
			const record = this.edits.find((r) => r.id === entry[0]);
			if (record) this.showTip(el, record, entry[1].originalSrc);
		}
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
		this.hideTip();
		if (el) {
			this.syncElementStyles(el);
			if (!this.isApplied(el)) this.releaseElement(el);
		}
	}

	private handleClick(e: MouseEvent) {
		if (this.host && e.composedPath().includes(this.host)) return;

		e.preventDefault();
		e.stopPropagation();

		const el = this.findImage(e.target);
		if (!el) return;

		this.pickingEl = el;
		this.callbacks?.onPick({
			originalSrc: el.currentSrc || el.src,
			naturalWidth: el.naturalWidth,
			naturalHeight: el.naturalHeight,
			isExisting: this.isApplied(el),
		});
	}

	private handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			e.preventDefault();
			e.stopPropagation();
			this.stop();
		}
	}

	private reapplyStoredEdits() {
		for (const record of this.edits) {
			if (record.pageUrl !== window.location.href) continue;
			if (this.applied.has(record.id)) continue;
			// Uploaded previews don't survive reloads (data kept in memory);
			// the record itself still counts and submits fine.
			const displayUrl = record.newUrl ?? this.previews.get(record.id);
			if (!displayUrl) continue;
			try {
				const el = document.querySelector(record.selector);
				if (
					el instanceof HTMLImageElement &&
					(el.currentSrc || el.src) === record.originalSrc
				) {
					this.applied.set(record.id, {
						el,
						originalSrc: el.src,
						originalSrcset: el.getAttribute("srcset") ?? "",
					});
					this.touch(el);
					el.removeAttribute("srcset");
					el.src = displayUrl;
					this.markApplied(el);
				}
			} catch {
				// Selector doesn't resolve — the record still stands.
			}
		}
	}

	private persist() {
		writeStoredRecords(IMAGE_EDITS_STORAGE_KEY, this.edits);
	}

	// ------------------------------------------------------------------
	// Shadow DOM UI
	// ------------------------------------------------------------------

	private mountShadowUI() {
		const host = document.createElement("div");
		host.id = "reviseo-image-edit-ui";
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
				background: ${T.card}; background: ${T.cardOklch};
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
				background: ${T.primary}; background: ${T.primaryOklch};
				color: #fff; border-radius: 999px; font-weight: 600; font-size: 12px;
			}
			.banner button { border: none; cursor: pointer; font-size: 13px; font-family: inherit; }
			.review {
				background: ${T.primary}; background: ${T.primaryOklch};
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
			.tip {
				position: fixed; display: none; flex-direction: column; gap: 8px;
				background: ${T.card}; background: ${T.cardOklch};
				color: ${T.foreground}; font-size: 12px;
				padding: 10px 12px; border: 1px solid ${T.border}; border-radius: 12px;
				box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
				pointer-events: none;
			}
			.tip .label {
				font-size: 11px; font-weight: 600; letter-spacing: .03em;
				text-transform: uppercase; color: ${T.mutedForeground};
			}
			.tip .thumbs { display: flex; align-items: center; gap: 8px; }
			.tip img {
				width: 72px; height: 48px; object-fit: cover;
				border-radius: 6px; border: 1px solid ${T.border};
			}
			.tip .arrow { color: ${T.mutedForeground}; }
		`;
		this.shadow.appendChild(style);

		const banner = document.createElement("div");
		banner.className = "banner";
		this.shadow.appendChild(banner);
		this.banner = banner;

		const tip = document.createElement("div");
		tip.className = "tip";
		this.shadow.appendChild(tip);
		this.tip = tip;
	}

	private renderBanner() {
		if (!this.banner) return;
		const count = this.edits.length;
		this.banner.innerHTML = `
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${T.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
			<span>Click any image to replace it</span>
			<span class="hint">Esc exits</span>
			<span class="count">${count}</span>
			<button type="button" class="review" ${count === 0 ? "disabled" : ""}>Review &amp; submit</button>
			<button type="button" class="exit" aria-label="Exit image edit mode">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
			</button>
		`;
		this.banner
			.querySelector(".review")
			?.addEventListener("click", () =>
				this.callbacks?.onReview(this.getReviewEdits()),
			);
		this.banner
			.querySelector(".exit")
			?.addEventListener("click", () => this.stop());
	}

	/** Hover tooltip: before → after thumbnails. */
	private showTip(
		el: HTMLElement,
		record: ImageEditRecord,
		originalSrc: string,
	) {
		const tip = this.tip;
		if (!tip) return;

		tip.textContent = "";
		const label = document.createElement("span");
		label.className = "label";
		label.textContent = "Your replacement";
		tip.appendChild(label);

		const thumbs = document.createElement("div");
		thumbs.className = "thumbs";
		const before = document.createElement("img");
		before.src = originalSrc;
		const arrow = document.createElement("span");
		arrow.className = "arrow";
		arrow.textContent = "→";
		const after = document.createElement("img");
		after.src = record.newUrl ?? this.previews.get(record.id) ?? "";
		thumbs.append(before, arrow, after);
		tip.appendChild(thumbs);

		this.tipEl = el;
		tip.style.display = "flex";
		this.positionTip();
	}

	private hideTip() {
		this.tipEl = null;
		if (this.tip) this.tip.style.display = "none";
	}

	private positionTip() {
		const tip = this.tip;
		const el = this.tipEl;
		if (!tip || !el || tip.style.display === "none") return;

		const rect = el.getBoundingClientRect();
		const tipRect = tip.getBoundingClientRect();
		const gap = 10;

		let top = rect.top - tipRect.height - gap;
		if (top < 64) top = rect.bottom + gap;

		let left = rect.left;
		const maxLeft = window.innerWidth - tipRect.width - 8;
		if (left > maxLeft) left = maxLeft;
		if (left < 8) left = 8;

		tip.style.top = `${top}px`;
		tip.style.left = `${left}px`;
	}
}
