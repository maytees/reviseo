"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, User, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";

const inviteMemberSchema = z.object({
	email: z.email("Please enter a valid email address"),
	role: z.enum(["admin", "member"]),
});

type InviteMemberForm = z.infer<typeof inviteMemberSchema>;

export default function InviteMemberDialog() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const emailId = useId();
	const roleId = useId();

	const form = useForm<InviteMemberForm>({
		resolver: zodResolver(inviteMemberSchema),
		defaultValues: { email: "", role: "member" },
	});

	const onSubmit = (data: InviteMemberForm) => {
		startTransition(async () => {
			const { error } = await authClient.organization.inviteMember({
				email: data.email,
				role: data.role,
			});

			if (error) {
				toast.error(error.message ?? "Failed to send invitation");
				return;
			}

			toast.success(`Invitation sent to ${data.email}`);
			form.reset();
			setOpen(false);
			router.refresh();
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<UserRoundPlus />
					Invite Teammate
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Invite a teammate</DialogTitle>
					<DialogDescription>
						They'll get an email invitation to join your workspace with access
						to all its websites and feedback.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup className="gap-4">
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={emailId}>Email</FieldLabel>
									<Input
										{...field}
										id={emailId}
										type="email"
										placeholder="teammate@agency.com"
										disabled={isPending}
										aria-invalid={fieldState.invalid}
										autoComplete="off"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="role"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={roleId}>Role</FieldLabel>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={isPending}
									>
										<SelectTrigger id={roleId} className="w-full">
											<SelectValue placeholder="Select role" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="member">
												<div className="flex items-center gap-2">
													<User className="size-4" />
													<div className="flex flex-col text-left">
														<span>Member</span>
													</div>
												</div>
											</SelectItem>
											<SelectItem value="admin">
												<div className="flex items-center gap-2">
													<Shield className="size-4" />
													<div className="flex flex-col text-left">
														<span>Admin</span>
													</div>
												</div>
											</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-muted-foreground text-xs">
										Admins can invite teammates, manage clients, and delete
										websites. Members can manage feedback.
									</p>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
					<DialogFooter className="mt-6">
						<Button
							type="button"
							variant="outline"
							disabled={isPending}
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Sending…" : "Send Invitation"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
