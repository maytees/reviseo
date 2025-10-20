"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
	{
		name: "Starter",
		description: "Perfect for freelancers and small projects",
		price: "$15",
		period: "/month",
		features: [
			"Up to 3 projects",
			"100 requests a day",
			"Excalidraw annotations",
			"Email notifications",
			"Advanced analytics",
		],
		cta: "Get Started",
		highlighted: false,
		icon: Zap,
	},
	{
		name: "Professional",
		description:
			"For growing freelancers and small agencies handling multiple clients",
		price: "$35",
		period: "/month",
		features: [
			"Unlimited projects",
			"1,000 requests a day",
			"Up to 5 users",
			"Custom Branding & Styling",
			"No Reviseo Watermark",
			"Excalidraw annotations",
			"Priority support",
			"Advanced analytics",
		],
		cta: "Get Started",
		highlighted: true,
		icon: Sparkles,
		badge: "Most Popular",
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 40 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: [0.22, 1, 0.36, 1] as const,
		},
	},
};

export function Pricing() {
	return (
		// biome-ignore lint/correctness/useUniqueElementIds: goon
		<section
			id="pricing"
			className="mt-48 w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8"
		>
			<div className="flex flex-col items-center justify-center gap-4 max-w-3xl">
				<motion.h2
					initial={{ opacity: 0, scale: 1.1, y: 100 }}
					whileInView={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
					viewport={{ once: true }}
					className="text-3xl sm:text-4xl md:text-5xl text-center font-bold font-caudex"
				>
					Simple, transparent pricing
				</motion.h2>
				<motion.p
					initial={{ opacity: 0, scale: 1.1, y: 100 }}
					whileInView={{ opacity: 1, scale: 1, y: 0 }}
					transition={{
						type: "spring",
						duration: 1.2,
						bounce: 0.1,
						delay: 0.2,
					}}
					viewport={{ once: true }}
					className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-center font-inter"
				>
					Start free, scale as you grow. No hidden fees, cancel anytime.
				</motion.p>
			</div>

			<motion.div
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.2 }}
				className="flex flex-col md:flex-row items-stretch justify-center gap-0 mt-16 sm:mt-20 w-full max-w-5xl"
			>
				{plans.map((plan, index) => {
					const Icon = plan.icon;
					return (
						<motion.div
							key={plan.name}
							variants={itemVariants}
							className={`relative ${
								plan.highlighted ? "md:w-[55%] md:scale-105 z-10" : "md:w-[45%]"
							} w-full`}
						>
							<Card
								className={`h-full relative border-border bg-gradient-to-br from-card to-card/50 p-6 sm:p-8 overflow-hidden transition-all duration-300 ${
									plan.highlighted
										? "border-primary/50 shadow-lg shadow-primary/10"
										: ""
								}`}
							>
								{/* Background Gradient */}
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									whileInView={{ opacity: 0.15, scale: 1 }}
									transition={{
										duration: 1.2,
										ease: "easeOut",
										delay: index * 0.1,
									}}
									viewport={{ once: true }}
									className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] pointer-events-none blur-3xl"
									style={{
										background: plan.highlighted
											? "radial-gradient(circle, var(--primary), var(--accent), transparent 70%)"
											: "radial-gradient(circle, var(--primary), transparent 70%)",
									}}
								/>

								<div className="relative z-10 h-full flex flex-col">
									{/* Badge */}
									{plan.badge && (
										<motion.div
											initial={{ scale: 0, rotate: -12 }}
											whileInView={{ scale: 1, rotate: 0 }}
											transition={{
												delay: 0.3 + index * 0.1,
												type: "spring",
												stiffness: 200,
											}}
											viewport={{ once: true }}
											className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium"
										>
											{plan.badge}
										</motion.div>
									)}

									{/* Icon */}
									<motion.div
										initial={{ scale: 0 }}
										whileInView={{ scale: 1 }}
										transition={{
											delay: 0.2 + index * 0.1,
											type: "spring",
											stiffness: 200,
										}}
										viewport={{ once: true }}
										className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary w-fit"
									>
										<Icon className="h-4 w-4" />
										{plan.name}
									</motion.div>

									{/* Price */}
									<div className="mb-4">
										<div className="flex items-baseline gap-1">
											<span className="text-4xl sm:text-5xl font-bold font-caudex text-foreground">
												{plan.price}
											</span>
											{plan.period && (
												<span className="text-lg text-muted-foreground font-inter">
													{plan.period}
												</span>
											)}
										</div>
										<p className="mt-2 text-sm sm:text-base text-muted-foreground font-inter">
											{plan.description}
										</p>
									</div>

									{/* Feaetures */}
									<ul className="mb-6 space-y-3 flex-1">
										{plan.features.map((feature) => (
											<motion.li
												key={feature}
												initial={{ opacity: 0, x: -20 }}
												whileInView={{ opacity: 1, x: 0 }}
												transition={{
													delay: 0.4 + index * 0.1,
													duration: 0.4,
												}}
												viewport={{ once: true }}
												className="flex items-start gap-3"
											>
												<div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
													<Check
														className="h-3 w-3 text-primary"
														strokeWidth={3}
													/>
												</div>
												<span className="text-sm sm:text-base text-foreground font-inter">
													{feature}
												</span>
											</motion.li>
										))}
									</ul>

									{/* CTA Button */}
									<Link
										href={plan.name === "Enterprise" ? "/contact" : "/signup"}
										className="w-full"
									>
										<Button
											className={`w-full font-medium transition-all duration-300 ${
												plan.highlighted
													? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
													: "bg-muted text-foreground hover:bg-muted/80"
											}`}
											size="lg"
										>
											{plan.cta}
										</Button>
									</Link>
								</div>
							</Card>
						</motion.div>
					);
				})}
			</motion.div>

			{/* FAQ or Additional Info */}
			{/* <motion.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.6 }}
				viewport={{ once: true }}
				className="mt-16 text-center"
			>
				<p className="text-sm sm:text-base text-muted-foreground font-inter">
					All plans include a 14-day free trial. No credit card required.{" "}
					<Link
						href="/pricing"
						className="text-primary hover:underline font-medium"
					>
						View detailed comparison →
					</Link>
				</p>
			</motion.div> */}
		</section>
	);
}
