"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

interface SuccessStepProps {
	clientEmail: string;
	onComplete: () => void;
}

export function SuccessStep({ clientEmail, onComplete }: SuccessStepProps) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onComplete();
		}, 2000);

		return () => clearTimeout(timer);
	}, [onComplete]);

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="flex flex-col items-center space-y-5 py-8 text-center"
		>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
				className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10"
			>
				<CheckCircle2 className="h-10 w-10 text-green-500" />
			</motion.div>

			<div className="max-w-md space-y-2">
				<h2 className="font-bold font-caudex text-2xl sm:text-3xl">
					You're all set!
				</h2>
				<p className="font-inter text-muted-foreground text-sm sm:text-base">
					Invite sent to{" "}
					<span className="font-medium text-foreground">{clientEmail}</span>
				</p>
				<p className="font-inter text-muted-foreground text-xs">
					Redirecting to your dashboard...
				</p>
			</div>

			<div className="mt-4 flex gap-1.5">
				<motion.div
					animate={{ scale: [1, 1.2, 1] }}
					transition={{ duration: 1, repeat: Infinity }}
					className="h-2 w-2 rounded-full bg-primary"
				/>
				<motion.div
					animate={{ scale: [1, 1.2, 1] }}
					transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
					className="h-2 w-2 rounded-full bg-primary"
				/>
				<motion.div
					animate={{ scale: [1, 1.2, 1] }}
					transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
					className="h-2 w-2 rounded-full bg-primary"
				/>
			</div>
		</motion.div>
	);
}
