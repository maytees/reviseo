"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useId, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateUserProfile } from "@/app/(main)/(dashboard)/dashboard/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WelcomeStepProps {
	onNext: () => void;
	userName: string | undefined;
	handleComplete: () => Promise<void>;
}

export function WelcomeStep({
	onNext,
	userName,
	handleComplete,
}: WelcomeStepProps) {
	const nameId = useId();
	const [name, setName] = useState(userName ?? "");
	const [isPending, startTransition] = useTransition();

	// Every account needs a name — save it before either exit path.
	const saveNameThen = (proceed: () => void | Promise<void>) => {
		const trimmed = name.trim();
		if (!trimmed) return;
		startTransition(async () => {
			if (trimmed !== userName) {
				const result = await updateUserProfile(trimmed);
				if (result.status === "error") {
					toast.error(result.message);
					return;
				}
			}
			await proceed();
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="space-y-6 py-4 text-center"
		>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
				className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
			>
				<Sparkles className="h-8 w-8 text-primary" />
			</motion.div>

			<div className="mx-auto max-w-2xl space-y-2">
				<h2 className="font-bold font-caudex text-3xl sm:text-4xl">
					{userName
						? `Welcome to Reviseo, ${userName.at(0)?.toUpperCase()}${userName.substring(1)}!`
						: "Welcome to Reviseo!"}
				</h2>
				<p className="font-inter text-base text-muted-foreground sm:text-lg">
					Let's get you set up in 3 quick steps
				</p>
			</div>

			<div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="flex flex-col items-center gap-2 rounded-lg border border-border/50 bg-card/50 p-4"
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
						<span className="font-bold font-inter text-base text-primary">
							1
						</span>
					</div>
					<p className="font-caudex font-medium text-base">Create Website</p>
					<p className="text-center font-inter text-muted-foreground text-sm">
						Add your site details
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="flex flex-col items-center gap-2 rounded-lg border border-border/50 bg-card/50 p-4"
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
						<span className="font-bold font-inter text-base text-primary">
							2
						</span>
					</div>
					<p className="font-caudex font-medium text-base">Install Widget</p>
					<p className="text-center font-inter text-muted-foreground text-sm">
						One line of code
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="flex flex-col items-center gap-2 rounded-lg border border-border/50 bg-card/50 p-4"
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
						<span className="font-bold font-inter text-base text-primary">
							3
						</span>
					</div>
					<p className="font-caudex font-medium text-base">Invite Client</p>
					<p className="text-center font-inter text-muted-foreground text-sm">
						Send invite link
					</p>
				</motion.div>
			</div>

			<div className="mx-auto flex max-w-sm flex-col gap-1.5 pt-2 text-left">
				<Label htmlFor={nameId}>What should we call you?</Label>
				<Input
					id={nameId}
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Your name"
					maxLength={100}
					disabled={isPending}
					autoComplete="name"
				/>
			</div>

			<div className="space-x-2 pt-4">
				<Button
					onClick={() => saveNameThen(handleComplete)}
					variant={"outline"}
					disabled={isPending || !name.trim()}
				>
					Skip Onboarding
				</Button>
				<Button
					onClick={() => saveNameThen(onNext)}
					className="font-inter"
					disabled={isPending || !name.trim()}
				>
					Let's get started →
				</Button>
			</div>
		</motion.div>
	);
}
