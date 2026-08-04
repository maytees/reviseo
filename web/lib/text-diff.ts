// Word-level diff for text-edit suggestions (widget review + dashboard).
// Classic LCS on word tokens — suggestion texts are capped at 2000 chars, so
// the O(n·m) table stays tiny.

export type DiffSegment = {
	text: string;
	kind: "same" | "removed" | "added";
};

function tokenize(text: string): string[] {
	return text.split(/(\s+)/).filter((t) => t.length > 0);
}

/** Merge adjacent segments of the same kind so renderers get clean runs. */
function mergeSegments(segments: DiffSegment[]): DiffSegment[] {
	const merged: DiffSegment[] = [];
	for (const seg of segments) {
		const last = merged[merged.length - 1];
		if (last && last.kind === seg.kind) {
			last.text += seg.text;
		} else {
			merged.push({ ...seg });
		}
	}
	return merged;
}

/**
 * Diff two strings by words. Returns one merged stream where `removed`
 * segments come from `original` and `added` segments from `suggested`.
 */
export function diffWords(original: string, suggested: string): DiffSegment[] {
	const a = tokenize(original);
	const b = tokenize(suggested);

	// LCS length table
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

	// Walk the table to emit segments
	const segments: DiffSegment[] = [];
	let i = 0;
	let j = 0;
	while (i < m && j < n) {
		if (a[i] === b[j]) {
			segments.push({ text: a[i], kind: "same" });
			i++;
			j++;
		} else if (table[i + 1][j] >= table[i][j + 1]) {
			segments.push({ text: a[i], kind: "removed" });
			i++;
		} else {
			segments.push({ text: b[j], kind: "added" });
			j++;
		}
	}
	while (i < m) {
		segments.push({ text: a[i], kind: "removed" });
		i++;
	}
	while (j < n) {
		segments.push({ text: b[j], kind: "added" });
		j++;
	}

	return mergeSegments(segments);
}
