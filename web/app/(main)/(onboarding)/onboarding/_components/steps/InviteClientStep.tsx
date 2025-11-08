"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ClientFormData, clientSchema } from "@/lib/validations";

interface InviteClientStepProps {
	onSubmit: (data: ClientFormData) => void;
	isPending?: boolean;
	defaultValues?: Partial<ClientFormData>;
	handleComplete: () => Promise<void>;
}

export function InviteClientStep({
	onSubmit,
	isPending = false,
	defaultValues,
	handleComplete,
}: InviteClientStepProps) {
	const clientNameId = useId();
	const clientEmailId = useId();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<ClientFormData>({
		resolver: zodResolver(clientSchema),
		mode: "onChange",
		defaultValues,
	});

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="py-4 space-y-6"
		>
			<div className="space-y-1 text-center">
				<h2 className="text-2xl font-bold sm:text-3xl font-caudex">
					Invite your first client
				</h2>
				<p className="text-base text-muted-foreground font-inter">
					Send them a secure invite link to start giving feedback
				</p>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="max-w-2xl mx-auto space-y-5"
			>
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label
							htmlFor={clientNameId}
							className="text-base font-medium font-inter"
						>
							Client Name
						</Label>
						<Input
							id={clientNameId}
							placeholder="John Smith"
							{...register("clientName")}
							aria-describedby={
								errors.clientName ? `${clientNameId}-error` : undefined
							}
							className="h-10 font-inter"
							disabled={isPending}
						/>
						{errors.clientName && (
							<p
								id={`${clientNameId}-error`}
								className="text-sm text-destructive font-inter"
							>
								{errors.clientName.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label
							htmlFor={clientEmailId}
							className="text-base font-medium font-inter"
						>
							Client Email
						</Label>
						<Input
							id={clientEmailId}
							type="email"
							placeholder="john@example.com"
							{...register("clientEmail")}
							aria-describedby={
								errors.clientEmail
									? `${clientEmailId}-error`
									: `${clientEmailId}-helper`
							}
							className="h-10 font-inter"
							disabled={isPending}
						/>
						{errors.clientEmail ? (
							<p
								id={`${clientEmailId}-error`}
								className="text-sm text-destructive font-inter"
							>
								{errors.clientEmail.message}
							</p>
						) : (
							<p
								id={`${clientEmailId}-helper`}
								className="text-sm text-muted-foreground font-inter"
							>
								We'll send them an invite link
							</p>
						)}
					</div>
				</div>

				<Alert variant={"secondary"}>
					<Info className="size-5" />
					<AlertDescription>
						Your client will receive an email with a secure invite link where
						they&apos;re instructed to create a profile to view the widget.
					</AlertDescription>
				</Alert>

				<div className="flex justify-end gap-5 pt-2">
					<Button onClick={handleComplete} type="button" variant={"ghost"}>
						Skip
					</Button>
					<Button
						type="submit"
						disabled={!isValid || isPending}
						className="font-inter"
					>
						Send Invite & Finish
					</Button>
				</div>
			</form>
		</motion.div>
	);
}
