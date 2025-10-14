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
			className="flex flex-col items-center text-center space-y-5 py-8"
		>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
				className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center"
			>
				<CheckCircle2 className="w-10 h-10 text-green-500" />
			</motion.div>

			<div className="space-y-2 max-w-md">
				<h2 className="text-2xl sm:text-3xl font-bold font-caudex">
					You're all set!
				</h2>
				<p className="text-sm sm:text-base text-muted-foreground font-alegreya">
					Invite sent to{" "}
					<span className="text-foreground font-medium">{clientEmail}</span>
				</p>
				<p className="text-xs text-muted-foreground font-alegreya">
					Redirecting to your dashboard...
				</p>
			</div>

			<div className="flex gap-1.5 mt-4">
				<motion.div
					animate={{ scale: [1, 1.2, 1] }}
					transition={{ duration: 1, repeat: Infinity }}
					className="w-2 h-2 rounded-full bg-primary"
				/>
				<motion.div
					animate={{ scale: [1, 1.2, 1] }}
					transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
					className="w-2 h-2 rounded-full bg-primary"
				/>
				<motion.div
					animate={{ scale: [1, 1.2, 1] }}
					transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
					className="w-2 h-2 rounded-full bg-primary"
				/>
			</div>
		</motion.div>
	);
}
