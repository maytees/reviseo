import { Label, Switch } from "web";

export const Sizes = () => (
	<div className="flex items-center gap-4">
		<Switch size="sm" defaultChecked />
		<Switch size="md" defaultChecked />
		<Switch size="lg" defaultChecked />
	</div>
);

export const States = () => (
	<div className="flex flex-col gap-3">
		<div className="flex items-center gap-2">
			<Switch id="sw-notify" defaultChecked />
			<Label htmlFor="sw-notify">Email notifications</Label>
		</div>
		<div className="flex items-center gap-2">
			<Switch id="sw-weekly" />
			<Label htmlFor="sw-weekly">Weekly digest</Label>
		</div>
		<div className="flex items-center gap-2">
			<Switch id="sw-locked" disabled />
			<Label htmlFor="sw-locked" className="opacity-60">
				Locked by plan
			</Label>
		</div>
	</div>
);
