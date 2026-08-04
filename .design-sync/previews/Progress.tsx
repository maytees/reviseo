import { Progress } from "web";

export const Values = () => (
	<div className="flex w-80 flex-col gap-4">
		<div className="space-y-1.5">
			<div className="flex justify-between text-muted-foreground text-xs">
				<span>Feedback resolved</span>
				<span>65%</span>
			</div>
			<Progress value={65} />
		</div>
		<div className="space-y-1.5">
			<div className="flex justify-between text-muted-foreground text-xs">
				<span>Onboarding</span>
				<span>30%</span>
			</div>
			<Progress value={30} />
		</div>
		<div className="space-y-1.5">
			<div className="flex justify-between text-muted-foreground text-xs">
				<span>Storage used</span>
				<span>90%</span>
			</div>
			<Progress value={90} />
		</div>
	</div>
);
