"use client";
import { motion } from "framer-motion";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { Contact } from "@/components/landing/Contact";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import Noise from "@/components/landing/Noise";
import Problems from "@/components/landing/Problems";
import UsedWith from "@/components/landing/UsedBy";
import { ShootingStars } from "@/components/ui/shadcn-io/shooting-stars";

// NOTE: these sections are intentionally NOT code-split with next/dynamic —
// lazy boundaries shift React's useId counter between server and client,
// causing hydration mismatches in the accordion/SVG ids below the fold.

export default function Home() {
	return (
		<div className="relative min-h-screen min-h-scren w-full overflow-x-hidden">
			{/* Two star layers (was six — each is its own rAF animation loop) */}
			<ShootingStars
				starColor="#9E00FF"
				className="-z-30"
				trailColor="#2EB9DF"
				minDelay={400}
				maxDelay={3000}
			/>
			<ShootingStars
				starColor="#FF0099"
				className="-z-30"
				trailColor="#FFB800"
				minDelay={800}
				maxDelay={4000}
			/>
			{/* Hero Section Gradient */}
			<motion.div
				initial={{ opacity: 0, x: -200 }}
				animate={{ opacity: 0.3, x: 0 }}
				transition={{ duration: 1.2, ease: "easeOut" }}
				className="-top-10 -left-56 -z-30 pointer-events-none absolute h-[700px] w-[700px] max-w-screen blur-3xl"
				style={{
					background:
						"radial-gradient(circle, oklch(0.5053 0.2350 286.8637), transparent 70%)",
				}}
			/>
			{/* Problems Section Gradient */}
			<motion.div
				initial={{ opacity: 0, rotate: 180 }}
				whileInView={{
					opacity: 0.3,
					rotate: 0,
				}}
				transition={{
					duration: 4.5,
					stiffness: 50,
					damping: 50,
					mass: 2,
					type: "spring",
					bounce: 0.05,
					ease: "easeInOut",
				}}
				viewport={{ once: true, amount: 0.3 }}
				className="-right-32 -z-30 pointer-events-none absolute top-[220vh] h-[700px] w-[700px] blur-3xl"
				style={{
					background:
						"linear-gradient(to bottom right, var(--accent), var(--primary), transparent 70%)",
				}}
			/>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, ease: "easeIn" }}
				className="mask-contain mask-alpha -z-50 mask-[linear-gradient(to_bottom,black_0%,black_80%,transparent_100%)] absolute h-screen w-dvw"
			>
				<Noise
					patternSize={250}
					patternScaleX={1}
					patternScaleY={1}
					// Repaint every 8 frames instead of 2 — indistinguishable
					// visually, ~4x less canvas churn.
					patternRefreshInterval={8}
					patternAlpha={13}
				/>
			</motion.div>
			<div
				className="-z-40 pointer-events-none fixed inset-0 h-full w-full"
				style={{
					backgroundImage: `radial-gradient(circle, #562a2a 1px, transparent 1px)`,
					backgroundSize: "32px 32px",
				}}
			/>
			{/* <div className="sticky top-4 z-50 flex w-full items-center justify-center px-2 pt-6 sm:px-4 md:px-6">
				<Navbar />
			</div> */}
			<Hero />
			<UsedWith />
			<Problems />
			<BentoFeatures />
			<HowItWorks />
			{/* <Pricing /> */}
			<FAQ />
			<Contact />
			<FinalCTA />
			<Footer />
		</div>
	);
}
