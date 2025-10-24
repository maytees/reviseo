"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowLeftIcon,
	BugIcon,
	ChevronRightIcon,
	CircleAlertIcon,
	CircleIcon,
	SparklesIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { type FeedbackFormData, feedbackFormSchema } from "@/lib/validations";
import ExCanvas from "../_components/ExCanvas";

const PRIORITY_CONFIG = {
	low: { label: "Low", icon: CircleIcon, color: "text-green-600" },
	medium: { label: "Medium", icon: CircleIcon, color: "text-yellow-600" },
	high: { label: "High", icon: CircleAlertIcon, color: "text-red-600" },
} as const;

const TYPE_CONFIG = {
	bug: { label: "Bug", icon: BugIcon, color: "text-red-600" },
	improvement: {
		label: "Improvement",
		icon: SparklesIcon,
		color: "text-blue-600",
	},
} as const;

const ReviseoModal = () => {
	const [open, setOpen] = useState(true);
	const [step, setStep] = useState<"canvas" | "form">("canvas");
	const formId = useId();
	const titleId = useId();
	const descriptionId = useId();
	const priorityId = useId();
	const typeId = useId();

	useEffect(() => {
		if (!open) {
			window.parent.postMessage({ type: "CLOSE_FORM" }, "*");
		}
	}, [open]);

	const form = useForm<FeedbackFormData>({
		resolver: zodResolver(feedbackFormSchema),
		defaultValues: {
			title: "",
			description: "",
			priority: undefined,
			type: undefined,
		},
	});

	const titleValue = useWatch({ control: form.control, name: "title" });
	const descriptionValue = useWatch({
		control: form.control,
		name: "description",
	});

	function onSubmit(data: FeedbackFormData) {
		window.parent.postMessage({ type: "CLOSE_FORM" }, "*");

		console.log(data);
	}

	return (
		<Dialog open={true} onOpenChange={setOpen}>
			<DialogContent
				className="overflow-y-scroll bg-card"
				variant={"fullscreen"}
			>
				<DialogTitle>Submit Feedback</DialogTitle>
				<DialogDescription>
					{step === "canvas"
						? "Draw on the screenshot in the canvas below to show the developer(s) what you'd like changed."
						: "Provide details about your feedback to help the developer(s) understand your request."}
				</DialogDescription>

				{/* Mobile Stepper - Only visible on small screens */}
				<div className="flex items-center gap-2 mt-3 md:hidden">
					<div
						className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step === "canvas" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
					>
						1
					</div>
					<ChevronRightIcon className="size-4 text-muted-foreground" />
					<div
						className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step === "form" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
					>
						2
					</div>
					<span className="ml-2 text-sm font-medium">
						{step === "canvas" ? "Annotate" : "Details"}
					</span>
				</div>

				<div className="flex flex-col h-full gap-3 mt-3">
					{/* Desktop Layout - Side by side */}
					<div className="flex-row flex-1 hidden min-h-0 gap-3 md:flex">
						<div className="w-full h-full border border-border rounded-2xl">
							<ExCanvas pending={false} />
						</div>
						<Card className="flex flex-col max-w-xs min-w-sm">
							<CardContent className="flex flex-col flex-1 min-h-0">
								<form
									className="flex flex-col h-full max-w-sm"
									onSubmit={form.handleSubmit(onSubmit)}
									id={formId}
								>
									<FieldGroup className="flex flex-col flex-1 min-h-0 gap-4">
										<Controller
											name="title"
											control={form.control}
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<div className="flex items-center justify-between">
														<FieldLabel htmlFor={titleId}>Title</FieldLabel>
														<span className="text-xs text-muted-foreground">
															{titleValue?.length || 0}/800
														</span>
													</div>
													<Input
														{...field}
														id={titleId}
														aria-invalid={fieldState.invalid}
														placeholder="e.g., Make the header bigger"
														autoComplete="off"
													/>
													{fieldState.invalid && (
														<FieldError errors={[fieldState.error]} />
													)}
												</Field>
											)}
										/>
										<Controller
											name="description"
											control={form.control}
											render={({ field, fieldState }) => (
												<Field
													className="flex flex-col flex-1 min-h-0"
													data-invalid={fieldState.invalid}
												>
													<div className="flex items-center justify-between">
														<FieldLabel htmlFor={descriptionId}>
															Details (optional)
														</FieldLabel>
														<span className="text-xs text-muted-foreground">
															{descriptionValue?.length || 0}/6000
														</span>
													</div>
													<Textarea
														{...field}
														id={descriptionId}
														aria-invalid={fieldState.invalid}
														placeholder="Add any extra context or notes..."
														autoComplete="off"
														className="flex-1 resize-none"
													/>
													{<FieldError errors={[fieldState.error]} />}
												</Field>
											)}
										/>
										<div className="grid grid-cols-2 gap-3">
											<Controller
												name="priority"
												control={form.control}
												render={({ field, fieldState }) => (
													<Field data-invalid={fieldState.invalid}>
														<FieldLabel htmlFor={priorityId}>
															Priority
														</FieldLabel>
														<Select
															value={field.value}
															onValueChange={field.onChange}
														>
															<SelectTrigger
																id={priorityId}
																aria-invalid={fieldState.invalid}
																className="w-full"
															>
																<SelectValue placeholder="Select priority" />
															</SelectTrigger>
															<SelectContent>
																{Object.entries(PRIORITY_CONFIG).map(
																	([key, config]) => {
																		const Icon = config.icon;
																		return (
																			<SelectItem key={key} value={key}>
																				<div className="flex items-center gap-2">
																					<Icon
																						className={`size-4 ${config.color}`}
																					/>
																					<span>{config.label}</span>
																				</div>
																			</SelectItem>
																		);
																	},
																)}
															</SelectContent>
														</Select>
														{fieldState.invalid && (
															<FieldError errors={[fieldState.error]} />
														)}
													</Field>
												)}
											/>
											<Controller
												name="type"
												control={form.control}
												render={({ field, fieldState }) => (
													<Field data-invalid={fieldState.invalid}>
														<FieldLabel htmlFor={typeId}>Type</FieldLabel>
														<Select
															value={field.value}
															onValueChange={field.onChange}
														>
															<SelectTrigger
																id={typeId}
																aria-invalid={fieldState.invalid}
																className="w-full"
															>
																<SelectValue placeholder="Select type" />
															</SelectTrigger>
															<SelectContent>
																{Object.entries(TYPE_CONFIG).map(
																	([key, config]) => {
																		const Icon = config.icon;
																		return (
																			<SelectItem key={key} value={key}>
																				<div className="flex items-center gap-2">
																					<Icon
																						className={`size-4 ${config.color}`}
																					/>
																					<span>{config.label}</span>
																				</div>
																			</SelectItem>
																		);
																	},
																)}
															</SelectContent>
														</Select>
														{fieldState.invalid && (
															<FieldError errors={[fieldState.error]} />
														)}
													</Field>
												)}
											/>
										</div>
									</FieldGroup>
									<div className="flex flex-col gap-2 mt-4">
										<DialogClose asChild>
											<Button
												type="button"
												variant="outline"
												onClick={() => setOpen(false)}
											>
												Close
											</Button>
										</DialogClose>
										<Button type="submit" form={formId}>
											Submit feedback
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					</div>

					{/* Mobile Layout - Stepper */}
					<div className="flex flex-col flex-1 min-h-0 gap-3 md:hidden">
						{step === "canvas" && (
							<>
								<div className="flex-1 min-h-0 border border-border rounded-2xl">
									<ExCanvas pending={false} />
								</div>
								<Button
									onClick={() => setStep("form")}
									className="w-full"
									size="lg"
								>
									Continue to Details
									<ChevronRightIcon className="ml-2 size-4" />
								</Button>
							</>
						)}

						{step === "form" && (
							<Card className="flex flex-col flex-1 min-h-0 overflow-y-scroll">
								<CardContent className="flex flex-col flex-1 w-full min-h-0 overflow-y-scroll">
									<form
										className="flex flex-col w-full h-full overflow-y-scroll"
										onSubmit={form.handleSubmit(onSubmit)}
										id={formId}
									>
										<FieldGroup className="flex flex-col flex-1 min-h-0 gap-4">
											<Controller
												name="title"
												control={form.control}
												render={({ field, fieldState }) => (
													<Field data-invalid={fieldState.invalid}>
														<div className="flex items-center justify-between">
															<FieldLabel htmlFor={titleId}>Title</FieldLabel>
															<span className="text-xs text-muted-foreground">
																{titleValue?.length || 0}/800
															</span>
														</div>
														<Input
															{...field}
															id={titleId}
															aria-invalid={fieldState.invalid}
															placeholder="e.g., Make the header bigger"
															autoComplete="off"
														/>
														{fieldState.invalid && (
															<FieldError errors={[fieldState.error]} />
														)}
													</Field>
												)}
											/>
											<Controller
												name="description"
												control={form.control}
												render={({ field, fieldState }) => (
													<Field
														className="flex flex-col flex-1 min-h-0"
														data-invalid={fieldState.invalid}
													>
														<div className="flex items-center justify-between">
															<FieldLabel htmlFor={descriptionId}>
																Details (optional)
															</FieldLabel>
															<span className="text-xs text-muted-foreground">
																{descriptionValue?.length || 0}/6000
															</span>
														</div>
														<Textarea
															{...field}
															id={descriptionId}
															aria-invalid={fieldState.invalid}
															placeholder="Add any extra context or notes..."
															autoComplete="off"
															className="flex-1 resize-none"
														/>
														{<FieldError errors={[fieldState.error]} />}
													</Field>
												)}
											/>
											<div className="grid grid-cols-1 gap-3 mt-auto">
												<Controller
													name="priority"
													control={form.control}
													render={({ field, fieldState }) => (
														<Field data-invalid={fieldState.invalid}>
															<FieldLabel
																className="max-w-fit"
																htmlFor={priorityId}
															>
																Priority
															</FieldLabel>
															<Select
																value={field.value}
																onValueChange={field.onChange}
															>
																<SelectTrigger
																	id={priorityId}
																	aria-invalid={fieldState.invalid}
																	className="w-full"
																>
																	<SelectValue placeholder="Select priority" />
																</SelectTrigger>
																<SelectContent>
																	{Object.entries(PRIORITY_CONFIG).map(
																		([key, config]) => {
																			const Icon = config.icon;
																			return (
																				<SelectItem key={key} value={key}>
																					<div className="flex items-center gap-2">
																						<Icon
																							className={`size-4 ${config.color}`}
																						/>
																						<span>{config.label}</span>
																					</div>
																				</SelectItem>
																			);
																		},
																	)}
																</SelectContent>
															</Select>
															{fieldState.invalid && (
																<FieldError errors={[fieldState.error]} />
															)}
														</Field>
													)}
												/>
												<Controller
													name="type"
													control={form.control}
													render={({ field, fieldState }) => (
														<Field data-invalid={fieldState.invalid}>
															<FieldLabel
																className="max-w-fit"
																htmlFor={typeId}
															>
																Type
															</FieldLabel>
															<Select
																value={field.value}
																onValueChange={field.onChange}
															>
																<SelectTrigger
																	id={typeId}
																	aria-invalid={fieldState.invalid}
																	className="w-full"
																>
																	<SelectValue placeholder="Select type" />
																</SelectTrigger>
																<SelectContent>
																	{Object.entries(TYPE_CONFIG).map(
																		([key, config]) => {
																			const Icon = config.icon;
																			return (
																				<SelectItem key={key} value={key}>
																					<div className="flex items-center gap-2">
																						<Icon
																							className={`size-4 ${config.color}`}
																						/>
																						<span>{config.label}</span>
																					</div>
																				</SelectItem>
																			);
																		},
																	)}
																</SelectContent>
															</Select>
															{fieldState.invalid && (
																<FieldError errors={[fieldState.error]} />
															)}
														</Field>
													)}
												/>
											</div>
										</FieldGroup>
										<div className="flex flex-col gap-2 mt-4">
											<Button
												type="button"
												variant="outline"
												onClick={() => setStep("canvas")}
											>
												<ArrowLeftIcon className="mr-2 size-4" />
												Back to Canvas
											</Button>
											<DialogClose asChild>
												<Button
													type="button"
													variant="outline"
													onClick={() => setOpen(false)}
												>
													Close
												</Button>
											</DialogClose>
											<Button type="submit" form={formId}>
												Submit feedback
											</Button>
										</div>
									</form>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
				<DialogFooter className="items-end pt-2.5 sm:justify-start">
					<div className="flex items-center gap-1.5">
						<Image src="/logo.svg" alt="Reviseo Logo" width={16} height={16} />
						<span className="text-xs text-muted-foreground">
							Powered by{" "}
							<Link
								href="https://reviseo.app"
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium text-foreground hover:underline"
							>
								Reviseo
							</Link>
						</span>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ReviseoModal;
