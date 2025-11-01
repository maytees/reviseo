"use client";

import { CircleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tryCatch } from "@/lib/try-catch";
import { deleteWebsite } from "../actions";

export default function DeleteWebsiteDialog({
	websiteName,
	websiteId,
	open,
	onOpenChange,
}: {
	websiteName: string;
	websiteId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const id = useId();
	const [inputValue, setInputValue] = useState("");
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	function onSubmit() {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(deleteWebsite(websiteId));

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
							Final confirmation
						</DialogTitle>
						<DialogDescription className="sm:text-center">
							This action cannot be undone. Your clients will not be able to
							submit feedback anymore, consider archiving instead. To confirm,
							please enter the website name{" "}
							<span className="text-foreground">{websiteName}</span>.
						</DialogDescription>
					</DialogHeader>
				</div>

				<form className="space-y-5">
					<div className="*:not-first:mt-2">
						<Label htmlFor={id}>Website name</Label>
						<Input
							id={id}
							type="text"
							placeholder={`Type ${websiteName} to confirm`}
							disabled={isPending}
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
						/>
					</div>
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
							disabled={inputValue !== websiteName || isPending}
						>
							Delete
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
