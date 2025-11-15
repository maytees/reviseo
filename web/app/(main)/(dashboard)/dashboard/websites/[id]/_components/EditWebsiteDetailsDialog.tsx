"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	type ReactNode,
	useEffect,
	useId,
	useState,
	useTransition,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateWebsiteOnboarding } from "@/app/(main)/(onboarding)/onboarding/_components/actions";
import type { WebsiteDataTypeNonNullable } from "@/app/data/website/get-website-by-id-and-dev-id";
import { Button } from "@/components/ui/button";
import DialogContent, {
	Dialog,
	DialogClose,
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
import { tryCatch } from "@/lib/try-catch";
import { type WebsiteFormData, websiteSchema } from "@/lib/validations";

const EditWebsiteDetailsDialog = ({
	website,
	children,
}: {
	website: WebsiteDataTypeNonNullable;
	children?: ReactNode;
}) => {
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const formId = useId();
	const titleId = useId();
	const urlId = useId();

	const form = useForm<WebsiteFormData>({
		resolver: zodResolver(websiteSchema),
		defaultValues: {
			websiteName: website.name,
			websiteUrl: website.url,
		},
	});

	function onSubmit(values: WebsiteFormData) {
		startTransition(async () => {
			// TODO: rename all those stupid actions from onboarding
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
				setOpen(false);
				form.reset();
			} else if (result.status === "error") {
				toast.error(result.message);
			}
		});
	}

	if (!isMounted) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
				<DialogTrigger asChild>
					{children ? (
						children
					) : (
						<Button variant={"ghost"} mode={"icon"} size={"sm"} className="">
							<Edit2 className="size-3" />
						</Button>
					)}
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit</DialogTitle>
						<DialogDescription>
							Make quick updates to keep your site info up to date.
						</DialogDescription>
					</DialogHeader>

					<FieldGroup className="mt-5">
						<Controller
							name="websiteName"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={titleId}>Website Title</FieldLabel>
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
									<FieldLabel htmlFor={urlId}>Website Url</FieldLabel>
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
					<DialogFooter>
						<DialogClose asChild>
							<Button variant={"outline"}>Close</Button>
						</DialogClose>
						<Button form={formId} disabled={isPending} type="submit">
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
};

export default EditWebsiteDetailsDialog;
