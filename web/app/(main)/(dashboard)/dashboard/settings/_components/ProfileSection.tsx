"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { UserDataType } from "@/app/data/user/get-user-data";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import type { FileWithPreview } from "@/lib/hooks/useFileUpload";
import { tryCatch } from "@/lib/try-catch";
import { updateUserAvatar, updateUserProfile } from "../actions";
import AvatarUpload from "./AvatarUpload";

const profileSchema = z.object({
	name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileSectionProps {
	user: NonNullable<UserDataType>;
}

export default function ProfileSection({ user }: ProfileSectionProps) {
	const [isPending, startTransition] = useTransition();
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const nameId = useId();
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const form = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user.name,
		},
	});

	const onSubmit = (values: ProfileFormData) => {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				updateUserProfile(values.name),
			);

			if (error) {
				toast.error("An unexpected error occurred. Please try again.");
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				form.reset({ name: values.name });
				router.refresh();
			} else {
				toast.error(result.message);
			}
		});
	};

	const handleAvatarUpload = useCallback(
		async (file: FileWithPreview | null) => {
			if (!file || !(file.file instanceof File)) return;

			setIsUploadingAvatar(true);
			const uploadToast = toast.loading("Uploading avatar...");

			try {
				// Step 1: Get presigned URL from API
				const presignedResponse = await fetch("/api/s3/upload", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						fileName: file.file.name,
						contentType: file.file.type,
						size: file.file.size,
					}),
				});

				if (!presignedResponse.ok) {
					throw new Error("Failed to get upload URL");
				}

				const { preSignedUrl, publicUrl } = await presignedResponse.json();

				// Step 2: Upload file to S3 using presigned URL
				const uploadResponse = await fetch(preSignedUrl, {
					method: "PUT",
					body: file.file,
					headers: {
						"Content-Type": file.file.type,
					},
				});

				if (!uploadResponse.ok) {
					throw new Error("Failed to upload avatar");
				}

				// Step 3: Update profile — the server action also cleans up the
				// previous avatar object.
				const { data: result, error } = await tryCatch(
					updateUserAvatar(publicUrl),
				);

				if (error) {
					throw error;
				}

				if (result.status === "error") {
					throw new Error(result.message);
				}

				toast.success("Avatar updated successfully", { id: uploadToast });
				router.refresh();
			} catch (error) {
				console.error("Error uploading avatar:", error);
				toast.error(
					error instanceof Error
						? error.message
						: "Failed to upload avatar. Please try again.",
					{ id: uploadToast },
				);
			} finally {
				setIsUploadingAvatar(false);
			}
		},
		[router],
	);

	if (!isMounted) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile</CardTitle>
				<CardDescription>
					Update your personal information and profile settings.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FieldGroup className="flex flex-row gap-12">
						<div className="flex items-center gap-4">
							<AvatarUpload
								defaultAvatar={user.image || undefined}
								onFileChange={handleAvatarUpload}
								maxSize={2 * 1024 * 1024} // 2MB
								name={user.name}
							/>
						</div>
						<FieldGroup>
							<Controller
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={nameId}>Name</FieldLabel>
										<Input
											{...field}
											id={nameId}
											aria-invalid={fieldState.invalid}
											placeholder="Your name"
											autoComplete="name"
											disabled={isPending || isUploadingAvatar}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Field>
								<FieldLabel>Email</FieldLabel>
								<Input
									value={user.email}
									disabled
									readOnly
									className="cursor-not-allowed bg-muted"
								/>
								<p className="text-muted-foreground text-xs">
									Email cannot be changed.
								</p>
							</Field>
						</FieldGroup>
					</FieldGroup>

					<Button
						type="submit"
						disabled={isPending || !form.formState.isDirty || isUploadingAvatar}
						size="sm"
					>
						{isPending ? "Saving..." : "Save Changes"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
