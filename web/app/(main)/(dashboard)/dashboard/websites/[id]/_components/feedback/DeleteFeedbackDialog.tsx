"use client";

import { CircleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { tryCatch } from "@/lib/try-catch";
import { deleteFeedback } from "./actions";

export default function DeleteFeedbackDialog({
	feedbackId,
	open,
	onOpenChange,
}: {
	feedbackId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	function onSubmit() {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				deleteFeedback(feedbackId),
			);

			if (error) {
				toast.error("An unexpected error occurred. Please try again.");
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				router.refresh();
			} else if (result.status === "error") {
				toast.error(result.message);
			}
		});
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<div className="flex flex-col items-center gap-2">
					<div
						className="flex items-center justify-center border rounded-full border-destructive/80 size-9 shrink-0"
						aria-hidden="true"
					>
						<CircleAlertIcon
							className="opacity-80 text-destructive"
							size={16}
						/>
					</div>
					<DialogHeader>
						<DialogTitle className="text-2xl sm:text-center">
							{/* TODO: Change title based on feedback status, e.g warn user if its not set to Resolved */}
							Final confirmation
						</DialogTitle>
						<DialogDescription className="sm:text-center">
							This action cannot be undone. Consider archiving instead to view
							this feedback later on. Are you sure you want to delete?
						</DialogDescription>
					</DialogHeader>
				</div>

				<form className="space-y-5">
					<DialogFooter>
						<DialogClose asChild>
							<Button
								disabled={isPending}
								type="button"
								variant="outline"
								className="flex-1"
							>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="button"
							className="flex-1"
							variant={"destructive"}
							onClick={onSubmit}
						>
							Delete
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
