import { Separator } from "web";

export const Horizontal = () => (
	<div className="w-80">
		<p className="text-sm">Widget install</p>
		<Separator className="my-3" />
		<p className="text-muted-foreground text-sm">
			Paste the snippet before the closing body tag.
		</p>
	</div>
);

export const Vertical = () => (
	<div className="flex h-6 items-center gap-3 text-sm">
		<span>Dashboard</span>
		<Separator orientation="vertical" />
		<span>Feedback</span>
		<Separator orientation="vertical" />
		<span>Team</span>
	</div>
);
