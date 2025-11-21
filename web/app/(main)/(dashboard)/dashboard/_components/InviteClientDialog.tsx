"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GlobeIcon, Info, Mail, UserPlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useId, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { inviteClient } from "@/app/(main)/(onboarding)/onboarding/_components/actions";
import type { UserDataType } from "@/app/data/user/get-user-data";
import type { WebsiteDataTypeNonNullable } from "@/app/data/website/get-website-by-id-and-dev-id";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { tryCatch } from "@/lib/try-catch";
import { cn } from "@/lib/utils";
import { type ClientFormData, clientSchema } from "@/lib/validations";

const InviteClientDialog = ({
	userData,
	children,
	asChild = true,
	website,
	refresh,
}: {
	userData: UserDataType;
	children?: React.ReactNode;
	asChild?: boolean;
	website?: WebsiteDataTypeNonNullable;
	refresh?: boolean;
}) => {
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState(1);
	const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>("");
	const [isMounted, setIsMounted] = useState(false);
	const [isPending, startTransition] = useTransition();

	const router = useRouter();

	const clientNameId = useId();
	const clientEmailId = useId();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm<ClientFormData>({
		resolver: zodResolver(clientSchema),
		mode: "onChange",
	});

	const totalSteps = 2;

	// Get the selected website details
	const selectedWebsite = userData?.developerWebsites.find(
		(w) => w.id === selectedWebsiteId,
	);

	// Reset form when dialog closes
	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			setStep(1);
			setSelectedWebsiteId("");
			reset();
		}
	};

	const handleContinue = () => {
		if (step === 1 && selectedWebsiteId) {
			setStep(2);
		}
	};

	const onSubmit = async (data: ClientFormData) => {
		if (!selectedWebsite) {
			toast.error("Please select a website");
			return;
		}

		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				inviteClient({
					clientEmail: data.clientEmail,
					clientName: data.clientName,
					websiteId: selectedWebsite.id,
					websiteName: selectedWebsite.name,
					websiteUrl: selectedWebsite.url,
				}),
			);

			if (error) {
				toast.error(error.message);
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				setOpen(false);
				if (refresh) router.refresh();
				// Reset form after successful submission
				setStep(1);
				setSelectedWebsiteId("");
				reset();

				return;
			}

			// Error
			toast.error(result.message);
		});
	};

	useEffect(() => {
		if (!website || !open) return;

		setSelectedWebsiteId(website.id);
		setStep(2);
	}, [open, website]);

	useEffect(() => {
		if (!isMounted) {
			setIsMounted(true);
		}
	}, [isMounted]);

	if (!isMounted) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild={asChild}>
				{children ? (
					children
				) : (
					<Button size={"sm"} variant={"outline"} className="justify-start">
						<UserPlus />
						Invite Client
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-lg gap-0 p-0">
				<div className="space-y-6 px-6 pt-6 pb-6">
					<DialogHeader>
						<DialogTitle>
							{step === 1 ? "Select Website" : "Invite Client"}
						</DialogTitle>
						<DialogDescription>
							{step === 1
								? "Choose which website you want to invite a client to"
								: "Send a secure invite link to start collecting feedback"}
						</DialogDescription>
					</DialogHeader>

					{/* Step 1: Website Selection */}
					{step === 1 && (
						<div className="space-y-4">
							{userData?.developerWebsites &&
							userData.developerWebsites.length > 0 ? (
								<ScrollArea className="h-[300px] pr-4">
									<RadioGroup
										className="gap-2"
										value={selectedWebsiteId}
										onValueChange={setSelectedWebsiteId}
									>
										{userData.developerWebsites.map((website) => {
											const hasClient = !!website.clientId;
											const radioId = `website-${website.id}`;

											return (
												<div
													key={website.id}
													className={cn(
														"relative flex w-full items-start gap-2 rounded-md border border-input p-4 shadow-xs outline-none transition-colors",
														!hasClient &&
															"has-data-[state=checked]:border-primary/50",
														hasClient &&
															"cursor-not-allowed bg-muted/30 opacity-60",
													)}
												>
													<RadioGroupItem
														value={website.id}
														id={radioId}
														aria-describedby={`${radioId}-description`}
														className="order-1 after:absolute after:inset-0"
														disabled={hasClient}
													/>
													<div className="flex grow items-start gap-3">
														{website.screenshotKey ? (
															<Image
																src={`/api/s3/screenshot/${website.screenshotKey}`}
																alt={website.name}
																width={1920}
																height={1080}
																unoptimized
																className="aspect-video size-8 h-auto w-32 shrink-0 rounded object-cover"
															/>
														) : (
															<div className="flex size-8 shrink-0 items-center justify-center rounded bg-muted">
																<GlobeIcon className="size-4 text-muted-foreground" />
															</div>
														)}
														<div className="grid grow gap-2">
															<Label
																htmlFor={radioId}
																className={cn(
																	hasClient && "cursor-not-allowed",
																)}
															>
																{website.name}{" "}
																{hasClient && (
																	<span className="font-normal text-muted-foreground text-xs leading-[inherit]">
																		(Has client)
																	</span>
																)}
															</Label>
															<p
																id={`${radioId}-description`}
																className="text-muted-foreground text-xs"
															>
																{hasClient
																	? `Client: ${website.client?.name || website.client?.email || "Unknown"}`
																	: website.url}
															</p>
														</div>
													</div>
												</div>
											);
										})}
									</RadioGroup>
								</ScrollArea>
							) : (
								<Alert variant="secondary">
									<Info className="size-5" />
									<AlertDescription>
										You don't have any websites yet. Create a website first
										before inviting clients.
									</AlertDescription>
								</Alert>
							)}
						</div>
					)}

					{/* Step 2: Client Details Form */}
					{step === 2 && (
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
							{/* Selected Website Info */}
							{selectedWebsite && (
								<Alert variant="warning" size={"sm"} appearance={"light"}>
									<Mail className="size-5 font-bold" />
									<AlertDescription>
										Inviting client to:{" "}
										<span className="font-semibold">
											{selectedWebsite.name}
										</span>
									</AlertDescription>
								</Alert>
							)}

							<div className="grid gap-4">
								<div>
									<Label
										htmlFor={clientNameId}
										className="font-medium text-base text-muted-foreground"
									>
										Client Name
									</Label>
									<Input
										autoComplete="off"
										id={clientNameId}
										placeholder="John Smith"
										{...register("clientName")}
										aria-describedby={
											errors.clientName ? `${clientNameId}-error` : undefined
										}
										disabled={isPending}
									/>
									{errors.clientName && (
										<p
											id={`${clientNameId}-error`}
											className="text-destructive text-sm"
										>
											{errors.clientName.message}
										</p>
									)}
									<FieldDescription className="pt-1 text-xs">
										User will be able to set their own name. This name is shown
										in the invite email.
									</FieldDescription>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor={clientEmailId}
										className="font-medium text-base text-muted-foreground"
									>
										Client Email
									</Label>
									<Input
										autoComplete="off"
										id={clientEmailId}
										type="email"
										placeholder="john@example.com"
										className="mt-1"
										{...register("clientEmail")}
										aria-describedby={
											errors.clientEmail
												? `${clientEmailId}-error`
												: `${clientEmailId}-helper`
										}
										disabled={isPending}
									/>
									{errors.clientEmail ? (
										<p
											id={`${clientEmailId}-error`}
											className="text-destructive text-sm"
										>
											{errors.clientEmail.message}
										</p>
									) : (
										<p
											id={`${clientEmailId}-helper`}
											className="text-muted-foreground text-sm"
										>
											We'll send them an invite link
										</p>
									)}
								</div>
							</div>

							<Alert size={"sm"} variant="info" appearance={"light"}>
								<Info />
								<AlertDescription>
									Your client will receive an email with a secure invite link
									where they're instructed to create a profile to view the
									widget.
								</AlertDescription>
							</Alert>
						</form>
					)}

					{/* Footer with Step Indicators and Actions */}
					<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
						{!website && (
							<div className="flex justify-center space-x-1.5 max-sm:order-1">
								{[...Array(totalSteps)].map((_, index) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: goon
										key={index}
										className={cn(
											"size-1.5 rounded-full bg-primary transition-opacity",
											index + 1 === step ? "opacity-100" : "opacity-20",
										)}
									/>
								))}
							</div>
						)}
						<DialogFooter className="ml-auto">
							{step === 1 ? (
								<>
									<DialogClose asChild>
										<Button type="button" variant="ghost">
											Cancel
										</Button>
									</DialogClose>
									<Button
										type="button"
										onClick={handleContinue}
										disabled={!selectedWebsiteId}
									>
										Continue
									</Button>
								</>
							) : (
								<>
									{!website ? (
										<Button
											type="button"
											variant="ghost"
											onClick={() => setStep(1)}
											disabled={isPending}
										>
											Back
										</Button>
									) : (
										<DialogClose asChild>
											<Button
												type="button"
												variant="ghost"
												disabled={isPending}
											>
												Cancel
											</Button>
										</DialogClose>
									)}
									<Button
										type="submit"
										disabled={!isValid || isPending}
										onClick={handleSubmit(onSubmit)}
									>
										{isPending ? "Sending..." : "Send Invite"}
									</Button>
								</>
							)}
						</DialogFooter>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default InviteClientDialog;
