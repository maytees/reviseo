import {
	Button,
	Input,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "web";

export const WidgetSettings = () => (
	<div className="flex min-h-64 justify-center pt-2">
		<Popover open>
			<PopoverTrigger asChild>
				<Button variant="outline">Widget settings</Button>
			</PopoverTrigger>
			<PopoverContent className="w-72 space-y-3">
				<div className="space-y-1">
					<h4 className="font-medium text-sm">Trigger position</h4>
					<p className="text-muted-foreground text-xs">
						Where the feedback button appears on the page.
					</p>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="pos">Position</Label>
					<Input id="pos" defaultValue="bottom-right" />
				</div>
			</PopoverContent>
		</Popover>
	</div>
);
