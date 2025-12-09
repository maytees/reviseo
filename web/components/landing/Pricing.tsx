"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch, SwitchIndicator, SwitchWrapper } from "@/components/ui/switch";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "../ui/spinner";

type BillingPeriod = "monthly" | "yearly";

type Plan = {
	name: string;
	description: string;
	priceMonthly: string;
	priceYearly: string;
	slug: string;
	slugYearly?: string;
	features: string[];
	cta: string;
	highlighted: boolean;
	icon: typeof Zap;
	badge?: string;
};

const plans: Plan[] = [
	{
		name: "Starter",
		description: "Perfect for freelancers and small projects",
		priceMonthly: "$10",
		priceYearly: "$120",
		features: [
			"10 websites",
			"100 feedback submissions per month",
			"Excalidraw annotations",
			"Email notifications",
		],
		slug: "starter",
		slugYearly: "starter-yearly",
		cta: "Get Started",
		highlighted: false,
		icon: Zap,
	},
	{
		name: "Professional",
		description:
			"For growing freelancers and small agencies handling multiple clients",
		priceMonthly: "$30",
		priceYearly: "$360",
		slug: "professional",
		slugYearly: "professional-yearly",
		features: [
			"Unlimited websites",
			"Unlimited clients",
			"Unlimited feedback submissions",
			"Excalidraw annotations",
			"Email notifications",
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

export function Pricing({
	plan,
}: {
	plan:
		| "starter-monthly"
		| "starter-yearly"
		| "professional-monthly"
		| "professional-yearly"
		| null
		| undefined;
}) {
	const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	// Helper function to determine button state for each plan
	const getButtonConfig = (planSlug: string) => {
		// Not logged in
		if (!session?.user) {
			return {
				text: "Log in",
				disabled: false,
			};
		}

		// Logged in - Check if user has this exact plan (matching tier and billing period)
		const currentPlanKey = `${planSlug}-${billingPeriod}` as
			| "starter-monthly"
			| "starter-yearly"
			| "professional-monthly"
			| "professional-yearly";

		if (plan === currentPlanKey) {
			return {
				text: "Go to Dashboard",
				disabled: false,
			};
		}

		// Check if user has same tier but different billing period
		const planTier = planSlug as "starter" | "professional";
		const userPlanTier = plan?.split("-")[0] as
			| "starter"
			| "professional"
			| undefined;

		if (userPlanTier === planTier) {
			return {
				text:
					billingPeriod === "yearly" ? "Switch to Yearly" : "Switch to Monthly",
				disabled: false,
			};
		}

		// User wants to upgrade/downgrade to different tier
		if (plan) {
			return {
				text: userPlanTier === "starter" ? "Upgrade" : "Downgrade",
				disabled: false,
			};
		}

		// No plan (shouldn't happen as there's no free tier)
		return {
			text: "Get Started",
			disabled: false,
		};
	};

	return (
		<section
			id="pricing"
			className="mt-48 flex w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8"
		>
			<div className="flex max-w-3xl flex-col items-center justify-center gap-4">
				<motion.h2
					initial={{ opacity: 0, scale: 1.1, y: 100 }}
					whileInView={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
					viewport={{ once: true }}
					className="text-center font-bold font-caudex text-3xl sm:text-4xl md:text-5xl"
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
					className="text-center font-inter text-lg text-muted-foreground sm:text-xl md:text-2xl"
				>
					Start free, scale as you grow. No hidden fees, cancel anytime.
				</motion.p>
			</div>

			{/* Billing Period Toggle */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
				viewport={{ once: true }}
				className="mt-8 flex items-center gap-4"
			>
				<span
					className={`font-inter text-sm transition-colors ${
						billingPeriod === "monthly"
							? "text-foreground font-medium"
							: "text-muted-foreground"
					}`}
				>
					Monthly
				</span>
				<SwitchWrapper>
					<Switch
						checked={billingPeriod === "yearly"}
						onCheckedChange={(checked) =>
							setBillingPeriod(checked ? "yearly" : "monthly")
						}
						aria-label="Toggle billing period"
					>
						<SwitchIndicator state="on">Yearly</SwitchIndicator>
						<SwitchIndicator state="off">Monthly</SwitchIndicator>
					</Switch>
				</SwitchWrapper>
				<span
					className={`font-inter text-sm transition-colors ${
						billingPeriod === "yearly"
							? "text-foreground font-medium"
							: "text-muted-foreground"
					}`}
				>
					Yearly
				</span>
				{/* {billingPeriod === "yearly" && (
					<span className="rounded-full bg-primary/10 px-2 py-1 font-inter text-xs font-medium text-primary">
						10% off
					</span>
				)} */}
			</motion.div>

			<motion.div
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.2 }}
				className="mt-16 flex w-full max-w-5xl flex-col items-stretch justify-center gap-0 sm:mt-20 md:flex-row"
			>
				{plans.map((planItem, index) => {
					const Icon = planItem.icon;
					return (
						<motion.div
							key={planItem.name}
							variants={itemVariants}
							className={`relative ${
								planItem.highlighted
									? "z-10 md:w-[55%] md:scale-105"
									: "md:w-[45%]"
							} w-full`}
						>
							<Card
								className={`relative h-full overflow-hidden border-border bg-linear-to-br from-card to-card/50 p-6 transition-all duration-300 sm:p-8 ${
									planItem.highlighted
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
									className="-top-20 -translate-x-1/2 pointer-events-none absolute left-1/2 h-[400px] w-[400px] blur-3xl"
									style={{
										background: planItem.highlighted
											? "radial-gradient(circle, var(--primary), var(--accent), transparent 70%)"
											: "radial-gradient(circle, var(--primary), transparent 70%)",
									}}
								/>

								<div className="relative z-10 flex h-full flex-col">
									{/* Badge */}
									{planItem.badge && (
										<motion.div
											initial={{ scale: 0, rotate: -12 }}
											whileInView={{ scale: 1, rotate: 0 }}
											transition={{
												delay: 0.3 + index * 0.1,
												type: "spring",
												stiffness: 200,
											}}
											viewport={{ once: true }}
											className="-top-2 -right-2 absolute rounded-full bg-primary px-3 py-1 font-medium text-primary-foreground text-xs"
										>
											{planItem.badge}
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
										className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary text-xs"
									>
										<Icon className="h-4 w-4" />
										{planItem.name}
									</motion.div>

									{/* Price */}
									<div className="mb-4">
										<div className="flex items-baseline gap-1">
											<span className="font-bold font-caudex text-4xl text-foreground sm:text-5xl">
												{billingPeriod === "monthly"
													? planItem.priceMonthly
													: planItem.priceYearly}
											</span>
											<span className="font-inter text-lg text-muted-foreground">
												{billingPeriod === "monthly" ? "/month" : "/year"}
											</span>
										</div>
										<p className="mt-2 font-inter text-muted-foreground text-sm sm:text-base">
											{planItem.description}
										</p>
									</div>

									{/* Features */}
									<ul className="mb-6 flex-1 space-y-3">
										{planItem.features.map((feature) => (
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
												<div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
													<Check
														className="h-3 w-3 text-primary"
														strokeWidth={3}
													/>
												</div>
												<span className="font-inter text-foreground text-sm sm:text-base">
													{feature}
												</span>
											</motion.li>
										))}
									</ul>

									{/* CTA Button */}
									<Button
										disabled={
											isPending || getButtonConfig(planItem.slug).disabled
										}
										className={`w-full font-medium transition-all duration-300 ${
											planItem.highlighted
												? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
												: "bg-muted text-foreground hover:bg-muted/80"
										}`}
										onClick={async () => {
											// If not logged in, go to login first
											if (!session?.user) {
												router.push("/login");
												return;
											}

											// Check if this is the user's current plan
											const currentPlanKey =
												`${planItem.slug}-${billingPeriod}` as
													| "starter-monthly"
													| "starter-yearly"
													| "professional-monthly"
													| "professional-yearly";

											if (plan === currentPlanKey) {
												// Go to dashboard if viewing current plan
												router.push("/dashboard");
												return;
											}

											// Handle checkout for plan purchase/upgrade/downgrade
											const slug =
												billingPeriod === "yearly" && planItem.slugYearly
													? planItem.slugYearly
													: planItem.slug;
											await authClient.checkout({ slug });
										}}
										size="lg"
									>
										{isPending ? (
											<Spinner />
										) : (
											getButtonConfig(planItem.slug).text
										)}
									</Button>
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
						className="font-medium text-primary hover:underline"
					>
						View detailed comparison →
					</Link>
				</p>
			</motion.div> */}
		</section>
	);
}
