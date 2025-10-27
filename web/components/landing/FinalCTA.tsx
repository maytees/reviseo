"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Noise from "./Noise";

export function FinalCTA() {
	return (
		<section className="relative flex flex-col items-center justify-center w-full px-4 mt-48 sm:px-6 md:px-8">
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
				viewport={{ once: true, amount: 0.2 }}
				className="w-full max-w-5xl"
			>
				<Card className="relative p-12 overflow-hidden shadow-2xl bg-gradient-to-br from-card to-card/50 sm:p-16 md:p-20 backdrop-blur-sm">
					{/* Bottom Radial Gradient */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						whileInView={{ opacity: 0.4, scale: 1 }}
						transition={{ duration: 1.5, ease: "easeOut" }}
						viewport={{ once: true }}
						className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-full h-[350px] pointer-events-none blur-3xl -z-10"
						style={{
							background:
								"radial-gradient(ellipse at bottom, var(--accent), var(--primary), transparent 70%)",
						}}
					/>
					{/* Noise Texture */}
					<div className="absolute inset-0 w-full h-full pointer-events-none opacity-80">
						<Noise
							patternSize={150}
							patternScaleX={1}
							patternScaleY={1}
							patternRefreshInterval={6}
							patternAlpha={15}
						/>
					</div>

					{/* Additional gradient overlay */}
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 0.2 }}
						transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
						viewport={{ once: true }}
						className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-primary/20 via-transparent to-accent/20"
					/>

					<div className="relative z-10 flex flex-col items-center justify-between gap-2 sm:gap-4">
						{/* Heading */}
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="text-2xl font-bold text-center sm:text-3xl md:text-4xl lg:text-5xl font-caudex"
						>
							What are you waiting for?
						</motion.h2>

						{/* Description */}
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							viewport={{ once: true }}
							className="max-w-lg text-sm text-center sm:text-base md:text-lg lg:text-xl text-muted-foreground font-inter"
						>
							Start saving time today with Reviseo. Make your clients happy with
							feedback done right.
						</motion.p>

						{/* CTA Button */}
						<motion.div
							initial={{ opacity: 0, y: 20, scale: 0.95 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							transition={{
								duration: 0.6,
								delay: 0.4,
								type: "spring",
								stiffness: 200,
							}}
							viewport={{ once: true }}
						>
							<Button asChild className="" variant={"inset"} size={"lg"}>
								{/* <Link href="#pricing">
									Get Started
									<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
								</Link> */}
								<Link href="/waitlist">
									Join Waitlist
									<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
						</motion.div>
					</div>
				</Card>
			</motion.div>
		</section>
	);
}
