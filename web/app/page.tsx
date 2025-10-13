"use client";
import { motion } from "framer-motion";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import Noise from "@/components/landing/Noise";
import { Pricing } from "@/components/landing/Pricing";
import Problems from "@/components/landing/Problems";
import UsedWith from "@/components/landing/UsedBy";
import { ShootingStars } from "@/components/ui/shadcn-io/shooting-stars";

export default function Home() {
	return (
		<div className="min-h-scren w-full min-h-screen overflow-x-hidden relative">
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
				minDelay={500}
				maxDelay={4000}
			/>
			<ShootingStars
				starColor="#00FF9E"
				className="-z-30"
				trailColor="#00B8FF"
				minDelay={200}
				maxDelay={3500}
			/>
			<ShootingStars
				starColor="#FF6B35"
				className="-z-30"
				trailColor="#FFC857"
				minDelay={600}
				maxDelay={3200}
			/>
			<ShootingStars
				starColor="#7B2CBF"
				className="-z-30"
				trailColor="#C77DFF"
				minDelay={300}
				maxDelay={4200}
			/>
			<ShootingStars
				starColor="#06FFA5"
				className="-z-30"
				trailColor="#00D9FF"
				minDelay={450}
				maxDelay={3800}
			/>
			{/* Hero Section Gradient */}
			<motion.div
				initial={{ opacity: 0, x: -200 }}
				animate={{ opacity: 0.3, x: 0 }}
				transition={{ duration: 1.2, ease: "easeOut" }}
				className="absolute max-w-screen -top-10 -left-56 w-[700px] h-[700px] pointer-events-none -z-30 blur-3xl"
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
				className="absolute top-[220vh] -right-32 w-[700px] h-[700px] pointer-events-none -z-30 blur-3xl "
				style={{
					background:
						"linear-gradient(to bottom right, var(--accent), var(--primary), transparent 70%)",
				}}
			/>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, ease: "easeIn" }}
				className="absolute w-[100dvw] h-[100vh] mask-contain mask-alpha -z-50 [mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_100%)]"
			>
				<Noise
					patternSize={250}
					patternScaleX={1}
					patternScaleY={1}
					patternRefreshInterval={2}
					patternAlpha={13}
				/>
			</motion.div>
			<div
				className="fixed inset-0 w-full h-full pointer-events-none -z-40"
				style={{
					backgroundImage: `radial-gradient(circle, #562a2a 1px, transparent 1px)`,
					backgroundSize: "32px 32px",
				}}
			/>
			<div className="w-full pt-6 justify-center flex items-center px-2 sm:px-4 md:px-6 sticky top-4 z-50">
				<Navbar />
			</div>

			<Hero />
			<UsedWith />
			<Problems />
			<BentoFeatures />
			<Pricing />
			<FAQ />
			<Footer />
		</div>
	);
}
