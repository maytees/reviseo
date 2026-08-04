import { Label, RadioGroup, RadioGroupItem } from "web";

export const Priority = () => (
	<RadioGroup defaultValue="low" className="flex flex-col gap-2.5">
		<div className="flex items-center gap-2">
			<RadioGroupItem value="low" id="prio-low" />
			<Label htmlFor="prio-low">Low priority</Label>
		</div>
		<div className="flex items-center gap-2">
			<RadioGroupItem value="medium" id="prio-med" />
			<Label htmlFor="prio-med">Medium priority</Label>
		</div>
		<div className="flex items-center gap-2">
			<RadioGroupItem value="high" id="prio-high" />
			<Label htmlFor="prio-high">High priority</Label>
		</div>
	</RadioGroup>
);
