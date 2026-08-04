import { CheckCircle2, Copy, Trash2 } from "lucide-react";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "web";

export const RowActions = () => (
	<div className="flex min-h-72 justify-center pt-2">
		<DropdownMenu open>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					Actions
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-56">
				<DropdownMenuLabel>Feedback #128</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<CheckCircle2 /> Mark in progress
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Copy /> Copy page link
					<DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					<Trash2 /> Delete submission
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
);
