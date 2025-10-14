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
	onBack: () => void;
	isPending?: boolean;
	defaultValues?: Partial<ClientFormData>;
}

export function InviteClientStep({
	onSubmit,
	onBack,
	isPending = false,
	defaultValues,
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
			className="space-y-6 py-4"
		>
			<div className="space-y-1 text-center">
				<h2 className="text-xl sm:text-2xl font-bold font-caudex">
					Invite your first client
				</h2>
				<p className="text-sm text-muted-foreground font-alegreya">
					Send them a secure invite link to start giving feedback
				</p>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-5 max-w-2xl mx-auto"
			>
				<div className="grid sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label
							htmlFor={clientNameId}
							className="text-sm font-alegreya font-medium"
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
							className="h-10 font-alegreya"
							disabled={isPending}
						/>
						{errors.clientName && (
							<p
								id={`${clientNameId}-error`}
								className="text-xs text-destructive font-alegreya"
							>
								{errors.clientName.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label
							htmlFor={clientEmailId}
							className="text-sm font-alegreya font-medium"
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
							className="h-10 font-alegreya"
							disabled={isPending}
						/>
						{errors.clientEmail ? (
							<p
								id={`${clientEmailId}-error`}
								className="text-xs text-destructive font-alegreya"
							>
								{errors.clientEmail.message}
							</p>
						) : (
							<p
								id={`${clientEmailId}-helper`}
								className="text-xs text-muted-foreground font-alegreya"
							>
								We'll send them an invite link
							</p>
						)}
					</div>
				</div>

				<Alert className="border-border bg-accent/30">
					<Info className="h-4 w-4" />
					<AlertDescription className="text-xs font-alegreya">
						Your client will receive an email with a secure link to access the
						widget.
					</AlertDescription>
				</Alert>

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
						Send Invite & Finish
					</Button>
				</div>
			</form>
		</motion.div>
	);
}
