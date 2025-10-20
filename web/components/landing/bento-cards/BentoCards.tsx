"use client";

import { motion } from "framer-motion";
import {
	ArrowRight,
	Check,
	Download,
	Inbox,
	ListChecks,
	Pencil,
	Shield,
	Users,
	X,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import {
	SiAngular,
	SiExcalidraw,
	SiFramer,
	SiHtml5,
	SiJavascript,
	SiNextdotjs,
	SiReact,
	SiShopify,
	SiSquarespace,
	SiVuedotjs,
	SiWebflow,
	SiWix,
	SiWordpress,
} from "react-icons/si";
import { Card } from "@/components/ui/card";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";

export function ExcalidrawBentoCard() {
	const gridPatternId = useId();
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			viewport={{ once: true }}
			className="h-full "
		>
			<Card className="group h-full relative border-border bg-gradient-to-br from-card to-card/50 p-4 transition-all duration-300 hover:shadow-lg sm:p-6 md:p-8">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-5">
					<svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
						<title>Grid Pattern</title>
						<defs>
							<pattern
								id={gridPatternId}
								width="32"
								height="32"
								patternUnits="userSpaceOnUse"
							>
								<path
									d="M 32 0 L 0 0 0 32"
									fill="none"
									stroke="currentColor"
									strokeWidth="1"
								/>
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill={`url(#${gridPatternId})`} />
					</svg>
				</div>

				<div className="relative flex h-full flex-col">
					{/* Header */}
					<div className="mb-4 sm:mb-6">
						<motion.div
							initial={{ scale: 0 }}
							whileInView={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							viewport={{ once: true }}
							className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary sm:mb-4 sm:px-3 sm:py-1.5 sm:text-sm"
						>
							<Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
							Powered by Excalidraw
						</motion.div>

						<h3 className="mb-1.5 text-balance text-xl font-bold text-foreground sm:mb-2 sm:text-2xl md:text-3xl font-caudex">
							Annotate with Ease
						</h3>
						<p className="text-pretty text-sm text-muted-foreground sm:text-base md:text-lg font-inter">
							Draw, sketch, and highlight directly on feedback using the proven
							Excalidraw canvas trusted by hundreds of thousands of people.
						</p>
					</div>

					{/* Visual Demo Area */}
					<div className="relative mb-4 flex-1 sm:mb-6">
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
							viewport={{ once: true }}
							className="relative flex h-full min-h-[200px] items-center justify-center rounded-lg border border-border bg-muted/30 p-3 sm:min-h-[260px] sm:p-4"
						>
							<motion.div
								initial={{ y: 0 }}
								whileInView={{ y: -10 }}
								transition={{
									delay: 0.6,
									duration: 0.8,
									type: "spring",
									stiffness: 100,
								}}
								whileHover={{
									y: -15,
									transition: { duration: 0.3 },
								}}
								viewport={{ once: true }}
							>
								<SiExcalidraw className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] text-[#6965db]" />
							</motion.div>
						</motion.div>
					</div>

					{/* Features List */}
					<div className="mb-4 grid gap-2 sm:mb-6 sm:grid-cols-2 sm:gap-3">
						{[
							"Easy to use",
							"Handrawn aesthetic",
							"Canvas export",
							"Beautiful by default",
						].map((feature, index) => (
							<motion.div
								key={feature}
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.8 + index * 0.1 }}
								viewport={{ once: true }}
								className="flex items-center gap-2"
							>
								<div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 sm:h-5 sm:w-5">
									<Check className="h-2.5 w-2.5 text-primary sm:h-3 sm:w-3" />
								</div>
								<span className="text-sm text-foreground sm:text-base font-inter">
									{feature}
								</span>
							</motion.div>
						))}
					</div>

					{/* CTA */}
					<Link href="/blog/excalidraw-annotations">
						<motion.button
							whileHover={{ x: 4 }}
							className="group/btn inline-flex items-center gap-2 text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:text-sm"
						>
							Learn more
							<ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1 sm:h-4 sm:w-4" />
						</motion.button>
					</Link>
				</div>
			</Card>
		</motion.div>
	);
}
export function QuickInstallCard() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			viewport={{ once: true }}
			className="h-full"
		>
			<Card className="group h-full relative border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-6 overflow-hidden">
				{/* Background Gradient */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					whileInView={{ opacity: 0.15, scale: 1 }}
					transition={{ duration: 1.2, ease: "easeOut" }}
					viewport={{ once: true }}
					className="absolute -top-0 left-20 w-[500px] h-[500px] pointer-events-none blur-3xl"
					style={{
						background:
							"radial-gradient(circle, var(--primary), transparent 70%)",
					}}
				/>

				<div className="flex h-full flex-col gap-2 justify-between relative z-10">
					<div>
						<motion.div
							initial={{ scale: 0 }}
							whileInView={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							viewport={{ once: true }}
							className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary sm:px-3 sm:py-1.5"
						>
							<Download className="h-3 w-3 sm:h-4 sm:w-4" />
							Simple integration
						</motion.div>
						<h4 className="text-lg font-semibold font-caudex">
							Get started instantly
						</h4>
						<p className="mt-1 text-base text-muted-foreground font-inter">
							Add a simple script tag or use our React, Vue, or Vanilla
							components.
						</p>
					</div>
					<div className="mt-auto space-y-2">
						<div className="rounded-md border border-border bg-muted/30 p-2.5 text-xs sm:text-sm font-mono">
							<div className="text-muted-foreground">
								&lt;link rel=&quot;stylesheet&quot;
								href=&quot;reviseo.css&quot;&gt;
							</div>
						</div>
						<div className="rounded-md border border-border bg-muted/30 p-2.5 text-xs sm:text-sm font-mono">
							<div className="text-muted-foreground">
								&lt;script src=&quot;reviseo.js&quot;&gt;&lt;/script&gt;
							</div>
						</div>
						{/* <div className="flex items-center gap-3 text-xs text-muted-foreground">
							<div className="flex items-center gap-1">
								<div className="h-2 w-2 rounded-full bg-yellow-500" />
								<span>Vanilla</span>
							</div>
							<div className="flex items-center gap-1">
								<div className="h-2 w-2 rounded-full bg-blue-500" />
								<span>React</span>
							</div>
							<div className="flex items-center gap-1">
								<div className="h-2 w-2 rounded-full bg-green-500" />
								<span>Vue</span>
							</div>
							<div className="flex items-center gap-1">
								<div className="h-2 w-2 rounded-full bg-purple-500" />
								<span>And more...</span>
							</div>
						</div> */}
					</div>
					<Link href="/blog/quick-installation">
						<motion.button
							whileHover={{ x: 4 }}
							className="group/btn inline-flex items-center gap-2 text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:text-sm mt-2"
						>
							Learn more
							<ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1 sm:h-4 sm:w-4" />
						</motion.button>
					</Link>
				</div>
			</Card>
		</motion.div>
	);
}
export function OrbitingCirclesCard() {
	const gradientId1 = useId();
	const gradientId2 = useId();
	const [isLargeScreen, setIsLargeScreen] = useState(false);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsLargeScreen(window.matchMedia("(min-width: 1024px)").matches);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			viewport={{ once: true }}
			className="h-full"
		>
			<Card className="relative h-full overflow-hidden border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-6">
				{/* Background Gradient */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					whileInView={{ opacity: 0.15, scale: 1 }}
					transition={{ duration: 1.2, ease: "easeOut" }}
					viewport={{ once: true }}
					className="absolute top-20 right-20 md:top-50 md:right-82 w-[500px] h-[500px] lg:w-[800px] lg:h-[800px] pointer-events-none blur-3xl"
					style={{
						background:
							"radial-gradient(circle, var(--primary), var(--accent), transparent 90%)",
					}}
				/>

				<div className="flex h-full flex-col relative z-10">
					<div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary sm:px-3 sm:py-1.5">
						<Zap className="h-3 w-3 sm:h-4 sm:w-4" />
						Universal compatibility
					</div>
					<h4 className="text-lg font-semibold font-caudex">
						Works everywhere
					</h4>
					<p className="mt-1 text-base text-muted-foreground font-inter">
						From vanilla JavaScript to React, Vue, and more, to no-code
						platforms like Webflow and WordPress integrate Reviseo anywhere.
					</p>

					<div className="relative flex-1 flex items-center justify-center mt-4">
						<OrbitingCircles
							iconSize={32}
							radius={isLargeScreen ? 180 : 120}
							speed={1.5}
						>
							<SiVuedotjs className="w-8 h-8 lg:w-12 lg:h-12 text-[#4FC08D]" />
							<SiNextdotjs className="w-8 h-8 lg:w-12 lg:h-12 text-foreground" />
							<SiReact className="w-8 h-8 lg:w-12 lg:h-12 text-[#61DAFB]" />
							<SiJavascript className="w-8 h-8 lg:w-12 lg:h-12 text-[#F7DF1E]" />
							<SiWebflow className="w-8 h-8 lg:w-12 lg:h-12 text-[#4353FF]" />
						</OrbitingCircles>
						<OrbitingCircles
							iconSize={28}
							radius={isLargeScreen ? 120 : 80}
							reverse
							speed={2}
						>
							<SiFramer className="w-7 h-7 lg:w-10 lg:h-10 text-[#0055FF]" />
							<SiShopify className="w-7 h-7 lg:w-10 lg:h-10 text-[#96BF48]" />
							<SiWordpress className="w-7 h-7 lg:w-10 lg:h-10 text-[#21759B]" />
							<SiWix className="w-7 h-7 lg:w-10 lg:h-10 text-[#0C6EFC]" />
						</OrbitingCircles>
						<OrbitingCircles
							iconSize={24}
							radius={isLargeScreen ? 75 : 50}
							speed={2.5}
						>
							<SiSquarespace className="w-6 h-6 lg:w-9 lg:h-9 text-foreground" />
							<SiHtml5 className="w-6 h-6 lg:w-9 lg:h-9 text-[#E34F26]" />
							<SiAngular className="w-6 h-6 lg:w-9 lg:h-9 text-[#DD0031]" />
						</OrbitingCircles>

						{/* Center logo */}
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center shadow-lg">
								<svg
									width="24"
									height="24"
									viewBox="0 0 32 32"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="lg:w-8 lg:h-8"
								>
									<title>Reviseo Logo</title>
									<defs>
										<linearGradient
											id={gradientId1}
											x1="30.8513"
											y1="2.66667"
											x2="18.9454"
											y2="24.0117"
											gradientUnits="userSpaceOnUse"
										>
											<stop stopColor="#FF0026" />
											<stop offset="1" stopColor="#8333A3" />
										</linearGradient>
										<linearGradient
											id={gradientId2}
											x1="12.4615"
											y1="12.4444"
											x2="12.4615"
											y2="32"
											gradientUnits="userSpaceOnUse"
										>
											<stop stopColor="#3C1016" />
											<stop offset="1" stopColor="#8333A3" />
										</linearGradient>
									</defs>
									<path
										d="M4.08551 7.64096L20.9305 23.1111L29.5204 15.2222C32.0314 12.9162 32.3898 10.5998 31.6756 8.49414C29.0409 0.726192 18.5867 0 10.3841 0H7.06182C4.63169 0 2.66167 1.97001 2.66167 4.40015C2.66167 5.63211 3.17814 6.80765 4.08551 7.64096Z"
										fill={`url(#${gradientId1})`}
									/>
									<path
										d="M23.7138 25.5349L9.40358 12.4444L2.10638 19.1197C-0.0245027 21.0689 -0.330499 23.0269 0.27368 24.8071C2.51034 31.3974 11.3891 32 18.3485 32L21.2028 32C23.2574 32 24.923 30.3344 24.923 28.2798C24.923 27.2357 24.4842 26.2396 23.7138 25.5349Z"
										fill={`url(#${gradientId2})`}
									/>
								</svg>
							</div>
						</div>
					</div>

					<Link href="/blog/universal-compatibility">
						<motion.button
							whileHover={{ x: 4 }}
							className="group/btn inline-flex items-center gap-2 text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:text-sm mt-4"
						>
							Learn more
							<ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1 sm:h-4 sm:w-4" />
						</motion.button>
					</Link>
				</div>
			</Card>
		</motion.div>
	);
}

export function CollaborationCard() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			viewport={{ once: true }}
			className="h-full"
		>
			<Card className="group h-full border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-6 relative overflow-hidden">
				{/* Background Gradient */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					whileInView={{ opacity: 0.15, scale: 1 }}
					transition={{ duration: 1.2, ease: "easeOut" }}
					viewport={{ once: true }}
					className="absolute -top-0 left-20 w-[500px] h-[500px] pointer-events-none blur-3xl"
					style={{
						background:
							"radial-gradient(circle, var(--primary), transparent 70%)",
					}}
				/>

				<div className="flex h-full flex-col gap-2 justify-between relative z-10">
					<div>
						<div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary sm:px-3 sm:py-1.5">
							<Users className="h-3 w-3 sm:h-4 sm:w-4" />
							Invite only access
						</div>
						<h4 className="text-lg font-semibold font-caudex">
							Easy For Clients
						</h4>
						<p className="mt-1 text-base text-muted-foreground font-inter">
							Send email invites to clients. Simple onboarding with secure,
							invite only access.
						</p>
					</div>
					<div className="mt-3 flex justify-end">
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							whileInView={{ scale: 1, opacity: 1 }}
							transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
							viewport={{ once: true }}
						>
							<Inbox className="size-24 text-primary" />
						</motion.div>
					</div>
					<Link href="/blog/client-collaboration">
						<motion.button
							whileHover={{ x: 4 }}
							className="group/btn inline-flex items-center gap-2 text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:text-sm"
						>
							Learn more
							<ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1 sm:h-4 sm:w-4" />
						</motion.button>
					</Link>
				</div>
			</Card>
		</motion.div>
	);
}

export function InviteOnlyVisualCard() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			viewport={{ once: true }}
			className="h-full"
		>
			<Card className="group h-full relative border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-6 overflow-hidden">
				{/* Background Gradient */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					whileInView={{ opacity: 0.15, scale: 1 }}
					transition={{ duration: 1.2, ease: "easeOut" }}
					viewport={{ once: true }}
					className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] pointer-events-none blur-3xl"
					style={{
						background:
							"radial-gradient(circle, var(--primary), transparent 70%)",
					}}
				/>

				<div className="relative z-10 flex h-full flex-col">
					{/* Header */}
					<div className="mb-3 sm:mb-4">
						<motion.div
							initial={{ scale: 0 }}
							whileInView={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							viewport={{ once: true }}
							className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary sm:px-3 sm:py-1.5"
						>
							<Shield className="h-3 w-3 sm:h-4 sm:w-4" />
							Invite-only access
						</motion.div>
						<h4 className="text-lg font-semibold font-caudex">
							Only For Your Clients
						</h4>
						<p className="mt-1 text-sm sm:text-base text-muted-foreground font-inter">
							Only invited clients see the widget. Random website visitors won't
							see anything.
						</p>
					</div>

					{/* Visual Demonstration - Toggle Comparison */}
					<div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 mt-2 sm:mt-4">
						{/* Client (Invited) Window */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							viewport={{ once: true }}
							className="flex flex-col items-center gap-2"
						>
							<div className="w-28 sm:w-24 md:w-32 lg:w-40">
								<div className="bg-background rounded-lg border-2 border-border shadow-lg overflow-hidden">
									{/* Browser chrome */}
									<div className="bg-muted px-2 py-1.5 flex gap-1.5">
										<div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
										<div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
										<div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
									</div>
									{/* Content */}
									<div className="p-3 h-20 sm:h-20 md:h-24 bg-background relative">
										<motion.div
											initial={{ scale: 0 }}
											whileInView={{ scale: 1 }}
											transition={{
												delay: 0.6,
												type: "spring",
												stiffness: 300,
												damping: 15,
											}}
											viewport={{ once: true }}
											className="absolute bottom-2 right-2 w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center shadow-md"
										>
											<div className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-background"></div>
										</motion.div>
									</div>
								</div>
							</div>
							<motion.div
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								transition={{ delay: 0.7, duration: 0.3 }}
								viewport={{ once: true }}
								className="flex items-center gap-1.5"
							>
								<div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
									<Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
								</div>
								<span className="text-xs font-medium text-foreground font-inter">
									Client
								</span>
							</motion.div>
						</motion.div>

						{/* Random Visitor Window */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4, duration: 0.5 }}
							viewport={{ once: true }}
							className="flex flex-col items-center gap-2"
						>
							<div className="w-28 sm:w-24 md:w-32 lg:w-40">
								<div className="bg-background rounded-lg border-2 border-border shadow-lg overflow-hidden">
									{/* Browser chrome */}
									<div className="bg-muted px-2 py-1.5 flex gap-1.5">
										<div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
										<div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
										<div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
									</div>
									{/* Content - Empty */}
									<div className="p-3 h-20 sm:h-20 md:h-24 bg-background"></div>
								</div>
							</div>
							<motion.div
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								transition={{ delay: 0.7, duration: 0.3 }}
								viewport={{ once: true }}
								className="flex items-center gap-1.5"
							>
								<div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
									<X className="w-2.5 h-2.5 text-white" strokeWidth={3} />
								</div>
								<span className="text-xs font-medium text-foreground font-inter">
									Visitor
								</span>
							</motion.div>
						</motion.div>
					</div>

					<Link href="/blog/invite-only-access">
						<motion.button
							whileHover={{ x: 4 }}
							className="group/btn inline-flex items-center gap-2 text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:text-sm mt-3 sm:mt-4"
						>
							Learn more
							<ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1 sm:h-4 sm:w-4" />
						</motion.button>
					</Link>
				</div>
			</Card>
		</motion.div>
	);
}

export function TrackChangesCard() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			viewport={{ once: true }}
			className="h-full"
		>
			<Card className="group h-full border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-6 relative overflow-hidden">
				{/* Background Gradient */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					whileInView={{ opacity: 0.15, scale: 1 }}
					transition={{ duration: 1.2, ease: "easeOut" }}
					viewport={{ once: true }}
					className="absolute -top-0 right-20 w-[500px] h-[500px] pointer-events-none blur-3xl"
					style={{
						background:
							"radial-gradient(circle, var(--primary), transparent 70%)",
					}}
				/>

				<div className="flex h-full flex-col gap-2 justify-between relative z-10">
					<div>
						<motion.div
							initial={{ scale: 0 }}
							whileInView={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							viewport={{ once: true }}
							className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary sm:px-3 sm:py-1.5"
						>
							<ListChecks className="h-3 w-3 sm:h-4 sm:w-4" />
							Track progress
						</motion.div>
						<h4 className="text-lg font-semibold font-caudex">
							Keep Clients In The Loop
						</h4>
						<p className="mt-1 text-base text-muted-foreground font-inter">
							Let your clients see every step of the way. Update feedback status
							so they always know what you're working on.
						</p>
					</div>

					{/* Status Flow */}
					<div className="flex items-center justify-center gap-2 sm:gap-3 mt-3">
						{/* New Pill */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							animate={{
								scale: [1, 1.05, 1],
							}}
							transition={{
								delay: 0.5,
								duration: 0.5,
								scale: {
									duration: 2,
									repeat: Number.POSITIVE_INFINITY,
									ease: "easeInOut",
								},
							}}
							className="relative flex items-center justify-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500/10 border border-red-500/30 rounded-full"
						>
							<span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full" />
							<span className="text-[10px] sm:text-xs font-medium text-red-700 dark:text-red-400">
								New
							</span>
						</motion.div>

						{/* Arrow 1 */}
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							animate={{
								opacity: [0.5, 1, 0.5],
							}}
							transition={{
								delay: 0.7,
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
						>
							<ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground/50" />
						</motion.div>

						{/* In Progress Pill */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.9, duration: 0.5 }}
							viewport={{ once: true }}
							className="flex items-center justify-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full"
						>
							<span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full" />
							<span className="text-[10px] sm:text-xs font-medium text-amber-700 dark:text-amber-400">
								In Progress
							</span>
						</motion.div>

						{/* Arrow 2 */}
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							animate={{
								opacity: [0.5, 1, 0.5],
							}}
							transition={{
								delay: 1.1,
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
						>
							<ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground/50" />
						</motion.div>

						{/* Resolved Pill */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.3, duration: 0.5 }}
							viewport={{ once: true }}
							className="flex items-center justify-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-green-500/10 border border-green-500/30 rounded-full"
						>
							<Check
								className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600 dark:text-green-400"
								strokeWidth={3}
							/>
							<span className="text-[10px] sm:text-xs font-medium text-green-700 dark:text-green-400">
								Resolved
							</span>
						</motion.div>
					</div>

					{/* Mini Feedback Card Demo */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 1.5 }}
						viewport={{ once: true }}
						className="mt-3 p-3 bg-background/50 rounded-lg border border-border"
					>
						<div className="flex items-start gap-2">
							<div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded flex-shrink-0" />
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-foreground truncate font-inter">
									Update homepage design
								</p>
								<div className="flex items-center gap-1.5 mt-1">
									<span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
									<span className="text-xs font-inter font-bold text-amber-700 dark:text-amber-400">
										In Progress
									</span>
								</div>
							</div>
						</div>
					</motion.div>

					<Link href="/blog/track-feedback-progress">
						<motion.button
							whileHover={{ x: 4 }}
							className="group/btn inline-flex items-center gap-2 text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:text-sm mt-2"
						>
							Learn more
							<ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1 sm:h-4 sm:w-4" />
						</motion.button>
					</Link>
				</div>
			</Card>
		</motion.div>
	);
}
