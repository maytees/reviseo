import { Checkbox, Label } from "web";

export const States = () => (
	<div className="flex flex-col gap-3">
		<div className="flex items-center gap-2">
			<Checkbox id="cb-text" defaultChecked />
			<Label htmlFor="cb-text">Text edits</Label>
		</div>
		<div className="flex items-center gap-2">
			<Checkbox id="cb-style" />
			<Label htmlFor="cb-style">Style edits</Label>
		</div>
		<div className="flex items-center gap-2">
			<Checkbox id="cb-image" disabled />
			<Label htmlFor="cb-image" className="opacity-60">
				Image replacement (disabled)
			</Label>
		</div>
	</div>
);
