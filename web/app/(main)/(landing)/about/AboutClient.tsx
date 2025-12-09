"use client";

import { motion } from "framer-motion";
import { Lightbulb, Mail, Users } from "lucide-react";
import Link from "next/link";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import Noise from "@/components/landing/Noise";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShootingStars } from "@/components/ui/shadcn-io/shooting-stars";

export default function AboutClient() {
	return (
		<div className="relative min-h-screen w-full overflow-x-hidden">
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
				className="-top-10 -left-56 -z-30 pointer-events-none absolute h-[700px] w-[700px] max-w-screen blur-3xl"
				style={{
					background:
						"radial-gradient(circle, oklch(0.5053 0.2350 286.8637), transparent 70%)",
				}}
			/>
			{/* Additional Gradient */}
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
				className="-right-32 -z-30 pointer-events-none absolute top-[150vh] h-[700px] w-[700px] blur-3xl"
				style={{
					background:
						"linear-gradient(to bottom right, var(--accent), var(--primary), transparent 70%)",
				}}
			/>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, ease: "easeIn" }}
				className="mask-contain mask-alpha -z-50 absolute h-[100vh] w-[100dvw] [mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_100%)]"
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
				className="-z-40 pointer-events-none fixed inset-0 h-full w-full"
				style={{
					backgroundImage: `radial-gradient(circle, #562a2a 1px, transparent 1px)`,
					backgroundSize: "32px 32px",
				}}
			/>
			{/* <div className="sticky top-4 z-50 flex w-full items-center justify-center px-2 pt-6 sm:px-4 md:px-6">
				<Navbar />
			</div> */}

			{/* Hero Section */}
			<section className="mt-32 flex w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8">
				<div className="flex max-w-4xl flex-col items-center justify-center gap-6">
					<motion.div
						initial={{ scale: 0 }}
						whileInView={{ scale: 1 }}
						transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
						viewport={{ once: true }}
						className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary text-xs"
					>
						<Users className="h-4 w-4" />
						About Us
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, scale: 1.1, y: 100 }}
						whileInView={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
						viewport={{ once: true }}
						className="text-center font-bold font-caudex text-5xl leading-snug sm:text-5xl md:text-6xl"
					>
						Built by freelancers,
						<br />
						<span className="bg-gradient-to-r from-accent to-primary bg-clip-text font-caudex text-transparent">
							for freelancers
						</span>
					</motion.h1>
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
						className="max-w-2xl text-center font-inter text-lg text-muted-foreground sm:text-lg md:text-xl"
					>
						At Reviseo, we know the frustration of endless emails and vague
						feedback firsthand. That's why we built Reviseo — to make client
						collaboration simple, visual, and stress free for freelance web
						developers.
					</motion.p>
				</div>
			</section>

			{/* Mission Section */}
			<section className="mt-32 flex w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8">
				<div className="w-full max-w-5xl">
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
						viewport={{ once: true, amount: 0.2 }}
					>
						<Card className="relative overflow-hidden border-border bg-gradient-to-br from-card to-card/50 p-8 sm:p-12">
							{/* Background Gradient */}
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 0.15, scale: 1 }}
								transition={{ duration: 1.2, ease: "easeOut" }}
								viewport={{ once: true }}
								className="-translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] blur-3xl"
								style={{
									background:
										"radial-gradient(circle, var(--primary), var(--accent), transparent 70%)",
								}}
							/>

							<div className="relative z-10">
								<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary text-xs">
									<Lightbulb className="h-4 w-4" />
									Our Mission
								</div>
								<h2 className="mb-6 font-bold font-caudex text-3xl sm:text-4xl">
									Simplifying client feedback, one annotation at a time
								</h2>
								<p className="mb-4 font-inter text-lg text-muted-foreground leading-relaxed">
									As freelance developers ourselves, we know the pain of
									decoding vague client feedback like "make it pop" or "I don't
									like this section." We spent hours going back and forth over
									email, trying to understand what our clients really wanted.
								</p>
								<p className="font-inter text-lg text-muted-foreground leading-relaxed">
									Reviseo was born from this frustration. We wanted a tool that
									let clients show us exactly what they meant — with visual
									annotations, comments, and screenshots. No more guessing. No
									more endless emails. Just clear, actionable feedback that
									helps you deliver better work, faster.
								</p>
							</div>
						</Card>
					</motion.div>
				</div>
			</section>

			{/* <section className="flex flex-col items-center justify-center w-full px-4 mt-32 sm:px-6 md:px-8">
				<div className="w-full max-w-5xl">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="mb-16 text-center"
					>
						<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
							<Code className="w-4 h-4" />
							Meet the Founders
						</div>
						<h2 className="text-3xl font-bold sm:text-4xl md:text-5xl font-caudex">
							The team behind Reviseo
						</h2>
					</motion.div>

					<div className="grid gap-8 md:grid-cols-2">
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
						>
							<Card className="h-full p-6 transition-all duration-300 border-border bg-linear-to-br from-card to-card/50 hover:shadow-lg sm:p-8">
								<div className="flex flex-col items-center">
									<Avatar className="w-32 h-32 mb-6 border-4 border-primary/20">
										<AvatarImage
											src="/blog/maytham.jpg"
											alt="Maytham Ajam"
											className="object-cover"
										/>
										<AvatarFallback className="text-4xl font-bold text-white bg-linear-to-br from-primary to-accent font-caudex">
											MA
										</AvatarFallback>
									</Avatar>
									<h3 className="mb-1 text-2xl font-bold font-caudex">
										Maytham Ajam
									</h3>
									<p className="mb-4 text-sm font-medium text-primary">
										Co Founder & CTO
									</p>
									<p className="mb-4 text-center text-muted-foreground font-inter">
										Maytham is a full stack developer with a passion for
										building tools that solve real problems. With years of
										experience in web development and client work, he
										understands the technical challenges freelancers face every
										day. At Reviseo, Maytham leads the technical vision,
										ensuring the platform is fast, reliable, and easy to
										integrate.
									</p>
									<div className="flex items-center gap-3 mt-4">
										<Button asChild variant="outline" size="sm">
											<Link
												href="https://www.linkedin.com/in/maythamajam/"
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2"
											>
												<SiLinkedin className="w-4 h-4 text-blue-600" />
												LinkedIn
											</Link>
										</Button>
										<Button asChild variant="outline" size="sm">
											<Link
												href="mailto:maytham@reviseo.app"
												className="flex items-center gap-2"
											>
												<Mail className="w-4 h-4" />
												maytham@reviseo.app
											</Link>
										</Button>
									</div>
								</div>
							</Card>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							viewport={{ once: true }}
						>
							<Card className="h-full p-6 transition-all duration-300 border-border bg-gradient-to-br from-card to-card/50 hover:shadow-lg sm:p-8">
								<div className="flex flex-col items-center">
									<Avatar className="w-32 h-32 mb-6 border-4 border-accent/20">
										<AvatarImage
											src="/blog/ansh.jpg"
											alt="Ansh Seghal"
											className="object-cover"
										/>
										<AvatarFallback className="text-4xl font-bold text-white bg-gradient-to-br from-accent to-primary font-caudex">
											AS
										</AvatarFallback>
									</Avatar>
									<h3 className="mb-1 text-2xl font-bold font-caudex">
										Ansh Seghal
									</h3>
									<p className="mb-4 text-sm font-medium text-primary">
										Co Founder & CEO
									</p>
									<p className="mb-4 text-center text-muted-foreground font-inter">
										TODO: Ansh Description
									</p>
									<div className="flex items-center gap-3 mt-4">
										<Button asChild variant="outline" size="sm">
											<Link
												href="https://www.linkedin.com/in/anshseghal/"
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2"
											>
												<SiLinkedin className="w-4 h-4 text-blue-600" />
												LinkedIn
											</Link>
										</Button>
										<Button asChild variant="outline" size="sm">
											<Link
												href="mailto:ansh@reviseo.app"
												className="flex items-center gap-2"
											>
												<Mail className="w-4 h-4" />
												ansh@reviseo.app
											</Link>
										</Button>
									</div>
								</div>
							</Card>
						</motion.div>
					</div>
				</div>
			</section> */}

			{/* Contact CTA */}
			<section className="mt-32 flex w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="w-full max-w-3xl"
				>
					<Card className="relative overflow-hidden border-border bg-gradient-to-br from-card to-card/50 p-8 text-center sm:p-12">
						{/* Background Gradient */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 0.15, scale: 1 }}
							transition={{ duration: 1.2, ease: "easeOut" }}
							viewport={{ once: true }}
							className="-translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] blur-3xl"
							style={{
								background:
									"radial-gradient(circle, var(--primary), var(--accent), transparent 70%)",
							}}
						/>

						<div className="relative z-10">
							<Mail className="mx-auto mb-4 h-12 w-12 text-primary" />
							<h3 className="mb-4 font-bold font-caudex text-2xl sm:text-3xl">
								Want to get in touch?
							</h3>
							<p className="mb-6 font-inter text-lg text-muted-foreground">
								We'd love to hear from you. Whether you have questions,
								feedback, or just want to say hi, we're here to help.
							</p>
							<Button asChild size="lg">
								<Link href="/#contact">Contact Us</Link>
							</Button>
						</div>
					</Card>
				</motion.div>
			</section>

			<FinalCTA />
			<Footer />
		</div>
	);
}
