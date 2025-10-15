"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type WebsiteFormData, websiteSchema } from "@/lib/validations";

interface CreateWebsiteStepProps {
	onNext: (data: WebsiteFormData) => void;
	onBack: () => void;
	isPending?: boolean;
	defaultValues?: Partial<WebsiteFormData>;
}

export function CreateWebsiteStep({
	onNext,
	onBack,
	isPending = false,
	defaultValues,
}: CreateWebsiteStepProps) {
	const websiteNameId = useId();
	const websiteUrlId = useId();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<WebsiteFormData>({
		resolver: zodResolver(websiteSchema),
		mode: "onChange",
		defaultValues,
	});

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
					Create your first website
				</h2>
				<p className="text-base text-muted-foreground font-alegreya">
					Add the website where you want to collect client feedback
				</p>
			</div>

			<form
				onSubmit={handleSubmit(onNext)}
				className="space-y-5 max-w-2xl mx-auto"
			>
				<div className="grid sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label
							htmlFor={websiteNameId}
							className="text-base font-alegreya font-medium"
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
							className="h-10 font-alegreya"
						/>
						{errors.websiteName ? (
							<p
								id={`${websiteNameId}-error`}
								className="text-sm text-destructive font-alegreya"
							>
								{errors.websiteName.message}
							</p>
						) : (
							<p
								id={`${websiteNameId}-helper`}
								className="text-sm text-muted-foreground font-alegreya"
							>
								A friendly name for your project
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label
							htmlFor={websiteUrlId}
							className="text-base font-alegreya font-medium"
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
							className="h-10 font-alegreya"
						/>
						{errors.websiteUrl ? (
							<p
								id={`${websiteUrlId}-error`}
								className="text-sm text-destructive font-alegreya"
							>
								{errors.websiteUrl.message}
							</p>
						) : (
							<p
								id={`${websiteUrlId}-helper`}
								className="text-sm text-muted-foreground font-alegreya"
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
						className="font-alegreya"
						disabled={isPending}
					>
						← Back
					</Button>
					<Button
						type="submit"
						disabled={!isValid || isPending}
						className="font-alegreya"
					>
						Continue →
					</Button>
				</div>
			</form>
		</motion.div>
	);
}
