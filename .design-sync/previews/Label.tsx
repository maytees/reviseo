import { Input, Label } from "web";

export const WithInput = () => (
	<div className="w-80 space-y-1.5">
		<Label htmlFor="site-name">Website name</Label>
		<Input id="site-name" placeholder="voltrush.com" />
	</div>
);

export const Required = () => (
	<div className="w-80 space-y-1.5">
		<Label htmlFor="feedback-title">
			Feedback title <span className="text-destructive">*</span>
		</Label>
		<Input id="feedback-title" placeholder="Short summary" />
	</div>
);
