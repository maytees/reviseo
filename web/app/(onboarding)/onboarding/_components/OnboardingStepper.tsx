"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
	label: string;
	description?: string;
}

interface OnboardingStepperProps {
	steps: Step[];
	currentStep: number;
}

export function OnboardingStepper({
	steps,
	currentStep,
}: OnboardingStepperProps) {
	return (
		<div className="w-full flex justify-center mb-20 max-w-xl mx-auto">
			<div className="flex items-center justify-between  max-w-2xl w-full">
				{steps.map((step, index) => {
					const isCompleted = index < currentStep;
					const isActive = index === currentStep;
					const isLast = index === steps.length - 1;

					return (
						<div key={step.label} className="flex items-center">
							<div className="flex flex-col items-center relative">
								{/* Step Circle */}
								<motion.div
									initial={false}
									animate={{
										backgroundColor: isCompleted
											? "hsl(142 76% 36%)"
											: isActive
												? "var(--primary)"
												: "transparent",
										borderColor: isCompleted
											? "hsl(142 76% 36%)"
											: isActive
												? "var(--primary)"
												: "var(--border)",
									}}
									transition={{ duration: 0.4, ease: "easeOut" }}
									className={cn(
										"size-10 rounded-full border-2 flex items-center justify-center relative z-10",
										"transition-all duration-400",
									)}
								>
									{isCompleted ? (
										<motion.div
											initial={{ scale: 0, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{ duration: 0.3, ease: "easeOut" }}
										>
											<Check className="w-4 h-4 text-white" />
										</motion.div>
									) : (
										<span
											className={cn(
												"text-2xl mb-1 font-medium font-alegreya",
												isActive
													? "text-primary-foreground"
													: "text-muted-foreground",
											)}
										>
											{index + 1}
										</span>
									)}
								</motion.div>

								{/* Step Label */}
								<div className="absolute top-10 text-center w-20 mt-5">
									<p
										className={cn(
											"text-base font-medium transition-colors duration-300 font-alegreya",
											isActive || isCompleted
												? "text-foreground"
												: "text-muted-foreground",
										)}
									>
										{step.label}
									</p>
								</div>
							</div>

							{/* Connecting Line */}
							{!isLast && (
								<div className="flex-1 h-[px] mx-1 sm:mx-2 relative bg-border">
									<motion.div
										initial={{ width: "0%" }}
										animate={{
											width: isCompleted ? "100%" : "0%",
										}}
										transition={{ duration: 0.4, ease: "easeOut" }}
										className="absolute top-0 left-0 h-full bg-green-600"
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
