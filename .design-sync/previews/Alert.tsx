import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
import {
	Alert,
	AlertContent,
	AlertDescription,
	AlertIcon,
	AlertTitle,
} from "web";

export const Variants = () => (
	<div className="flex w-md flex-col gap-3">
		<Alert variant="success" appearance="light">
			<AlertIcon>
				<CheckCircle2 />
			</AlertIcon>
			<AlertContent>
				<AlertTitle>Widget verified</AlertTitle>
				<AlertDescription>
					Reviseo is installed correctly on voltrush.com.
				</AlertDescription>
			</AlertContent>
		</Alert>
		<Alert variant="warning" appearance="light">
			<AlertIcon>
				<TriangleAlert />
			</AlertIcon>
			<AlertContent>
				<AlertTitle>3 submissions awaiting approval</AlertTitle>
				<AlertDescription>
					Review your team&apos;s suggestions before they reach the developer.
				</AlertDescription>
			</AlertContent>
		</Alert>
		<Alert variant="info" appearance="light">
			<AlertIcon>
				<Info />
			</AlertIcon>
			<AlertContent>
				<AlertTitle>Tip</AlertTitle>
				<AlertDescription>
					Clients can suggest copy changes directly on the live page.
				</AlertDescription>
			</AlertContent>
		</Alert>
	</div>
);

export const Solid = () => (
	<div className="flex w-md flex-col gap-3">
		<Alert variant="destructive">
			<AlertIcon>
				<TriangleAlert />
			</AlertIcon>
			<AlertContent>
				<AlertTitle>Widget script not found</AlertTitle>
				<AlertDescription>
					We couldn&apos;t verify the install on staging.voltrush.com.
				</AlertDescription>
			</AlertContent>
		</Alert>
	</div>
);
