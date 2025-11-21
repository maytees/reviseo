"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function DeleteAccountDialog() {
	const [open, setOpen] = useState(false);
	const [confirmText, setConfirmText] = useState("");
	const [isPending, startTransition] = useTransition();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const handleDelete = () => {
		if (confirmText !== "DELETE") {
			toast.error('Please type "DELETE" to confirm');
			return;
		}

		startTransition(async () => {
			try {
				const res = await authClient.deleteUser();

				if (res.error) {
					toast.error(res.error.message);
					return;
				}

				if (res.data) {
					toast.success(
						"Verification email sent. Please check your inbox to confirm account deletion.",
					);
					setOpen(false);
					setConfirmText("");
				}
			} catch (error) {
				console.error("Error deleting account:", error);
				toast.error("Failed to initiate account deletion. Please try again.");
			}
		});
	};

	if (!isMounted) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive" size="sm">
					Delete Account
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle className="font-bold text-xl">Delete Account</DialogTitle>
				<DialogDescription>
					This action cannot be undone. This will permanently delete your
					account and remove all your data from our servers.
				</DialogDescription>

				<div className="my-4 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
					<p className="mb-2 font-medium text-destructive text-sm">
						⚠️ This will permanently delete:
					</p>
					<ul className="ml-4 space-y-1 text-muted-foreground text-sm">
						<li>• All your websites</li>
						<li>• All feedback submissions</li>
						<li>• Your profile and settings</li>
						<li>• All associated data</li>
					</ul>
				</div>

				<Field>
					<FieldLabel>
						Type <span className="font-bold font-mono">DELETE</span> to confirm
					</FieldLabel>
					<Input
						value={confirmText}
						onChange={(e) => setConfirmText(e.target.value)}
						placeholder="DELETE"
						autoComplete="off"
						disabled={isPending}
					/>
					{confirmText && confirmText !== "DELETE" && (
						<FieldError
							errors={[
								{
									message: 'Please type "DELETE" exactly as shown',
								},
							]}
						/>
					)}
				</Field>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" disabled={isPending}>
							Cancel
						</Button>
					</DialogClose>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={isPending || confirmText !== "DELETE"}
					>
						{isPending ? "Processing..." : "Delete My Account"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
