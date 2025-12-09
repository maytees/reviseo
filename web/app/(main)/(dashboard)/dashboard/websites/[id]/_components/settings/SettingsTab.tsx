"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, Copy, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateWebsiteOnboarding } from "@/app/(main)/(landing)/(onboarding)/onboarding/_components/actions";
import type { WebsiteDataTypeNonNullable } from "@/app/data/website/get-website-by-id-and-dev-id";
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
import { Separator } from "@/components/ui/separator";
import { tryCatch } from "@/lib/try-catch";
import { type WebsiteFormData, websiteSchema } from "@/lib/validations";
import DeleteWebsiteDialog from "../../../_components/DeleteWebsiteDialog";

const SettingsTab = ({ website }: { website: WebsiteDataTypeNonNullable }) => {
	const [isPending, startTransition] = useTransition();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const router = useRouter();

	const titleId = useId();
	const urlId = useId();
	const projectIdId = useId();

	const form = useForm<WebsiteFormData>({
		resolver: zodResolver(websiteSchema),
		defaultValues: {
			websiteName: website.name,
			websiteUrl: website.url,
		},
	});

	function onSubmit(values: WebsiteFormData) {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				updateWebsiteOnboarding({
					websiteId: website.id,
					websiteName: values.websiteName,
					websiteUrl: values.websiteUrl,
				}),
			);

			if (error) {
				toast.error("An unexpected error occurred. Please try again.");
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				router.refresh();
				form.reset(values);
			} else if (result.status === "error") {
				toast.error(result.message);
			}
		});
	}

	const copyProjectId = () => {
		navigator.clipboard.writeText(website.projectId);
		toast.success("Project ID copied to clipboard");
	};

	const handleArchive = () => {
		toast.info("Archive functionality coming soon");
	};

	return (
		<div className="h-full w-full space-y-6">
			{/* Website Details Card */}
			<Card>
				<CardHeader>
					<CardTitle>Website Details</CardTitle>
					<CardDescription>
						Update your website name and URL to keep your project information
						current.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FieldGroup>
							<Controller
								name="websiteName"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={titleId}>Website Name</FieldLabel>
										<Input
											{...field}
											id={titleId}
											aria-invalid={fieldState.invalid}
											placeholder="Client's Beautiful Website"
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="websiteUrl"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={urlId}>Website URL</FieldLabel>
										<Input
											{...field}
											id={urlId}
											aria-invalid={fieldState.invalid}
											placeholder="https://yourwebsite.com"
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>

						<div className="flex justify-end">
							<Button
								type="submit"
								disabled={isPending || !form.formState.isDirty}
							>
								{isPending ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* Project ID Card */}
			<Card>
				<CardHeader>
					<CardTitle>Project ID</CardTitle>
					<CardDescription>
						Your unique project identifier used for widget integration.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-2">
						<Input
							id={projectIdId}
							value={website.projectId}
							readOnly
							className="font-mono text-sm"
						/>
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={copyProjectId}
							title="Copy Project ID"
						>
							<Copy className="size-4" />
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Danger Zone Card */}
			<Card className="border-destructive/50">
				<CardHeader>
					<CardTitle className="text-destructive">Danger Zone</CardTitle>
					<CardDescription>
						Irreversible actions that will affect your website and data.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Archive Section */}
					<div className="flex items-center justify-between rounded-lg border border-border p-4">
						<div className="flex-1">
							<h4 className="font-semibold">Archive Website</h4>
							<p className="text-muted-foreground text-sm">
								Hide this website from your dashboard. You can restore it later.
								Clients will not be able to submit new feedback.
							</p>
						</div>
						<Button
							type="button"
							variant="outline"
							onClick={handleArchive}
							className="ml-4 shrink-0"
							disabled
						>
							<Archive className="mr-2 size-4" />
							Archive
						</Button>
					</div>

					<Separator />

					{/* Delete Section */}
					<div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
						<div className="flex-1">
							<h4 className="font-semibold text-destructive">Delete Website</h4>
							<p className="text-muted-foreground text-sm">
								Permanently delete this website and all associated feedback.
								This action cannot be undone.
							</p>
						</div>
						<Button
							type="button"
							variant="destructive"
							onClick={() => setDeleteDialogOpen(true)}
							className="ml-4 shrink-0"
						>
							<Trash2 className="mr-2 size-4" />
							Delete
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Delete Dialog */}
			<DeleteWebsiteDialog
				websiteName={website.name}
				websiteId={website.id}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			/>
		</div>
	);
};

export default SettingsTab;
