import { Badge } from "web";

export const Variants = () => (
	<div className="flex flex-wrap items-center gap-2">
		<Badge variant="primary">Primary</Badge>
		<Badge variant="secondary">Secondary</Badge>
		<Badge variant="success">Resolved</Badge>
		<Badge variant="warning">Pending</Badge>
		<Badge variant="info">Text edit</Badge>
		<Badge variant="info2">Image edit</Badge>
		<Badge variant="destructive">Bug</Badge>
		<Badge variant="outline">Outline</Badge>
	</div>
);

export const LightAppearance = () => (
	<div className="flex flex-wrap items-center gap-2">
		<Badge variant="success" appearance="light">
			Approved
		</Badge>
		<Badge variant="warning" appearance="light">
			Awaiting approval
		</Badge>
		<Badge variant="destructive" appearance="light">
			Rejected
		</Badge>
	</div>
);

export const Sizes = () => (
	<div className="flex flex-wrap items-center gap-2">
		<Badge variant="primary" size="lg">
			Large
		</Badge>
		<Badge variant="primary" size="md">
			Medium
		</Badge>
		<Badge variant="primary" size="sm">
			Small
		</Badge>
		<Badge variant="primary" size="xs">
			XS
		</Badge>
	</div>
);
