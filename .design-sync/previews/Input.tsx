import { Input } from "web";

export const Sizes = () => (
	<div className="flex w-80 flex-col gap-3">
		<Input variant="lg" placeholder="Large — website name" />
		<Input variant="md" placeholder="Medium — website name" />
		<Input variant="sm" placeholder="Small — website name" />
	</div>
);

export const States = () => (
	<div className="flex w-80 flex-col gap-3">
		<Input defaultValue="voltrush.com" />
		<Input placeholder="Disabled" disabled />
		<Input defaultValue="not-a-url" aria-invalid />
	</div>
);
