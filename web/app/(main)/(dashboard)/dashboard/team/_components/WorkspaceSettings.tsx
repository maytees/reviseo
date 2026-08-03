"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import { authClient } from "@/lib/auth-client";

const workspaceSchema = z.object({
	name: z
		.string()
		.min(1, "Workspace name is required")
		.max(60, "Workspace name must be under 60 characters"),
});

type WorkspaceForm = z.infer<typeof workspaceSchema>;

export default function WorkspaceSettings({
	organization,
	currentRole,
}: {
	organization: { id: string; name: string };
	currentRole: string;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const nameId = useId();

	const canRename = currentRole === "owner" || currentRole === "admin";

	const form = useForm<WorkspaceForm>({
		resolver: zodResolver(workspaceSchema),
		defaultValues: { name: organization.name },
	});

	const onSubmit = (data: WorkspaceForm) => {
		startTransition(async () => {
			const { error } = await authClient.organization.update({
				organizationId: organization.id,
				data: { name: data.name },
			});

			if (error) {
				toast.error(error.message ?? "Failed to rename workspace");
				return;
			}

			toast.success("Workspace renamed");
			form.reset({ name: data.name });
			router.refresh();
		});
	};

	if (!canRename) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Workspace</CardTitle>
				<CardDescription>
					Rename your agency workspace — this is what teammates and invitations
					show.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex max-w-md items-end gap-3"
				>
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field className="flex-1" data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={nameId}>Workspace name</FieldLabel>
								<Input
									{...field}
									id={nameId}
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
					<Button type="submit" disabled={isPending || !form.formState.isDirty}>
						{isPending ? "Saving…" : "Save"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
