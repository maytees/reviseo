import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "web";

export const Basic = () => (
	<div className="flex min-h-32 justify-center pt-16">
		<Tooltip defaultOpen>
			<TooltipTrigger asChild>
				<Button variant="outline" size="sm">
					Trusted member
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				Submissions from trusted members skip lead approval.
			</TooltipContent>
		</Tooltip>
	</div>
);
