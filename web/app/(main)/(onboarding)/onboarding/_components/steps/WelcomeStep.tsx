"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="py-4 space-y-6 text-center"
		>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
				className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/10"
			>
				<Sparkles className="w-8 h-8 text-primary" />
			</motion.div>

			<div className="max-w-2xl mx-auto space-y-2">
				<h2 className="text-3xl font-bold sm:text-4xl font-caudex">
					{userName
						? `Welcome to Reviseo, ${userName.at(0)?.toUpperCase()}${userName.substring(1)}!`
						: "Welcome to Reviseo!"}
				</h2>
				<p className="text-base sm:text-lg text-muted-foreground font-inter">
					Let's get you set up in 3 quick steps
				</p>
			</div>

			<div className="grid max-w-3xl grid-cols-1 gap-4 pt-2 mx-auto sm:grid-cols-3">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card/50 border-border/50"
				>
					<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
						<span className="text-base font-bold text-primary font-inter">
							1
						</span>
					</div>
					<p className="text-base font-medium font-caudex">Create Website</p>
					<p className="text-sm text-center text-muted-foreground font-inter">
						Add your site details
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card/50 border-border/50"
				>
					<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
						<span className="text-base font-bold text-primary font-inter">
							2
						</span>
					</div>
					<p className="text-base font-medium font-caudex">Install Widget</p>
					<p className="text-sm text-center text-muted-foreground font-inter">
						One line of code
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card/50 border-border/50"
				>
					<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
						<span className="text-base font-bold text-primary font-inter">
							3
						</span>
					</div>
					<p className="text-base font-medium font-caudex">Invite Client</p>
					<p className="text-sm text-center text-muted-foreground font-inter">
						Send invite link
					</p>
				</motion.div>
			</div>

			<div className="pt-4 space-x-2">
				<Button onClick={handleComplete} variant={"outline"}>
					Skip Onboarding
				</Button>
				<Button onClick={onNext} className="font-inter">
					Let's get started →
				</Button>
			</div>
		</motion.div>
	);
}
