"use client";

import type { StyleChange } from "@/lib/validations";

/** True when the value is renderable as a color swatch. */
const isColorProp = (property: string) => property.includes("color");

const ValueChip = ({
	property,
	value,
}: {
	property: string;
	value: string;
}) => (
	<span className="inline-flex items-center gap-1.5 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
		{isColorProp(property) && (
			<span
				className="inline-block size-3 shrink-0 rounded-sm border border-border"
				style={{ backgroundColor: value }}
			/>
		)}
		{value}
	</span>
);

/** Rows of `property: before → after` for one element's style changes.
 *  Shared by the widget review modal, dashboard, and client portal. */
export const StyleChangeRows = ({ changes }: { changes: StyleChange[] }) => (
	<div className="flex flex-col gap-1.5">
		{changes.map((change) => (
			<div
				key={change.property}
				className="flex flex-wrap items-center gap-2 text-sm"
			>
				<span className="font-mono text-muted-foreground text-xs">
					{change.property}:
				</span>
				<ValueChip property={change.property} value={change.before} />
				<span className="text-muted-foreground">→</span>
				<ValueChip property={change.property} value={change.after} />
			</div>
		))}
	</div>
);

/** Parse a StyleEdit.changes Json column into typed changes (defensive). */
export function parseStyleChanges(raw: unknown): StyleChange[] {
	if (!Array.isArray(raw)) return [];
	return raw.filter(
		(c): c is StyleChange =>
			typeof c === "object" &&
			c !== null &&
			typeof (c as StyleChange).property === "string" &&
			typeof (c as StyleChange).before === "string" &&
			typeof (c as StyleChange).after === "string",
	);
}

/** CSS snippet a developer can paste: `selector { prop: value; }`. */
export function styleEditToCss(selector: string, changes: StyleChange[]) {
	const body = changes.map((c) => `\t${c.property}: ${c.after};`).join("\n");
	return `${selector} {\n${body}\n}`;
}
