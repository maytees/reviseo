"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
	onNext: () => void;
	userName: string | undefined;
}

export function WelcomeStep({ onNext, userName }: WelcomeStepProps) {
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
				className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
			>
				<Sparkles className="w-8 h-8 text-primary" />
			</motion.div>

			<div className="space-y-2 max-w-2xl mx-auto">
				<h2 className="text-3xl sm:text-4xl font-bold font-caudex">
					{userName
						? `Welcome to Reviseo, ${userName.at(0)?.toUpperCase()}${userName.substring(1)}!`
						: "Welcome to Reviseo!"}
				</h2>
				<p className="text-base sm:text-lg text-muted-foreground font-inter">
					Let's get you set up in 3 quick steps
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 border border-border/50"
				>
					<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
						<span className="text-base font-bold text-primary font-inter">
							1
						</span>
					</div>
					<p className="text-base font-medium font-caudex">Create Website</p>
					<p className="text-sm text-muted-foreground font-inter text-center">
						Add your site details
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 border border-border/50"
				>
					<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
						<span className="text-base font-bold text-primary font-inter">
							2
						</span>
					</div>
					<p className="text-base font-medium font-caudex">Install Widget</p>
					<p className="text-sm text-muted-foreground font-inter text-center">
						One line of code
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 border border-border/50"
				>
					<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
						<span className="text-base font-bold text-primary font-inter">
							3
						</span>
					</div>
					<p className="text-base font-medium font-caudex">Invite Client</p>
					<p className="text-sm text-muted-foreground font-inter text-center">
						Send invite link
					</p>
				</motion.div>
			</div>

			<div className="pt-4">
				<Button onClick={onNext} className="font-inter">
					Let's get started →
				</Button>
			</div>
		</motion.div>
	);
}
