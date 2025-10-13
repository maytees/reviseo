"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Check, Copy } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	MacAppMock,
	MacAppMockContent,
	MacAppMockHeader,
	MacAppMockTitle,
} from "@/components/ui/mac-app-mock";

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.3,
		},
	},
};

const stepVariants: Variants = {
	hidden: { opacity: 0, y: 40 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

export function HowItWorks() {
	return (
		<section className="mt-48 w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
			{/* Section Header */}
			<div className="flex flex-col items-center justify-center gap-4 max-w-3xl">
				<motion.h2
					initial={{ opacity: 0, scale: 1.1, y: 100 }}
					whileInView={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
					viewport={{ once: true }}
					className="text-4xl sm:text-5xl md:text-6xl text-center font-bold font-caudex"
				>
					How It Works
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
					className="text-xl sm:text-2xl md:text-3xl text-muted-foreground text-center font-alegreya"
				>
					From setup to feedback in 3 simple steps
				</motion.p>
				<motion.div
					initial={{ scaleX: 0 }}
					whileInView={{ scaleX: 1 }}
					transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
					viewport={{ once: true }}
					className="w-16 h-1 bg-primary rounded-full mt-2"
				/>
			</div>

			{/* Steps */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.1 }}
				className="max-w-6xl mx-auto space-y-24 lg:space-y-32 mt-16 sm:mt-20 w-full"
			>
				{/* Step 1 - Code Snippet */}
				<motion.div
					variants={stepVariants}
					className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
				>
					<div className="space-y-2">
						<div className="flex items-center gap-4">
							<motion.div
								initial={{ scale: 0 }}
								whileInView={{ scale: 1 }}
								transition={{
									delay: 0.2,
									type: "spring",
									stiffness: 200,
									damping: 15,
								}}
								viewport={{ once: true }}
								className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shrink-0"
							>
								1
							</motion.div>
							<h3 className="text-3xl sm:text-4xl font-bold font-caudex">
								Install the widget
							</h3>
						</div>
						<p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-alegreya">
							Copy one line of code and paste it into your client's website.
							Works with any platform in under 60 seconds.
						</p>
						<p className="text-base text-muted-foreground/80 font-alegreya">
							No backend changes needed. Just drop in the script tag and you're
							done.
						</p>
					</div>

					{/* Code Snippet Visual */}
					<CodeSnippetVisual />
				</motion.div>

				{/* Step 2 - Email Invite */}
				<motion.div
					variants={stepVariants}
					className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
				>
					{/* Email Mockup Visual */}
					<EmailInviteVisual />

					<div className="space-y-2 order-1 lg:order-2">
						<div className="flex items-center gap-4">
							<motion.div
								initial={{ scale: 0 }}
								whileInView={{ scale: 1 }}
								transition={{
									delay: 0.2,
									type: "spring",
									stiffness: 200,
									damping: 15,
								}}
								viewport={{ once: true }}
								className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shrink-0"
							>
								2
							</motion.div>
							<h3 className="text-3xl sm:text-4xl font-bold font-caudex">
								Invite your client
							</h3>
						</div>
						<p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-alegreya">
							Create a client profile and send them a secure invite link. They
							sign up once and can access all their assigned websites.
						</p>
						<p className="text-base text-muted-foreground/80 font-alegreya">
							One click to copy the invite link. Send via email, Slack, or
							however you communicate.
						</p>
					</div>
				</motion.div>

				{/* Step 3 - Dashboard */}
				<motion.div
					variants={stepVariants}
					className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
				>
					<div className="space-y-2">
						<div className="flex items-center gap-4">
							<motion.div
								initial={{ scale: 0 }}
								whileInView={{ scale: 1 }}
								transition={{
									delay: 0.2,
									type: "spring",
									stiffness: 200,
									damping: 15,
								}}
								viewport={{ once: true }}
								className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shrink-0"
							>
								3
							</motion.div>
							<h3 className="text-3xl sm:text-4xl font-bold font-caudex">
								Get clear feedback
							</h3>
						</div>
						<p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-alegreya">
							Your client clicks the feedback button, draws what they want
							changed, and submits. You see it instantly in your dashboard with
							full context.
						</p>
						<p className="text-base text-muted-foreground/80 font-alegreya">
							Screenshot, annotations, page URL, and browser info—all captured
							automatically.
						</p>
					</div>

					{/* Dashboard Visual */}
					<DashboardVisual />
				</motion.div>
			</motion.div>
		</section>
	);
}

// Code Snippet Component
function CodeSnippetVisual() {
	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			whileInView={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.8, delay: 0.3 }}
			viewport={{ once: true }}
			className="relative"
		>
			{/* Background glow */}
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				whileInView={{ opacity: 0.15, scale: 1 }}
				transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
				viewport={{ once: true }}
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none blur-3xl -z-10"
				style={{
					background:
						"radial-gradient(circle, var(--primary), var(--accent), transparent 70%)",
				}}
			/>

			<div className=" bg-background rounded-lg overflow-hidden shadow-2xl border border-slate-800">
				{/* Editor Header */}
				<div className="px-4 py-2 flex items-center justify-between border-b border-border">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded-full bg-red-500" />
						<div className="w-3 h-3 rounded-full bg-yellow-500" />
						<div className="w-3 h-3 rounded-full bg-green-500" />
						<span className="ml-4 text-base text-slate-400 font-mono">
							index.html
						</span>
					</div>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="text-sm text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
					>
						<Copy className="w-3 h-3" />
						Copy
					</motion.button>
				</div>

				{/* Code Content */}
				<div className="p-6 font-mono text-base">
					<div className="text-slate-500">{`<!-- Add to your site -->`}</div>
					<div className="mt-2">
						<span className="text-purple-400">{`<script`}</span>
					</div>
					<div className="ml-4">
						<span className="text-blue-400">src</span>
						<span className="text-slate-400">=</span>
						<span className="text-green-400">"https://reviseo.js"</span>
					</div>
					<div>
						<span className="text-purple-400">{`/>`}</span>
						<motion.span
							animate={{ opacity: [1, 0, 1] }}
							transition={{ duration: 1, repeat: Infinity }}
							className="ml-1 text-slate-400"
						>
							|
						</motion.span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

// Email Invite Component
function EmailInviteVisual() {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			whileInView={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.8, delay: 0.3 }}
			viewport={{ once: true }}
			className="relative order-2 lg:order-1"
		>
			{/* Background glow */}
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				whileInView={{ opacity: 0.15, scale: 1 }}
				transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
				viewport={{ once: true }}
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none blur-3xl -z-10"
				style={{
					background:
						"radial-gradient(circle, var(--primary), var(--accent), transparent 70%)",
				}}
			/>

			<MacAppMock>
				<MacAppMockHeader>
					<MacAppMockTitle>New Message</MacAppMockTitle>
				</MacAppMockHeader>
				<MacAppMockContent className="bg-background space-y-4">
					{/* Email Header */}
					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<span className="text-base font-medium text-muted-foreground font-alegreya">
								To:
							</span>
							<span className="text-base text-foreground font-alegreya">
								john@clientco.com
							</span>
						</div>
						<div className="flex items-center gap-3">
							<span className="text-base font-medium text-muted-foreground font-alegreya">
								Subject:
							</span>
							<span className="text-base text-foreground font-alegreya">
								Website Feedback Access
							</span>
						</div>
					</div>

					<div className="h-px bg-border" />

					{/* Email Body */}
					<div className="space-y-4">
						<p className="text-foreground font-alegreya">Hi John,</p>
						<p className="text-muted-foreground leading-relaxed font-alegreya">
							You can now give feedback on your website using Reviseo. Click
							below to get started:
						</p>
						<Button className="w-full sm:w-auto" size="sm">
							Get Started <ArrowRight className="w-4 h-4 ml-2" />
						</Button>
						<div className="bg-muted rounded-md p-3 border border-border flex items-center justify-between gap-3">
							<code className="text-sm text-muted-foreground break-all font-mono">
								https://reviseo.com/invite/abc123xyz
							</code>
							<motion.div
								initial={{ scale: 0 }}
								whileInView={{ scale: 1 }}
								transition={{ delay: 0.8, type: "spring" }}
								viewport={{ once: true }}
								className="flex items-center gap-1 text-sm text-green-600 shrink-0 font-alegreya"
							>
								<Check className="w-3 h-3" />
								Copied
							</motion.div>
						</div>
					</div>
				</MacAppMockContent>
			</MacAppMock>
		</motion.div>
	);
}

// Dashboard Visual Component
function DashboardVisual() {
	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			whileInView={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.8, delay: 0.3 }}
			viewport={{ once: true }}
			className="relative"
		>
			{/* Background glow */}
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				whileInView={{ opacity: 0.15, scale: 1 }}
				transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
				viewport={{ once: true }}
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none blur-3xl -z-10"
				style={{
					background:
						"radial-gradient(circle, var(--primary), var(--accent), transparent 70%)",
				}}
			/>
			<div className="grid grid-cols-2 gap-4">
				{/* Client View */}
				<div className="col-span-2 bg-card rounded-lg overflow-hidden shadow-xl border border-border p-4">
					<div className="text-sm font-medium text-muted-foreground mb-3 font-alegreya">
						Client's View
					</div>
					<div className="rounded aspect-video relative overflow-hidden">
						{/* Annotation overlay */}
						<Image
							src="/howitworks.svg"
							width="400"
							height="225"
							alt="Annotation Example"
							className="w-full h-full object-cover"
						/>
					</div>
					<p className="text-sm text-muted-foreground/80 mt-3 font-alegreya">
						Clients annotate screenshots directly in an Excalidraw canvas,
						adding a title, detailed description, and categorizing feedback as
						bugs or features.
					</p>
				</div>

				{/* Dashboard Notification */}
				<div className="col-span-2 bg-card rounded-lg overflow-hidden shadow-xl border border-border p-4">
					<div className="flex items-center justify-between mb-4">
						<div className="text-sm font-medium text-muted-foreground font-alegreya">
							Your Dashboard
						</div>
						<motion.div
							initial={{ scale: 1 }}
							whileInView={{ scale: 0 }}
							transition={{ delay: 1.8, type: "spring", stiffness: 300 }}
							viewport={{ once: true }}
							className="w-6 h-5 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold"
						>
							1
						</motion.div>
					</div>
					<div className="bg-accent/10 rounded-lg p-4 border border-border">
						<div className="flex items-start gap-4">
							<div className="w-17 h-16 bg-muted rounded shrink-0 overflow-hidden">
								<div className="w-full h-full bg-gradient-to-br from-accent/10 to-primary/20" />
							</div>
							<div className="flex-2 min-w-0">
								<div className="flex items-center gap-3 mb-1">
									<span className="text-base font-medium text-foreground font-alegreya">
										John Smith
									</span>
									<motion.span
										initial={{ scale: 1 }}
										whileInView={{ scale: 0 }}
										transition={{ delay: 1.9, type: "spring" }}
										viewport={{ once: true }}
										className="px-3 py-0.5 bg-primary/20 text-primary text-base rounded-full font-medium"
									>
										New
									</motion.span>
								</div>
								<p className="text-base text-muted-foreground line-clamp-3 font-alegreya">
									Make this bigger - Homepage
								</p>
								<div className="flex items-center gap-1.5 mt-1">
									<span className="relative flex h-2 w-2">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
										<span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
									</span>
									<p className="text-base text-muted-foreground/69 font-alegreya">
										Just now
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
