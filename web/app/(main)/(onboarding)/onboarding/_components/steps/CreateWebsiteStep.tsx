"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import type { UserOnboardingDataType } from "@/app/(main)/data/user/get-user-onboarding-data";
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
}

export function CreateWebsiteStep({
	onNext,
	onBack,
	isPending = false,
	defaultValues,
	userData,
}: CreateWebsiteStepProps) {
	const websiteNameId = useId();
	const websiteUrlId = useId();
	const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(
		null,
	);

	const existingWebsites = userData?.developerWebsites || [];
	const hasExistingWebsites = existingWebsites.length > 0;

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		setValue,
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
			<div className="space-y-1  text-center">
				<h2 className="text-2xl sm:text-4xl font-bold font-caudex">
					{hasExistingWebsites
						? "Select or create a website"
						: "Create your first website"}
				</h2>
				<p className="text-base text-muted-foreground font-inter">
					{hasExistingWebsites
						? "Choose an existing website or add a new one"
						: "Add the website where you want to collect client feedback"}
				</p>
			</div>

			{hasExistingWebsites && (
				<div className="max-w-2xl mx-auto">
					<div className="bg-accent/20 border border-border rounded-lg p-4">
						<Label className="text-base font-inter font-medium mb-3 block">
							Select Existing Website
						</Label>
						<Select onValueChange={handleExistingWebsiteSelect}>
							<SelectTrigger className="w-full h-11 font-inter">
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
											<span className="text-xs text-muted-foreground">
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
							<span className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground font-inter">
								Or create new
							</span>
						</div>
					</div>
				</div>
			)}

			<form
				onSubmit={handleSubmit(onNext)}
				className="space-y-5 max-w-2xl mx-auto"
			>
				<div className="grid sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label
							htmlFor={websiteNameId}
							className="text-base font-inter font-medium"
						>
							Website Name
						</Label>
						<Input
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
								className="text-sm text-destructive font-inter"
							>
								{errors.websiteName.message}
							</p>
						) : (
							<p
								id={`${websiteNameId}-helper`}
								className="text-sm text-muted-foreground font-inter"
							>
								A friendly name for your project
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label
							htmlFor={websiteUrlId}
							className="text-base font-inter font-medium"
						>
							Website URL
						</Label>
						<Input
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
								className="text-sm text-destructive font-inter"
							>
								{errors.websiteUrl.message}
							</p>
						) : (
							<p
								id={`${websiteUrlId}-helper`}
								className="text-sm text-muted-foreground font-inter"
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
					<Button
						type="submit"
						disabled={!isValid || isPending}
						className="font-inter"
					>
						Continue →
					</Button>
				</div>
			</form>
		</motion.div>
	);
}
