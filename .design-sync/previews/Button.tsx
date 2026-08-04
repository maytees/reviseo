import { Plus, Settings, Trash2 } from "lucide-react";
import { Button } from "web";

export const Variants = () => (
	<div className="flex flex-wrap items-center gap-3">
		<Button variant="primary">New website</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="outline">Outline</Button>
		<Button variant="dashed">Dashed</Button>
		<Button variant="ghost">Ghost</Button>
		<Button variant="mono">Mono</Button>
		<Button variant="destructive">Delete</Button>
	</div>
);

export const Sizes = () => (
	<div className="flex flex-wrap items-center gap-3">
		<Button variant="primary" size="lg">
			Large
		</Button>
		<Button variant="primary" size="md">
			Medium
		</Button>
		<Button variant="primary" size="sm">
			Small
		</Button>
		<Button variant="outline" size="icon" aria-label="Settings">
			<Settings />
		</Button>
	</div>
);

export const WithIcons = () => (
	<div className="flex flex-wrap items-center gap-3">
		<Button variant="primary">
			<Plus /> Add feedback
		</Button>
		<Button variant="destructive">
			<Trash2 /> Remove
		</Button>
		<Button variant="link">View submission</Button>
	</div>
);

export const Disabled = () => (
	<div className="flex flex-wrap items-center gap-3">
		<Button variant="primary" disabled>
			Sending invite…
		</Button>
		<Button variant="outline" disabled>
			Unavailable
		</Button>
	</div>
);
