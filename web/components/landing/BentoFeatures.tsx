"use client";

import { motion, type Variants } from "framer-motion";
import {
	CollaborationCard,
	ExcalidrawBentoCard,
	InviteOnlyVisualCard,
	OrbitingCirclesCard,
	QuickInstallCard,
	TrackChangesCard,
} from "./bento-cards/BentoCards";

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: [0.22, 1, 0.36, 1] as const,
		},
	},
};

export function BentoFeatures() {
	return (
		<section className="mt-48 w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
			<div className="flex flex-col items-center justify-center gap-4 max-w-3xl">
				<motion.h2
					initial={{ opacity: 0, scale: 1.1, y: 100 }}
					whileInView={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
					viewport={{ once: true }}
					className="text-3xl sm:text-4xl md:text-5xl text-center font-bold font-caudex"
				>
					Everything you need to make client feedback seamless
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
					className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-center font-alegreya"
				>
					Powerful tools designed to make client collaboration effortless and
					efficient.
				</motion.p>
			</div>
			<motion.div
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.2 }}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-16 sm:mt-20 w-full max-w-7xl auto-rows-[minmax(200px,auto)]"
			>
				{/* Visual Annotations - Large */}
				<motion.div
					variants={itemVariants}
					className="sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2"
				>
					<ExcalidrawBentoCard />
				</motion.div>

				{/* One-Line Installation */}
				<motion.div variants={itemVariants} className="sm:row-span-1">
					<QuickInstallCard />
				</motion.div>

				{/* Collaboration */}
				<motion.div variants={itemVariants} className="sm:row-span-1">
					<CollaborationCard />
				</motion.div>

				{/* Orbiting Circles */}
				<motion.div
					variants={itemVariants}
					className="row-span-2 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2"
				>
					<OrbitingCirclesCard />
				</motion.div>

				{/* Invite-Only Visual Demo */}
				<motion.div variants={itemVariants} className="sm:row-span-1">
					<InviteOnlyVisualCard />
				</motion.div>

				{/* Track Changes Card */}
				<motion.div variants={itemVariants} className="sm:row-span-1">
					<TrackChangesCard />
				</motion.div>
			</motion.div>
		</section>
	);
}
