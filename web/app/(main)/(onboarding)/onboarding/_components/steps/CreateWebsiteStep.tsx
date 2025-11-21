"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import type { UserOnboardingDataType } from "@/app/data/user/get-user-onboarding-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type WebsiteFormData, websiteSchema } from "@/lib/validations";

interface CreateWebsiteStepProps {
	onNext: (data: WebsiteFormData & { existingWebsiteId?: string }) => void;
	onBack: () => void;
	isPending?: boolean;
	defaultValues?: Partial<WebsiteFormData>;
	userData: UserOnboardingDataType;
	handleComplete: () => Promise<void>;
}

export function CreateWebsiteStep({
	onNext,
	onBack,
	isPending = false,
	defaultValues,
	userData,
	handleComplete,
}: CreateWebsiteStepProps) {
	const websiteNameId = useId();
	const websiteUrlId = useId();
	const [_, setSelectedWebsiteId] = useState<string | null>(null);

	const existingWebsites = userData?.developerWebsites || [];
	const hasExistingWebsites = existingWebsites.length > 0;

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		// setValue,
	} = useForm<WebsiteFormData>({
		resolver: zodResolver(websiteSchema),
		mode: "onChange",
		defaultValues,
	});

	const handleExistingWebsiteSelect = (websiteId: string) => {
		setSelectedWebsiteId(websiteId);
		const website = existingWebsites.find((w) => w.id === websiteId);
		if (website) {
			onNext({
				websiteName: website.name,
				websiteUrl: website.url,
				existingWebsiteId: website.id,
			});
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="space-y-6 py-4"
		>
			<div className="space-y-1 text-center">
				<h2 className="font-bold font-caudex text-2xl sm:text-4xl">
					{hasExistingWebsites
						? "Select or create a website"
						: "Create your first website"}
				</h2>
				<p className="font-inter text-base text-muted-foreground">
					{hasExistingWebsites
						? "Choose an existing website or add a new one"
						: "Add the website where you want to collect client feedback"}
				</p>
			</div>

			{hasExistingWebsites && (
				<div className="mx-auto max-w-2xl">
					<div className="rounded-lg border border-border bg-accent/20 p-4">
						<Label className="mb-3 block font-inter font-medium text-base">
							Select Existing Website
						</Label>
						<Select onValueChange={handleExistingWebsiteSelect}>
							<SelectTrigger className="h-11 w-full font-inter">
								<SelectValue placeholder="Choose a website..." />
							</SelectTrigger>
							<SelectContent>
								{existingWebsites.map((website) => (
									<SelectItem
										key={website.id}
										value={website.id}
										className="font-inter"
									>
										<div className="flex flex-col items-start">
											<span className="font-medium">{website.name}</span>
											<span className="text-muted-foreground text-xs">
												{website.url}
											</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-border border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 font-inter text-muted-foreground">
								Or create new
							</span>
						</div>
					</div>
				</div>
			)}

			<form
				onSubmit={handleSubmit(onNext)}
				className="mx-auto max-w-2xl space-y-5"
			>
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label
							htmlFor={websiteNameId}
							className="font-inter font-medium text-base"
						>
							Website Name
						</Label>
						<Input
							autoComplete="off"
							id={websiteNameId}
							placeholder="My Client's Portfolio"
							{...register("websiteName")}
							disabled={isPending}
							aria-describedby={
								errors.websiteName
									? `${websiteNameId}-error`
									: `${websiteNameId}-helper`
							}
							className="h-10 font-inter"
						/>
						{errors.websiteName ? (
							<p
								id={`${websiteNameId}-error`}
								className="font-inter text-destructive text-sm"
							>
								{errors.websiteName.message}
							</p>
						) : (
							<p
								id={`${websiteNameId}-helper`}
								className="font-inter text-muted-foreground text-sm"
							>
								A friendly name for your client&apos;s website
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label
							htmlFor={websiteUrlId}
							className="font-inter font-medium text-base"
						>
							Website URL
						</Label>
						<Input
							autoComplete="off"
							id={websiteUrlId}
							type="url"
							placeholder="https://example.com"
							{...register("websiteUrl")}
							disabled={isPending}
							aria-describedby={
								errors.websiteUrl
									? `${websiteUrlId}-error`
									: `${websiteUrlId}-helper`
							}
							className="h-10 font-inter"
						/>
						{errors.websiteUrl ? (
							<p
								id={`${websiteUrlId}-error`}
								className="font-inter text-destructive text-sm"
							>
								{errors.websiteUrl.message}
							</p>
						) : (
							<p
								id={`${websiteUrlId}-helper`}
								className="font-inter text-muted-foreground text-sm"
							>
								Where the widget will be installed
							</p>
						)}
					</div>
				</div>

				<div className="flex justify-between pt-2">
					<Button
						type="button"
						variant="outline"
						onClick={onBack}
						className="font-inter"
						disabled={isPending}
					>
						← Back
					</Button>
					<div className="space-x-2">
						<Button variant={"outline"} onClick={handleComplete}>
							Quit Onboarding
						</Button>
						<Button
							type="submit"
							disabled={!isValid || isPending}
							className="font-inter"
						>
							Continue →
						</Button>
					</div>
				</div>
			</form>
		</motion.div>
	);
}
