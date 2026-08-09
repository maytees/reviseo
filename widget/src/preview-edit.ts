// Preview engine. Replays SAVED suggestions (text/style/image edits fetched
// from the server) onto the live page so the client team can see the proposed
// site in place. Read-only toward the page: every mutation is recorded and
// wholesale-restored on exit — nothing persists.
//
// Data arrives via the modal iframe (reviseo origin — it carries the session
// cookie); this engine never talks to the network itself. Approve/reject also
// happens in the modal (lead only); the engine just re-renders on refresh.

import { diffWords, T } from "./edit-shared";

export type PreviewTextEdit = {
	id: string;
	selector: string;
	originalText: string;
	suggestedText: string;
	pageUrl: string;
};
export type PreviewStyleEdit = {
	id: string;
	selector: string;
	changes: { property: string; before: string; after: string }[];
	pageUrl: string;
};
export type PreviewImageEdit = {
	id: string;
	selector: string;
	originalSrc: string;
	newKey?: string | null;
	newUrl?: string | null;
	pageUrl: string;
	/** Ready-to-render URL (data URL for bucket uploads, remote URL as-is) —
	 *  resolved by the modal iframe, which can send cookies to the serve route. */
	displayUrl?: string;
};

export type PreviewItem = {
	id: string;
	title: string;
	type: "TEXT_EDIT" | "STYLE_EDIT" | "IMAGE_EDIT";
	approval: "DIRECT" | "PENDING" | "APPROVED" | "REJECTED";
	approvalNote?: string | null;
	pageUrl: string;
	createdAt: string;
	author: { id: string; name: string | null } | null;
	textEdits: PreviewTextEdit[];
	styleEdits: PreviewStyleEdit[];
	imageEdits: PreviewImageEdit[];
};

export type PreviewViewer = {
	role: "lead" | "member" | "developer";
	userId: string;
};

/** One applied change on one element. */
type AppliedUnit = {
	item: PreviewItem;
	editId: string;
	el: HTMLElement;
	kind: "text" | "style" | "image";
	diffHtml: string;
};

type Callbacks = {
	/** Ask the loader to (re)fetch data through the modal iframe. */
	onRequestData: () => void;
	/** User clicked "Changes" in the banner — open the modal panel. */
	onOpenPanel: () => void;
	/** Mode ended (Esc or ✕). Page fully restored. */
	onExit: () => void;
};

const TYPE_COLORS: Record<PreviewItem["type"], string> = {
	TEXT_EDIT: "#8b5cf6",
	STYLE_EDIT: "#d946ef",
	IMAGE_EDIT: "#06b6d4",
};

const APPROVAL_LABELS: Record<string, { label: string; color: string } | null> =
	{
		DIRECT: null,
		PENDING: { label: "Awaiting approval", color: "#f59e0b" },
		APPROVED: { label: "Approved", color: "#22c55e" },
		REJECTED: { label: "Rejected", color: T.destructive },
	};

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function samePage(pageUrl: string): boolean {
	try {
		return new URL(pageUrl).pathname === window.location.pathname;
	} catch {
		return false;
	}
}

export class PreviewEngine {
	private active = false;
	private callbacks: Callbacks | null = null;

	private items: PreviewItem[] = [];
	private viewer: PreviewViewer | null = null;

	/** Per-item on/off (feedback id → enabled). Default on. */
	private enabled = new Map<string, boolean>();
	/** Master flip: false = show the original page while staying in mode. */
	private showingPreview = true;

	private applied: AppliedUnit[] = [];
	/** Submissions whose selector matched nothing on this page. */
	private missing: { item: PreviewItem; editId: string }[] = [];

	/** Untouched state per element, captured before the first change. */
	private savedText = new Map<HTMLElement, string>();
	private savedStyle = new Map<HTMLElement, string | null>();
	private savedImage = new Map<
		HTMLElement,
		{ src: string; srcset: string | null; sizes: string | null }
	>();

	private host: HTMLDivElement | null = null;
	private shadow: ShadowRoot | null = null;
	private banner: HTMLDivElement | null = null;
	private chip: HTMLDivElement | null = null;
	private chipEl: HTMLElement | null = null;

	private cleanupFns: Array<() => void> = [];

	isActive(): boolean {
		return this.active;
	}

	getItems(): PreviewItem[] {
		return [...this.items];
	}

	getViewer(): PreviewViewer | null {
		return this.viewer;
	}

	/** Submissions with at least one edit for the current page. */
	getOnPageCount(): number {
		return this.items.filter((item) =>
			[...item.textEdits, ...item.styleEdits, ...item.imageEdits].some((e) =>
				samePage(e.pageUrl),
			),
		).length;
	}

	getMissingIds(): string[] {
		return [...new Set(this.missing.map((m) => m.item.id))];
	}

	isItemEnabled(id: string): boolean {
		return this.enabled.get(id) !== false;
	}

	start(callbacks: Callbacks) {
		if (this.active) return;
		this.active = true;
		this.callbacks = callbacks;
		this.showingPreview = true;

		this.mountShadowUI();
		this.renderBanner("loading");

		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				e.stopPropagation();
				this.stop();
			}
		};
		const onOver = (e: Event) => this.handleMouseOver(e as MouseEvent);
		const onOut = (e: Event) => this.handleMouseOut(e as MouseEvent);
		const onReposition = () => this.positionChip();

		window.addEventListener("keydown", onKey, true);
		document.addEventListener("mouseover", onOver, true);
		document.addEventListener("mouseout", onOut, true);
		window.addEventListener("scroll", onReposition, true);
		window.addEventListener("resize", onReposition);
		this.cleanupFns.push(() => {
			window.removeEventListener("keydown", onKey, true);
			document.removeEventListener("mouseover", onOver, true);
			document.removeEventListener("mouseout", onOut, true);
			window.removeEventListener("scroll", onReposition, true);
			window.removeEventListener("resize", onReposition);
		});

		callbacks.onRequestData();
	}

	stop() {
		if (!this.active) return;
		this.active = false;

		this.restoreAll();
		this.items = [];
		this.viewer = null;
		this.enabled.clear();
		this.missing = [];

		for (const fn of this.cleanupFns) fn();
		this.cleanupFns = [];

		this.host?.remove();
		this.host = null;
		this.shadow = null;
		this.banner = null;
		this.chip = null;
		this.chipEl = null;

		const cb = this.callbacks;
		this.callbacks = null;
		cb?.onExit();
	}

	/** Fresh data from the server (initial fetch or post-decision refresh). */
	setData(items: PreviewItem[], viewer: PreviewViewer) {
		this.items = items;
		this.viewer = viewer;
		// Rejected submissions never render on the page — the author sees them
		// in their dashboard's "Needs changes" strip instead.
		if (!this.active) return;
		this.applyAll();
		this.renderBanner("ready");
	}

	setItemEnabled(id: string, on: boolean) {
		this.enabled.set(id, on);
		if (this.active) this.applyAll();
	}

	setMaster(on: boolean) {
		this.showingPreview = on;
		if (this.active) {
			this.applyAll();
			this.renderBanner("ready");
		}
	}

	/** Scroll the submission's first located element into view and pulse it. */
	focusItem(id: string) {
		const unit = this.applied.find((u) => u.item.id === id);
		if (!unit) return;
		unit.el.scrollIntoView({ behavior: "smooth", block: "center" });
		const original = unit.el.style.transition;
		unit.el.style.transition = "outline-color .2s";
		let flips = 0;
		const pulse = window.setInterval(() => {
			unit.el.style.outlineColor =
				flips % 2 === 0 ? "#ffffff" : TYPE_COLORS[unit.item.type];
			flips += 1;
			if (flips >= 6) {
				window.clearInterval(pulse);
				unit.el.style.transition = original;
				unit.el.style.outlineColor = TYPE_COLORS[unit.item.type];
			}
		}, 200);
	}

	// ── Apply / restore ────────────────────────────────────────────────────

	/** Single renderer: restore everything, then apply what's enabled.
	 *  Items arrive newest-first; apply oldest-first so when two edits touch
	 *  the same element, the newest suggestion is the one left visible. */
	private applyAll() {
		this.restoreAll();
		if (!this.showingPreview) return;

		for (const item of [...this.items].reverse()) {
			if (item.approval === "REJECTED") continue;
			if (this.enabled.get(item.id) === false) continue;

			for (const edit of item.textEdits) {
				if (!samePage(edit.pageUrl)) continue;
				const el = this.locate(edit.selector);
				if (!el) {
					this.missing.push({ item, editId: edit.id });
					continue;
				}
				if (!this.savedText.has(el)) {
					this.savedText.set(el, el.textContent ?? "");
				}
				this.captureStyle(el);
				el.textContent = edit.suggestedText;
				// Source-HTML newlines would render as fake centering otherwise
				el.style.whiteSpace = "normal";
				this.markApplied(el, item, edit.id, "text", this.textDiffHtml(edit));
			}

			for (const edit of item.styleEdits) {
				if (!samePage(edit.pageUrl)) continue;
				const el = this.locate(edit.selector);
				if (!el) {
					this.missing.push({ item, editId: edit.id });
					continue;
				}
				this.captureStyle(el);
				for (const change of edit.changes) {
					el.style.setProperty(change.property, change.after);
				}
				this.markApplied(
					el,
					item,
					edit.id,
					"style",
					this.styleDiffHtml(edit),
				);
			}

			for (const edit of item.imageEdits) {
				if (!samePage(edit.pageUrl)) continue;
				const el = this.locate(edit.selector);
				if (!(el instanceof HTMLImageElement)) {
					this.missing.push({ item, editId: edit.id });
					continue;
				}
				const displayUrl = edit.displayUrl || edit.newUrl;
				if (!displayUrl) {
					this.missing.push({ item, editId: edit.id });
					continue;
				}
				if (!this.savedImage.has(el)) {
					this.savedImage.set(el, {
						src: el.getAttribute("src") ?? "",
						srcset: el.getAttribute("srcset"),
						sizes: el.getAttribute("sizes"),
					});
				}
				this.captureStyle(el);
				el.removeAttribute("srcset");
				el.removeAttribute("sizes");
				el.src = displayUrl;
				this.markApplied(
					el,
					item,
					edit.id,
					"image",
					`<div class="label">Image replaced</div><div class="muted">Hover chip shows the suggestion — original restores when you exit preview.</div>`,
				);
			}
		}
	}

	private restoreAll() {
		for (const [el, text] of this.savedText) {
			el.textContent = text;
		}
		this.savedText.clear();
		for (const [el, image] of this.savedImage) {
			if (image.srcset !== null) el.setAttribute("srcset", image.srcset);
			if (image.sizes !== null) el.setAttribute("sizes", image.sizes);
			el.src = image.src;
		}
		this.savedImage.clear();
		for (const [el, style] of this.savedStyle) {
			if (style === null) el.removeAttribute("style");
			else el.setAttribute("style", style);
		}
		this.savedStyle.clear();
		this.applied = [];
		this.missing = [];
		this.hideChip();
	}

	private locate(selector: string): HTMLElement | null {
		try {
			const el = document.querySelector(selector);
			return el instanceof HTMLElement ? el : null;
		} catch {
			return null;
		}
	}

	private captureStyle(el: HTMLElement) {
		if (!this.savedStyle.has(el)) {
			this.savedStyle.set(el, el.getAttribute("style"));
		}
	}

	private markApplied(
		el: HTMLElement,
		item: PreviewItem,
		editId: string,
		kind: AppliedUnit["kind"],
		diffHtml: string,
	) {
		el.style.outline = `1px dashed ${TYPE_COLORS[item.type]}`;
		el.style.outlineOffset = "2px";
		this.applied.push({ item, editId, el, kind, diffHtml });
	}

	// ── Hover chip ─────────────────────────────────────────────────────────

	private handleMouseOver(e: MouseEvent) {
		const target = e.target;
		if (!(target instanceof Node)) return;
		// Last match = newest suggestion (applyAll runs oldest-first), which is
		// also the change actually visible on the element.
		const units = this.applied.filter((u) => u.el.contains(target));
		const unit = units[units.length - 1];
		if (unit) this.showChip(unit);
	}

	private handleMouseOut(e: MouseEvent) {
		if (!this.chipEl) return;
		const next = e.relatedTarget;
		if (next instanceof Node && this.chipEl.contains(next)) return;
		this.hideChip();
	}

	private showChip(unit: AppliedUnit) {
		if (!this.chip) return;
		this.chipEl = unit.el;
		const approval = APPROVAL_LABELS[unit.item.approval];
		const author = unit.item.author?.name || "A teammate";
		const isOwn = unit.item.author?.id === this.viewer?.userId;
		const when = this.relativeTime(unit.item.createdAt);

		this.chip.innerHTML = `
			<div class="chiphead">
				<span class="dot" style="background:${TYPE_COLORS[unit.item.type]}"></span>
				<span class="author">${escapeHtml(isOwn ? "You" : author)}</span>
				<span class="muted">· ${escapeHtml(when)}</span>
				${
					approval
						? `<span class="badge" style="color:${approval.color};border-color:${approval.color}40">${approval.label}</span>`
						: ""
				}
			</div>
			<div class="chipbody">${unit.diffHtml}</div>
			<div class="chipfoot">Manage in the Changes panel</div>
		`;
		this.chip.style.display = "flex";
		this.positionChip();
	}

	private hideChip() {
		if (this.chip) this.chip.style.display = "none";
		this.chipEl = null;
	}

	private positionChip() {
		if (!this.chip || !this.chipEl || this.chip.style.display === "none")
			return;
		const rect = this.chipEl.getBoundingClientRect();
		const chipRect = this.chip.getBoundingClientRect();
		let top = rect.top - chipRect.height - 10;
		if (top < 8) top = rect.bottom + 10;
		let left = rect.left;
		if (left + chipRect.width > window.innerWidth - 8) {
			left = window.innerWidth - chipRect.width - 8;
		}
		if (left < 8) left = 8;
		this.chip.style.top = `${top}px`;
		this.chip.style.left = `${left}px`;
	}

	private textDiffHtml(edit: PreviewTextEdit): string {
		const segments = diffWords(edit.originalText, edit.suggestedText);
		const html = segments
			.map((s) =>
				s.kind === "same"
					? escapeHtml(s.text)
					: `<span class="${s.kind}">${escapeHtml(s.text)}</span>`,
			)
			.join("");
		return `<div class="label">Suggested copy</div><div class="diff">${html}</div>`;
	}

	private styleDiffHtml(edit: PreviewStyleEdit): string {
		const rows = edit.changes
			.map(
				(c) =>
					`<div class="stylerow"><span class="prop">${escapeHtml(c.property)}</span><span class="removed">${escapeHtml(c.before)}</span><span class="arrow">→</span><span class="added">${escapeHtml(c.after)}</span></div>`,
			)
			.join("");
		return `<div class="label">Suggested styles</div>${rows}`;
	}

	private relativeTime(iso: string): string {
		const then = new Date(iso).getTime();
		if (Number.isNaN(then)) return "";
		const minutes = Math.round((Date.now() - then) / 60000);
		if (minutes < 1) return "just now";
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.round(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		return `${Math.round(hours / 24)}d ago`;
	}

	// ── Shadow UI ──────────────────────────────────────────────────────────

	private mountShadowUI() {
		const host = document.createElement("div");
		host.id = "reviseo-preview-ui";
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
			.hint { color: ${T.mutedForeground}; }
			.count {
				min-width: 22px; height: 22px; padding: 0 7px;
				display: inline-flex; align-items: center; justify-content: center;
				background: ${T.primary};
				background: ${T.primaryOklch};
				color: #fff; border-radius: 999px; font-weight: 600; font-size: 12px;
			}
			.banner button { border: none; cursor: pointer; font-size: 13px; font-family: inherit; }
			.primarybtn {
				background: ${T.primary};
				background: ${T.primaryOklch};
				color: #fff; font-weight: 500;
				padding: 9px 14px; border-radius: 10px; transition: background .15s;
			}
			.primarybtn:hover { background: ${T.primaryHover}; }
			.ghostbtn {
				background: rgba(255,255,255,.08); color: ${T.foreground};
				padding: 9px 14px; border-radius: 10px; transition: background .15s;
			}
			.ghostbtn:hover { background: rgba(255,255,255,.14); }
			.exit {
				background: transparent; color: ${T.mutedForeground};
				width: 30px; height: 30px; border-radius: 10px;
				display: inline-flex; align-items: center; justify-content: center;
				transition: background .15s, color .15s;
			}
			.exit:hover { background: rgba(255,255,255,.08); color: ${T.foreground}; }
			.chip {
				position: fixed; display: none; flex-direction: column; gap: 8px;
				max-width: 360px;
				background: ${T.card};
				background: ${T.cardOklch};
				color: ${T.foreground}; font-size: 13px; line-height: 1.55;
				padding: 10px 12px; border: 1px solid ${T.border}; border-radius: 12px;
				box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
				white-space: normal;
			}
			.chiphead { display: flex; align-items: center; gap: 6px; }
			.dot { width: 8px; height: 8px; border-radius: 999px; }
			.author { font-weight: 600; }
			.muted { color: ${T.mutedForeground}; font-size: 12px; }
			.badge {
				margin-left: 4px; font-size: 11px; font-weight: 600;
				padding: 2px 7px; border-radius: 999px; border: 1px solid;
			}
			.label {
				font-size: 11px; font-weight: 600; letter-spacing: .03em;
				text-transform: uppercase; color: ${T.mutedForeground};
				margin-bottom: 4px;
			}
			.removed {
				background: rgba(229, 72, 77, 0.14); color: #f87171;
				text-decoration: line-through; border-radius: 3px; padding: 0 2px;
			}
			.added {
				background: rgba(34, 197, 94, 0.16); color: #4ade80;
				border-radius: 3px; padding: 0 2px;
			}
			.stylerow { display: flex; align-items: center; gap: 6px; padding: 1px 0; }
			.prop { font-family: ui-monospace, monospace; font-size: 12px; color: ${T.mutedForeground}; }
			.arrow { color: ${T.mutedForeground}; }
			.chipfoot { color: ${T.mutedForeground}; font-size: 11px; }
		`;
		this.shadow.appendChild(style);

		const banner = document.createElement("div");
		banner.className = "banner";
		this.shadow.appendChild(banner);
		this.banner = banner;

		const chip = document.createElement("div");
		chip.className = "chip";
		this.shadow.appendChild(chip);
		this.chip = chip;
	}

	private renderBanner(state: "loading" | "ready") {
		if (!this.banner) return;

		if (state === "loading") {
			this.banner.innerHTML = `<span class="hint">Loading suggested changes…</span>`;
			const exitBtn = document.createElement("button");
			exitBtn.className = "exit";
			exitBtn.textContent = "✕";
			exitBtn.addEventListener("click", () => this.stop());
			this.banner.appendChild(exitBtn);
			return;
		}

		const onPage = this.getOnPageCount();
		this.banner.innerHTML = "";

		const count = document.createElement("span");
		count.className = "count";
		count.textContent = String(onPage);
		this.banner.appendChild(count);

		const hint = document.createElement("span");
		hint.className = "hint";
		hint.textContent =
			onPage === 1
				? "suggested change on this page"
				: "suggested changes on this page";
		this.banner.appendChild(hint);

		const flip = document.createElement("button");
		flip.className = "ghostbtn";
		flip.textContent = this.showingPreview ? "Show original" : "Show preview";
		flip.addEventListener("click", () => this.setMaster(!this.showingPreview));
		this.banner.appendChild(flip);

		const panel = document.createElement("button");
		panel.className = "primarybtn";
		panel.textContent = "Changes";
		panel.addEventListener("click", () => this.callbacks?.onOpenPanel());
		this.banner.appendChild(panel);

		const exit = document.createElement("button");
		exit.className = "exit";
		exit.textContent = "✕";
		exit.addEventListener("click", () => this.stop());
		this.banner.appendChild(exit);
	}
}
