"use client";

import type { VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import {
	CheckCircle2,
	ChevronRightCircle,
	Loader2,
	XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, type buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VerifyInstallationProps = {
	projectId: string;
	className?: string;
	hideIcon?: boolean;
	reset?: boolean;
	refresh?: boolean;
} & VariantProps<typeof buttonVariants>;

type VerificationState = "idle" | "loading" | "success" | "error";

const VerifyInstallation = ({
	projectId,
	className,
	hideIcon,
	size = "lg",
	reset = true,
	refresh = false,
}: VerifyInstallationProps) => {
	const [state, setState] = useState<VerificationState>("idle");
	const router = useRouter();

	useEffect(() => {
		if (state === "error" && reset) {
			const timer = setTimeout(() => {
				setState("idle");
			}, 2500);
			return () => clearTimeout(timer);
		}
	}, [state, reset]);

	const handleVerify = async () => {
		setState("loading");

		try {
			const response = await fetch(`/api/websites/verify/${projectId}`, {
				method: "POST",
			});

			const data = await response.json();

			if (response.ok && data.installed) {
				setState("success");
				router.refresh();
				toast.success("Widget installed successfully!");
			} else {
				setState("error");
				toast.error(data.error || "Widget not found on your website");
			}
		} catch {
			setState("error");
			toast.error("Failed to verify installation");
		}
	};

	const getButtonVariant = () => {
		if (state === "success") return "success";
		if (state === "error") return "destructive";
		return "primary";
	};

	const getButtonContent = () => {
		switch (state) {
			case "loading":
				return (
					<>
						Verifying...
						<Loader2 className="animate-spin" />
					</>
				);
			case "success":
				return (
					<>
						Widget Installed!
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 500, damping: 15 }}
						>
							<CheckCircle2 />
						</motion.div>
					</>
				);
			case "error":
				return (
					<>
						Verification Error
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 500, damping: 15 }}
						>
							<XCircle />
						</motion.div>
					</>
				);
			default:
				return (
					<>
						Verify Widget
						{!hideIcon && (
							<ChevronRightCircle className="group-hover:translate-x-0.5 transition-all duration-300 ease-in-out" />
						)}
					</>
				);
		}
	};

	return (
		<motion.div
			animate={
				state === "success"
					? {
							scale: [1, 1.05, 1],
						}
					: state === "error"
						? {
								x: [0, -10, 10, -10, 10, 0],
							}
						: {}
			}
			transition={{
				duration: state === "success" ? 0.5 : 0.4,
			}}
		>
			<Button
				size={size}
				variant={getButtonVariant()}
				className={cn("w-full group font-inter sm:w-auto", className)}
				onClick={handleVerify}
				disabled={state === "loading"}
			>
				{getButtonContent()}
			</Button>
		</motion.div>
	);
};

export default VerifyInstallation;
