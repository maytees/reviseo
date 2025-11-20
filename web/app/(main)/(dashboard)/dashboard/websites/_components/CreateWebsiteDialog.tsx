"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useId, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createWebsiteOnboarding } from "@/app/(main)/(onboarding)/onboarding/_components/actions";
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
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useConfetti } from "@/lib/hooks/use-confetti";
import { tryCatch } from "@/lib/try-catch";
import { cn } from "@/lib/utils";
import { type WebsiteFormData, websiteSchema } from "@/lib/validations";

const CreateWebsiteDialog = ({ className }: React.ComponentProps<"button">) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);

	const formId = useId();
	const titleId = useId();
	const urlId = useId();

	const { triggerConfetti } = useConfetti();

	const form = useForm<WebsiteFormData>({
		resolver: zodResolver(websiteSchema),
		defaultValues: {
			websiteName: "",
			websiteUrl: "",
		},
	});

	function onSubmit(values: WebsiteFormData) {
		startTransition(async () => {
			// TODO: rename all those stupid actions from onboarding
			const { data: result, error } = await tryCatch(
				createWebsiteOnboarding(values),
			);

			if (error) {
				toast.error("An unexpected error occurred. Please try again.");
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				triggerConfetti();
				form.reset();
				router.push(`/dashboard/websites/${result.data.websiteId}?tab=widget`);
			} else if (result.status === "error") {
				toast.error(result.message);
			}
		});
	}

	useEffect(() => {
		if (!isMounted) {
			setIsMounted(true);
		}
	}, [isMounted]);

	if (!isMounted) {
		return null;
	}

	return (
		<Dialog>
			<form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
				<DialogTrigger asChild>
					<Button className={cn(className)} size={"sm"}>
						<PlusCircle /> Add Website
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogTitle className="text-xl font-bold">Add Website</DialogTitle>
					<DialogDescription>
						Enter information about your client's website.
					</DialogDescription>
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
							<Button variant={"outline"} size={"lg"}>
								Cancel
							</Button>
						</DialogClose>
						<Button
							form={formId}
							disabled={isPending}
							type="submit"
							size={"lg"}
						>
							<Plus />
							Add Website
						</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
};

export default CreateWebsiteDialog;
