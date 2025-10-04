import { Bug } from "lucide-react";
import { Button } from "./components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "./components/ui/dialog";

function FeedbackWidget() {
	return (
		<Dialog>
			<DialogTrigger className="absolute bottom-4 right-4" asChild>
				<Button mode={"icon"} className="fixed rounded-full p-6" variant={"mono"}>
					<Bug className="size-5" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Dialog</DialogTitle>
				test
			</DialogContent>
		</Dialog>
	);
}

export default FeedbackWidget;
