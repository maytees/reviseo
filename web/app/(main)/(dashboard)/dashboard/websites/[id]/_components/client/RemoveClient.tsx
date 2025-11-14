"use client";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { CircleAlertIcon, MailX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { tryCatch } from "@/lib/try-catch";
import { removeClientFromSite } from "./actions";

const RemoveClientDialog = ({
	websiteId,
	clientId,
	open,
	onOpenChange,
}: {
	websiteId: string;
	clientId: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) => {
	const [isPending, startTransition] = useTransition();
	const [checked, setChecked] = useState<boolean>(true);
	const router = useRouter();

	const handleCheckboxChange = (checkedState: CheckedState) => {
		setChecked(checkedState === true);
	};

	function onSubmit() {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				removeClientFromSite(websiteId, clientId, checked),
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
			{!open && !onOpenChange && (
				<DialogTrigger asChild>
					<Button size={"sm"} variant={"destructive"}>
						<MailX />
						Remove Client
					</Button>
				</DialogTrigger>
			)}
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
							You are still able to invite the client afterwards, their feedback
							will still remain.{" "}
							{checked && (
								<strong>
									The client will recieve an email notice of their removal.{" "}
								</strong>
							)}
							Are you sure you want to delete?
						</DialogDescription>
					</DialogHeader>
				</div>

				<form className="flex flex-row items-center justify-between">
					<div className="flex items-center gap-3">
						<Checkbox
							defaultChecked
							checked={checked}
							onCheckedChange={handleCheckboxChange}
						/>
						<Label className="text-xs text-muted-foreground" htmlFor="terms">
							Send notification email
						</Label>
					</div>
					<div className="space-x-2">
						<DialogClose asChild>
							<Button disabled={isPending} type="button" variant="outline">
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="button"
							variant={"destructive"}
							onClick={onSubmit}
							disabled={isPending}
						>
							{isPending ? "Removing..." : "Remove"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default RemoveClientDialog;
