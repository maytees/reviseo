// Shared foundation for the widget's in-page edit modes (text, style, image).
// Everything here is framework-free and side-effect-free — the mode engines
// (text-edit.ts, style-edit.ts) compose these pieces.

// Reviseo dark-theme tokens (oklch from web/app/(main)/globals.css, hex
// fallbacks for browsers without oklch()).
export const T = {
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

// Elements that never make sense as edit targets.
export const SKIP_TAGS = new Set([
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

export function normalizeText(text: string): string {
	return text.replace(/\s+/g, " ").trim();
}

export function randomId(prefix: string): string {
	return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Direct (non-descendant) visible text content of an element. */
export function hasDirectText(el: Element): boolean {
	for (const node of el.childNodes) {
		if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim()) {
			return true;
		}
	}
	return false;
}

/** Shortest reasonably-robust CSS selector: nearest id anchor, then
 *  :nth-of-type steps. Best-effort — records store enough context to stay
 *  meaningful when the selector goes stale. */
export function computeSelector(el: Element): string {
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

export type DiffSegment = { text: string; kind: "same" | "removed" | "added" };

/** Word-level LCS diff (mirror of web/lib/text-diff.ts). Inputs capped at
 *  2000 chars by the record schema. */
export function diffWords(original: string, suggested: string): DiffSegment[] {
	const a = original.split(/(\s+)/).filter((t) => t.length > 0);
	const b = suggested.split(/(\s+)/).filter((t) => t.length > 0);
	const m = a.length;
	const n = b.length;
	const table: number[][] = Array.from({ length: m + 1 }, () =>
		new Array(n + 1).fill(0),
	);
	for (let i = m - 1; i >= 0; i--) {
		for (let j = n - 1; j >= 0; j--) {
			table[i][j] =
				a[i] === b[j]
					? table[i + 1][j + 1] + 1
					: Math.max(table[i + 1][j], table[i][j + 1]);
		}
	}

	const segments: DiffSegment[] = [];
	const push = (text: string, kind: DiffSegment["kind"]) => {
		const last = segments[segments.length - 1];
		if (last && last.kind === kind) last.text += text;
		else segments.push({ text, kind });
	};

	let i = 0;
	let j = 0;
	while (i < m && j < n) {
		if (a[i] === b[j]) {
			push(a[i], "same");
			i++;
			j++;
		} else if (table[i + 1][j] >= table[i][j + 1]) {
			push(a[i], "removed");
			i++;
		} else {
			push(b[j], "added");
			j++;
		}
	}
	while (i < m) push(a[i++], "removed");
	while (j < n) push(b[j++], "added");

	return segments;
}

/** Read a persisted record array; [] on any failure. */
export function readStoredRecords<Rec>(storageKey: string): Rec[] {
	try {
		const raw = sessionStorage.getItem(storageKey);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

/** Persist a record array; best-effort. */
export function writeStoredRecords<Rec>(storageKey: string, records: Rec[]) {
	try {
		sessionStorage.setItem(storageKey, JSON.stringify(records));
	} catch {
		// sessionStorage unavailable — records just won't survive reloads.
	}
}
