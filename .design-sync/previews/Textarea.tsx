import { Textarea } from "web";

export const Basic = () => (
	<div className="w-96">
		<Textarea
			placeholder="Describe the issue — what did you expect to happen?"
			rows={4}
		/>
	</div>
);

export const WithValue = () => (
	<div className="w-96">
		<Textarea
			defaultValue="The hero heading overlaps the nav on tablet widths. Could we tighten the line height?"
			rows={4}
		/>
	</div>
);

export const Disabled = () => (
	<div className="w-96">
		<Textarea placeholder="Read-only submission" disabled rows={3} />
	</div>
);
