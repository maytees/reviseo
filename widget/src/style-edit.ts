// Style-edit engine. Runs in the loader (the only Reviseo code with access
// to the customer page's DOM). Lets a client click any element and tweak
// colors, typography, and spacing in a floating panel with a live preview,
// accumulating a batch of suggested style changes.
//
// Same architecture as text-edit.ts: Shadow DOM UI in Reviseo tokens, all
// element visuals rendered over a per-element baseline (`syncElementStyles`
// is the single renderer), records persisted to sessionStorage, review and
// submission handled by the modal iframe.

import {
	computeSelector,
	randomId,
	readStoredRecords,
	SKIP_TAGS,
	T,
	writeStoredRecords,
} from "./edit-shared";

export type StyleChange = {
	/** CSS property in kebab-case, e.g. "font-size". */
	property: string;
	before: string;
	after: string;
};

export type StyleEditRecord = {
	id: string;
	selector: string;
	elementTag: string;
	pageUrl: string;
	changes: StyleChange[];
};

type Callbacks = {
	onEditsChanged: (edits: StyleEditRecord[]) => void;
	onReview: (edits: StyleEditRecord[]) => void;
	onExit: () => void;
};

export const STYLE_EDITS_STORAGE_KEY = "__reviseo_style_edits_v1";

/** The editable properties, in panel order. camel = CSSStyleDeclaration key. */
const PROPS = [
	{ kebab: "color", camel: "color", kind: "color", label: "Text color" },
	{
		kebab: "background-color",
		camel: "backgroundColor",
		kind: "color",
		label: "Background",
	},
	{ kebab: "font-size", camel: "fontSize", kind: "px", label: "Font size" },
	{
		kebab: "font-weight",
		camel: "fontWeight",
		kind: "weight",
		label: "Font weight",
	},
	{ kebab: "margin-top", camel: "marginTop", kind: "px", label: "Top" },
	{ kebab: "margin-right", camel: "marginRight", kind: "px", label: "Right" },
	{
		kebab: "margin-bottom",
		camel: "marginBottom",
		kind: "px",
		label: "Bottom",
	},
	{ kebab: "margin-left", camel: "marginLeft", kind: "px", label: "Left" },
	{ kebab: "padding-top", camel: "paddingTop", kind: "px", label: "Top" },
	{ kebab: "padding-right", camel: "paddingRight", kind: "px", label: "Right" },
	{
		kebab: "padding-bottom",
		camel: "paddingBottom",
		kind: "px",
		label: "Bottom",
	},
	{ kebab: "padding-left", camel: "paddingLeft", kind: "px", label: "Left" },
	{
		kebab: "border-radius",
		camel: "borderRadius",
		kind: "px",
		label: "Radius",
	},
] as const;

type PropDef = (typeof PROPS)[number];

/** rgb()/rgba() → #rrggbb for <input type=color>. Best-effort. */
function toHex(value: string): string {
	const m = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
	if (!m) return value.startsWith("#") ? value : "#000000";
	const hex = (n: string) => Number(n).toString(16).padStart(2, "0");
	return `#${hex(m[1])}${hex(m[2])}${hex(m[3])}`;
}

export class StyleEditEngine {
	private active = false;
	private callbacks: Callbacks | null = null;

	private edits: StyleEditRecord[] = [];
	/** Elements currently carrying an applied record. */
	private applied = new Map<string, { el: HTMLElement }>();
	/** Untouched inline `style` attribute per element (first touch). */
	private baseline = new Map<HTMLElement, string | null>();

	private hoverEl: HTMLElement | null = null;

	private editingEl: HTMLElement | null = null;
	private editingRecordId: string | null = null;
	/** before-values shown in the panel (record's on re-edit, computed on new). */
	private beforeValues = new Map<string, string>();
	/** kebab property → current (live-applied) value for dirty props only. */
	private pending = new Map<string, string>();

	private host: HTMLDivElement | null = null;
	private shadow: ShadowRoot | null = null;
	private banner: HTMLDivElement | null = null;
	private panel: HTMLDivElement | null = null;
	private tip: HTMLDivElement | null = null;
	private tipEl: HTMLElement | null = null;

	private cleanupFns: Array<() => void> = [];

	constructor() {
		this.edits = readStoredRecords<StyleEditRecord>(STYLE_EDITS_STORAGE_KEY);
	}

	getEdits(): StyleEditRecord[] {
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
		const onReposition = () => {
			this.positionPanel();
			this.positionTip();
		};

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

	/** Exit mode. Restores every touched element; records stay stored. */
	stop() {
		if (!this.active) return;
		this.active = false;

		this.cancelEditing();
		this.hoverEl = null;
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
		this.panel = null;
		this.tip = null;
		this.tipEl = null;

		const cb = this.callbacks;
		this.callbacks = null;
		cb?.onExit();
	}

	removeEdit(id: string) {
		this.edits = this.edits.filter((e) => e.id !== id);
		const tracked = this.applied.get(id);
		if (tracked) {
			this.applied.delete(id);
			this.releaseElement(tracked.el);
		}
		this.persist();
		this.renderBanner();
		this.callbacks?.onEditsChanged(this.getEdits());
	}

	clearAfterSubmit() {
		this.edits = [];
		this.persist();
		this.stop();
	}

	// ------------------------------------------------------------------
	// Styling: single renderer over the per-element baseline
	// ------------------------------------------------------------------

	private touch(el: HTMLElement) {
		if (!this.baseline.has(el)) {
			this.baseline.set(el, el.getAttribute("style"));
		}
	}

	private recordFor(el: HTMLElement): StyleEditRecord | null {
		for (const [id, entry] of this.applied) {
			if (entry.el === el) {
				return this.edits.find((r) => r.id === id) ?? null;
			}
		}
		return null;
	}

	private syncElementStyles(el: HTMLElement) {
		const base = this.baseline.get(el);
		if (base === undefined) return;
		if (base === null) el.removeAttribute("style");
		else el.setAttribute("style", base);

		const editing = el === this.editingEl;
		const hovered = el === this.hoverEl;
		const record = this.recordFor(el);

		// Values first, chrome second.
		if (editing) {
			for (const [prop, value] of this.pending) {
				el.style.setProperty(prop, value);
			}
			el.style.outline = `2px solid ${T.primary}`;
			el.style.outlineOffset = "3px";
			return;
		}

		if (record) {
			for (const change of record.changes) {
				el.style.setProperty(change.property, change.after);
			}
			el.style.outline = `1px dashed ${T.primary}`;
			el.style.outlineOffset = "2px";
			el.style.cursor = "pointer";
		}

		if (hovered) {
			el.style.outline = `2px dashed ${T.primary}`;
			el.style.outlineOffset = "3px";
			el.style.cursor = "pointer";
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

	// ------------------------------------------------------------------
	// Interaction
	// ------------------------------------------------------------------

	private findTarget(start: EventTarget | null): HTMLElement | null {
		let node = start instanceof Element ? start : null;
		while (node && node !== document.body) {
			if (node instanceof HTMLElement) {
				const tag = node.tagName.toLowerCase();
				if (node.closest("#reviseo-container")) return null;
				if (this.host && (node === this.host || this.host.contains(node)))
					return null;
				if (!SKIP_TAGS.has(tag)) return node;
			}
			node = node.parentElement;
		}
		return null;
	}

	private handleMouseOver(e: MouseEvent) {
		if (this.editingEl) return;
		const el = this.findTarget(e.target);
		if (!el || el === this.hoverEl) return;

		this.clearHover();
		this.hoverEl = el;
		this.touch(el);
		this.syncElementStyles(el);

		const record = this.recordFor(el);
		if (record) this.showTip(el, record);
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
		if (el) this.syncElementStyles(el);
	}

	private handleClick(e: MouseEvent) {
		if (this.host && e.composedPath().includes(this.host)) return;

		e.preventDefault();
		e.stopPropagation();

		if (this.editingEl) {
			// Clicking anywhere outside the panel commits the current tweak.
			this.commitEditing();
			return;
		}

		const el = this.findTarget(e.target);
		if (el) this.beginEditing(el);
	}

	private handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			e.preventDefault();
			e.stopPropagation();
			if (this.editingEl) this.cancelEditing();
			else this.stop();
		}
	}

	// ------------------------------------------------------------------
	// Editing lifecycle
	// ------------------------------------------------------------------

	private beginEditing(el: HTMLElement) {
		this.clearHover();
		this.touch(el);

		const record = this.recordFor(el);
		this.editingEl = el;
		this.editingRecordId = record
			? (this.edits.find((r) => r === record)?.id ?? null)
			: null;

		this.pending.clear();
		this.beforeValues.clear();

		if (record) {
			// Re-edit: panel starts from the record's befores + afters.
			for (const change of record.changes) {
				this.beforeValues.set(change.property, change.before);
				this.pending.set(change.property, change.after);
			}
		}

		// Remaining befores from computed style (with the element in its
		// original state — baseline restore happens inside sync).
		const base = this.baseline.get(el) ?? null;
		const current = el.getAttribute("style");
		if (base === null) el.removeAttribute("style");
		else el.setAttribute("style", base);
		const computed = getComputedStyle(el);
		for (const prop of PROPS) {
			if (!this.beforeValues.has(prop.kebab)) {
				this.beforeValues.set(
					prop.kebab,
					computed.getPropertyValue(prop.kebab),
				);
			}
		}
		if (current === null) el.removeAttribute("style");
		else el.setAttribute("style", current);

		this.syncElementStyles(el);
		this.showPanel(Boolean(record));
	}

	private commitEditing() {
		const el = this.editingEl;
		if (!el) return;

		// Keep only properties that actually differ from their before value.
		const changes: StyleChange[] = [];
		for (const [property, after] of this.pending) {
			const before = this.beforeValues.get(property) ?? "";
			if (after !== before) changes.push({ property, before, after });
		}

		const existingId = this.editingRecordId;
		this.editingEl = null;
		this.editingRecordId = null;

		if (changes.length === 0) {
			// Nothing changed → same as cancel/revert.
			if (existingId) {
				this.edits = this.edits.filter((r) => r.id !== existingId);
				this.applied.delete(existingId);
			}
			this.releaseElement(el);
			this.hidePanel();
			this.persist();
			this.renderBanner();
			this.callbacks?.onEditsChanged(this.getEdits());
			return;
		}

		if (existingId) {
			const record = this.edits.find((r) => r.id === existingId);
			if (record) record.changes = changes;
		} else {
			const record: StyleEditRecord = {
				id: randomId("se"),
				selector: computeSelector(el),
				elementTag: el.tagName.toLowerCase(),
				pageUrl: window.location.href,
				changes,
			};
			this.edits.push(record);
			this.applied.set(record.id, { el });
		}

		this.pending.clear();
		this.syncElementStyles(el);
		this.hidePanel();
		this.persist();
		this.renderBanner();
		this.callbacks?.onEditsChanged(this.getEdits());
	}

	private cancelEditing() {
		const el = this.editingEl;
		if (!el) return;

		this.editingEl = null;
		this.editingRecordId = null;
		this.pending.clear();
		this.syncElementStyles(el); // back to applied record or baseline
		if (!this.recordFor(el)) this.releaseElement(el);
		this.hidePanel();
	}

	/** Revert an applied element entirely (from the panel). */
	private revertEditing() {
		const el = this.editingEl;
		const id = this.editingRecordId;
		if (!el) return;

		this.editingEl = null;
		this.editingRecordId = null;
		this.pending.clear();

		if (id) {
			this.edits = this.edits.filter((r) => r.id !== id);
			this.applied.delete(id);
		}
		this.releaseElement(el);
		this.hidePanel();
		this.persist();
		this.renderBanner();
		this.callbacks?.onEditsChanged(this.getEdits());
	}

	private reapplyStoredEdits() {
		for (const record of this.edits) {
			if (record.pageUrl !== window.location.href) continue;
			if (this.applied.has(record.id)) continue;
			try {
				const el = document.querySelector(record.selector);
				if (el instanceof HTMLElement) {
					this.touch(el);
					this.applied.set(record.id, { el });
					this.syncElementStyles(el);
				}
			} catch {
				// Selector doesn't resolve in this DOM — record still stands.
			}
		}
	}

	private persist() {
		writeStoredRecords(STYLE_EDITS_STORAGE_KEY, this.edits);
	}

	// ------------------------------------------------------------------
	// Shadow DOM UI
	// ------------------------------------------------------------------

	private mountShadowUI() {
		const host = document.createElement("div");
		host.id = "reviseo-style-edit-ui";
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
			.banner button, .panel button { border: none; cursor: pointer; font-family: inherit; }
			.review {
				background: ${T.primary}; background: ${T.primaryOklch};
				color: #fff; font-weight: 500; font-size: 13px;
				padding: 9px 14px; border-radius: 10px; transition: background .15s;
			}
			.review:hover { background: ${T.primaryHover}; }
			.review:disabled { background: rgba(255,255,255,.08); color: ${T.mutedForeground}; cursor: default; }
			.exit {
				background: transparent; color: ${T.mutedForeground};
				width: 30px; height: 30px; border-radius: 10px;
				display: inline-flex; align-items: center; justify-content: center;
				transition: background .15s, color .15s; font-size: 13px;
			}
			.exit:hover { background: rgba(255,255,255,.08); color: ${T.foreground}; }
			.panel {
				position: fixed; display: none; flex-direction: column; gap: 10px;
				width: 264px; max-height: min(70vh, 560px); overflow-y: auto;
				background: ${T.card}; background: ${T.cardOklch};
				color: ${T.foreground}; font-size: 12px;
				padding: 12px; border: 1px solid ${T.border}; border-radius: 14px;
				box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
			}
			.panel h4 {
				margin: 0; font-size: 11px; font-weight: 600; letter-spacing: .04em;
				text-transform: uppercase; color: ${T.mutedForeground};
			}
			.row { display: flex; align-items: center; gap: 8px; }
			.row label { flex: 1; color: ${T.foreground}; font-size: 12px; }
			.grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
			.grid4 .cell { display: flex; flex-direction: column; gap: 3px; }
			.grid4 .cell span { font-size: 10px; color: ${T.mutedForeground}; text-align: center; }
			input[type="number"], input[type="text"], select {
				width: 100%; background: rgba(255,255,255,.06); color: ${T.foreground};
				border: 1px solid ${T.border}; border-radius: 8px;
				padding: 6px 8px; font-size: 12px; font-family: inherit; outline: none;
			}
			input[type="number"] { -moz-appearance: textfield; }
			input:focus, select:focus { border-color: ${T.primary}; }
			input[type="color"] {
				width: 30px; height: 30px; padding: 2px; border: 1px solid ${T.border};
				border-radius: 8px; background: transparent; cursor: pointer;
			}
			.num { width: 72px; flex: none; }
			.hex { width: 88px; flex: none; font-family: ui-monospace, monospace; }
			.actions { display: flex; gap: 6px; justify-content: flex-end; padding-top: 2px; }
			.actions button {
				font-size: 12px; font-weight: 500; padding: 8px 12px; border-radius: 8px;
				transition: background .15s;
			}
			.save { background: ${T.primary}; background: ${T.primaryOklch}; color: #fff; }
			.save:hover { background: ${T.primaryHover}; }
			.cancel { background: rgba(255,255,255,.08); color: ${T.foreground}; }
			.cancel:hover { background: rgba(255,255,255,.14); }
			.revert { background: transparent; color: ${T.destructive}; margin-right: auto; }
			.revert:hover { background: rgba(229,72,77,.12); }
			.tip {
				position: fixed; display: none; flex-direction: column; gap: 6px;
				max-width: 320px;
				background: ${T.card}; background: ${T.cardOklch};
				color: ${T.foreground}; font-size: 12px; line-height: 1.5;
				padding: 10px 12px; border: 1px solid ${T.border}; border-radius: 12px;
				box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
				pointer-events: none; white-space: normal;
			}
			.tip .label {
				font-size: 11px; font-weight: 600; letter-spacing: .03em;
				text-transform: uppercase; color: ${T.mutedForeground};
			}
			.tip .chg { display: flex; align-items: center; gap: 6px; }
			.tip .prop { color: ${T.mutedForeground}; font-family: ui-monospace, monospace; font-size: 11px; }
			.tip .val { font-family: ui-monospace, monospace; font-size: 11px; }
			.tip .swatch {
				display: inline-block; width: 10px; height: 10px; border-radius: 3px;
				border: 1px solid ${T.border}; vertical-align: middle;
			}
			.tip .arrow { color: ${T.mutedForeground}; }
		`;
		this.shadow.appendChild(style);

		const banner = document.createElement("div");
		banner.className = "banner";
		this.shadow.appendChild(banner);
		this.banner = banner;

		const panel = document.createElement("div");
		panel.className = "panel";
		this.shadow.appendChild(panel);
		this.panel = panel;

		const tip = document.createElement("div");
		tip.className = "tip";
		this.shadow.appendChild(tip);
		this.tip = tip;
	}

	private renderBanner() {
		if (!this.banner) return;
		const count = this.edits.length;
		this.banner.innerHTML = `
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${T.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
			<span>Click any element to restyle</span>
			<span class="hint">Esc exits</span>
			<span class="count">${count}</span>
			<button type="button" class="review" ${count === 0 ? "disabled" : ""}>Review &amp; submit</button>
			<button type="button" class="exit" aria-label="Exit style edit mode">
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

	/** Live-apply one property from a panel control. */
	private setPending(property: string, value: string) {
		const el = this.editingEl;
		if (!el) return;
		const before = this.beforeValues.get(property) ?? "";
		if (value === before) this.pending.delete(property);
		else this.pending.set(property, value);
		this.syncElementStyles(el);
	}

	private showPanel(isExisting: boolean) {
		const panel = this.panel;
		const el = this.editingEl;
		if (!panel || !el) return;

		panel.textContent = "";

		const addSection = (title: string) => {
			const h = document.createElement("h4");
			h.textContent = title;
			panel.appendChild(h);
		};

		const currentValue = (prop: PropDef) =>
			this.pending.get(prop.kebab) ?? this.beforeValues.get(prop.kebab) ?? "";

		const addColorRow = (prop: PropDef) => {
			const row = document.createElement("div");
			row.className = "row";
			const label = document.createElement("label");
			label.textContent = prop.label;
			const color = document.createElement("input");
			color.type = "color";
			color.value = toHex(currentValue(prop));
			const hex = document.createElement("input");
			hex.type = "text";
			hex.className = "hex";
			hex.value = toHex(currentValue(prop));
			color.addEventListener("input", () => {
				hex.value = color.value;
				this.setPending(prop.kebab, color.value);
			});
			hex.addEventListener("input", () => {
				if (/^#[0-9a-fA-F]{6}$/.test(hex.value)) {
					color.value = hex.value;
					this.setPending(prop.kebab, hex.value);
				}
			});
			row.append(label, color, hex);
			panel.appendChild(row);
		};

		const pxInput = (prop: PropDef, compact = false) => {
			const input = document.createElement("input");
			input.type = "number";
			if (!compact) input.className = "num";
			input.step = "1";
			input.value = String(Math.round(parseFloat(currentValue(prop)) || 0));
			input.addEventListener("input", () => {
				const n = parseFloat(input.value);
				if (!Number.isNaN(n)) this.setPending(prop.kebab, `${n}px`);
			});
			return input;
		};

		const addPxRow = (prop: PropDef) => {
			const row = document.createElement("div");
			row.className = "row";
			const label = document.createElement("label");
			label.textContent = prop.label;
			row.append(label, pxInput(prop));
			panel.appendChild(row);
		};

		const addWeightRow = (prop: PropDef) => {
			const row = document.createElement("div");
			row.className = "row";
			const label = document.createElement("label");
			label.textContent = prop.label;
			const select = document.createElement("select");
			for (const w of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {
				const opt = document.createElement("option");
				opt.value = String(w);
				opt.textContent = String(w);
				select.appendChild(opt);
			}
			select.value = String(parseInt(currentValue(prop), 10) || 400);
			select.style.width = "88px";
			select.addEventListener("input", () =>
				this.setPending(prop.kebab, select.value),
			);
			row.append(label, select);
			panel.appendChild(row);
		};

		const addQuad = (title: string, props: PropDef[]) => {
			addSection(title);
			const grid = document.createElement("div");
			grid.className = "grid4";
			for (const prop of props) {
				const cell = document.createElement("div");
				cell.className = "cell";
				const span = document.createElement("span");
				span.textContent = prop.label;
				cell.append(pxInput(prop, true), span);
				grid.appendChild(cell);
			}
			panel.appendChild(grid);
		};

		const byKebab = (k: string) => PROPS.find((p) => p.kebab === k) as PropDef;

		addSection("Colors");
		addColorRow(byKebab("color"));
		addColorRow(byKebab("background-color"));

		addSection("Typography");
		addPxRow(byKebab("font-size"));
		addWeightRow(byKebab("font-weight"));

		addQuad("Margin", [
			byKebab("margin-top"),
			byKebab("margin-right"),
			byKebab("margin-bottom"),
			byKebab("margin-left"),
		]);
		addQuad("Padding", [
			byKebab("padding-top"),
			byKebab("padding-right"),
			byKebab("padding-bottom"),
			byKebab("padding-left"),
		]);

		addSection("Border");
		addPxRow(byKebab("border-radius"));

		const actions = document.createElement("div");
		actions.className = "actions";
		if (isExisting) {
			const revert = document.createElement("button");
			revert.type = "button";
			revert.className = "revert";
			revert.textContent = "Revert";
			revert.addEventListener("click", () => this.revertEditing());
			actions.appendChild(revert);
		}
		const cancel = document.createElement("button");
		cancel.type = "button";
		cancel.className = "cancel";
		cancel.textContent = "Cancel";
		cancel.addEventListener("click", () => this.cancelEditing());
		const save = document.createElement("button");
		save.type = "button";
		save.className = "save";
		save.textContent = "Save";
		save.addEventListener("click", () => this.commitEditing());
		actions.append(cancel, save);
		panel.appendChild(actions);

		panel.style.display = "flex";
		this.positionPanel();
	}

	private hidePanel() {
		if (this.panel) this.panel.style.display = "none";
	}

	private positionPanel() {
		const panel = this.panel;
		const el = this.editingEl;
		if (!panel || !el || panel.style.display === "none") return;

		const rect = el.getBoundingClientRect();
		const panelRect = panel.getBoundingClientRect();
		const gap = 12;

		// Prefer beside the element (right, then left); else below/above.
		let left = rect.right + gap;
		if (left + panelRect.width > window.innerWidth - 8) {
			left = rect.left - panelRect.width - gap;
		}
		let top: number;
		if (left < 8) {
			left = Math.min(
				Math.max(8, rect.left),
				window.innerWidth - panelRect.width - 8,
			);
			top = rect.bottom + gap;
			if (top + panelRect.height > window.innerHeight - 8) {
				top = rect.top - panelRect.height - gap;
			}
		} else {
			top = Math.min(
				Math.max(64, rect.top),
				window.innerHeight - panelRect.height - 8,
			);
		}
		if (top < 64) top = 64;

		panel.style.left = `${left}px`;
		panel.style.top = `${top}px`;
	}

	/** Hover tooltip: property rows with before → after (+ color swatches). */
	private showTip(el: HTMLElement, record: StyleEditRecord) {
		const tip = this.tip;
		if (!tip) return;

		tip.textContent = "";
		const label = document.createElement("span");
		label.className = "label";
		label.textContent = "Your style changes";
		tip.appendChild(label);

		for (const change of record.changes) {
			const row = document.createElement("div");
			row.className = "chg";
			const prop = document.createElement("span");
			prop.className = "prop";
			prop.textContent = `${change.property}:`;
			row.appendChild(prop);
			row.appendChild(this.valueNode(change.property, change.before));
			const arrow = document.createElement("span");
			arrow.className = "arrow";
			arrow.textContent = "→";
			row.appendChild(arrow);
			row.appendChild(this.valueNode(change.property, change.after));
			tip.appendChild(row);
		}

		this.tipEl = el;
		tip.style.display = "flex";
		this.positionTip();
	}

	private valueNode(property: string, value: string): HTMLElement {
		const wrap = document.createElement("span");
		wrap.className = "val";
		if (property.includes("color")) {
			const swatch = document.createElement("span");
			swatch.className = "swatch";
			swatch.style.background = value;
			wrap.appendChild(swatch);
			wrap.appendChild(document.createTextNode(` ${toHex(value)}`));
		} else {
			wrap.textContent = value;
		}
		return wrap;
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
