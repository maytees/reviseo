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
		<section className="mt-48 flex w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8">
			{/* Section Header */}
			<div className="flex max-w-3xl flex-col items-center justify-center gap-4">
				<motion.h2
					initial={{ opacity: 0, scale: 1.1, y: 100 }}
					whileInView={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
					viewport={{ once: true }}
					className="text-center font-bold font-caudex text-4xl sm:text-5xl md:text-6xl"
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
					className="text-center font-inter text-muted-foreground text-xl sm:text-2xl md:text-3xl"
				>
					From setup to feedback in 3 simple steps
				</motion.p>
				<motion.div
					initial={{ scaleX: 0 }}
					whileInView={{ scaleX: 1 }}
					transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
					viewport={{ once: true }}
					className="mt-2 h-1 w-16 rounded-full bg-primary"
				/>
			</div>

			{/* Steps */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.1 }}
				className="mx-auto mt-16 w-full max-w-6xl space-y-24 sm:mt-20 lg:space-y-32"
			>
				{/* Step 1 - Code Snippet */}
				<motion.div
					variants={stepVariants}
					className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
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
								className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xl"
							>
								1
							</motion.div>
							<h3 className="font-bold font-caudex text-3xl sm:text-4xl">
								Install the widget
							</h3>
						</div>
						<p className="font-inter text-lg text-muted-foreground leading-relaxed sm:text-xl">
							Copy one line of code and paste it into your client's website.
							Works with any platform in under 60 seconds.
						</p>
						<p className="font-inter text-base text-muted-foreground/80">
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
					className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
				>
					{/* Email Mockup Visual */}
					<EmailInviteVisual />

					<div className="order-1 space-y-2 lg:order-2">
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
								className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xl"
							>
								2
							</motion.div>
							<h3 className="font-bold font-caudex text-3xl sm:text-4xl">
								Invite your client
							</h3>
						</div>
						<p className="font-inter text-lg text-muted-foreground leading-relaxed sm:text-xl">
							Create a client profile and send them a secure invite link. They
							sign up once and can access all their assigned websites.
						</p>
						<p className="font-inter text-base text-muted-foreground/80">
							One click to copy the invite link. Send via email, Slack, or
							however you communicate.
						</p>
					</div>
				</motion.div>

				{/* Step 3 - Dashboard */}
				<motion.div
					variants={stepVariants}
					className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
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
								className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xl"
							>
								3
							</motion.div>
							<h3 className="font-bold font-caudex text-3xl sm:text-4xl">
								Get clear feedback
							</h3>
						</div>
						<p className="font-inter text-lg text-muted-foreground leading-relaxed sm:text-xl">
							Your client clicks the feedback button, draws what they want
							changed, and submits. You see it instantly in your dashboard with
							full context.
						</p>
						<p className="font-inter text-base text-muted-foreground/80">
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
				className="-translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] blur-3xl"
				style={{
					background:
						"radial-gradient(circle, var(--primary), var(--accent), transparent 70%)",
				}}
			/>

			<div className="overflow-hidden rounded-lg border border-slate-800 bg-background shadow-2xl">
				{/* Editor Header */}
				<div className="flex items-center justify-between border-border border-b px-4 py-2">
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-red-500" />
						<div className="h-3 w-3 rounded-full bg-yellow-500" />
						<div className="h-3 w-3 rounded-full bg-green-500" />
						<span className="ml-4 font-mono text-base text-slate-400">
							index.html
						</span>
					</div>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex items-center gap-1 text-slate-400 text-sm transition-colors hover:text-slate-200"
					>
						<Copy className="h-3 w-3" />
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
						<span className="text-green-400">"reviseo.js"</span>
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
				className="-translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] blur-3xl"
				style={{
					background:
						"radial-gradient(circle, var(--primary), var(--accent), transparent 70%)",
				}}
			/>

			<MacAppMock>
				<MacAppMockHeader>
					<MacAppMockTitle>New Message</MacAppMockTitle>
				</MacAppMockHeader>
				<MacAppMockContent className="space-y-4 bg-background">
					{/* Email Header */}
					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<span className="font-inter font-medium text-base text-muted-foreground">
								To:
							</span>
							<span className="font-inter text-base text-foreground">
								john@clientco.com
							</span>
						</div>
						<div className="flex items-center gap-3">
							<span className="font-inter font-medium text-base text-muted-foreground">
								Subject:
							</span>
							<span className="font-inter text-base text-foreground">
								Website Feedback Access
							</span>
						</div>
					</div>

					<div className="h-px bg-border" />

					{/* Email Body */}
					<div className="space-y-4">
						<p className="font-inter text-foreground">Hi John,</p>
						<p className="font-inter text-muted-foreground leading-relaxed">
							You can now give feedback on your website using Reviseo. Click
							below to get started:
						</p>
						<Button className="w-full sm:w-auto" size="sm">
							Get Started <ArrowRight className="ml-2 h-4 w-4" />
						</Button>
						<div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted p-3">
							<code className="break-all font-mono text-muted-foreground text-sm">
								https://reviseo.com/invite/abc123xyz
							</code>
							<motion.div
								initial={{ scale: 0 }}
								whileInView={{ scale: 1 }}
								transition={{ delay: 0.8, type: "spring" }}
								viewport={{ once: true }}
								className="flex shrink-0 items-center gap-1 font-inter text-green-600 text-sm"
							>
								<Check className="h-3 w-3" />
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
				className="-translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] blur-3xl"
				style={{
					background:
						"radial-gradient(circle, var(--primary), var(--accent), transparent 70%)",
				}}
			/>
			<div className="grid grid-cols-2 gap-4">
				{/* Client View */}
				<div className="col-span-2 overflow-hidden rounded-lg border border-border bg-card p-4 shadow-xl">
					<div className="mb-3 font-inter font-medium text-muted-foreground text-sm">
						Client's View
					</div>
					<div className="relative aspect-video overflow-hidden rounded">
						{/* Annotation overlay */}
						<Image
							src="/howitworks.svg"
							width="400"
							height="225"
							alt="Annotation Example"
							className="h-full w-full object-cover"
						/>
					</div>
					<p className="mt-3 font-inter text-muted-foreground/80 text-sm">
						Clients annotate screenshots directly in an Excalidraw canvas,
						adding a title, detailed description, and categorizing feedback as
						bugs or features.
					</p>
				</div>

				{/* Dashboard Notification */}
				<div className="col-span-2 overflow-hidden rounded-lg border border-border bg-card p-4 shadow-xl">
					<div className="mb-4 flex items-center justify-between">
						<div className="font-inter font-medium text-muted-foreground text-sm">
							Your Dashboard
						</div>
						<motion.div
							initial={{ scale: 1 }}
							whileInView={{ scale: 0 }}
							transition={{ delay: 1.8, type: "spring", stiffness: 300 }}
							viewport={{ once: true }}
							className="flex h-5 w-6 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-sm"
						>
							1
						</motion.div>
					</div>
					<div className="rounded-lg border border-border bg-accent/10 p-4">
						<div className="flex items-start gap-4">
							<div className="h-16 w-17 shrink-0 overflow-hidden rounded bg-muted">
								<div className="h-full w-full bg-gradient-to-br from-accent/10 to-primary/20" />
							</div>
							<div className="min-w-0 flex-2">
								<div className="mb-1 flex items-center gap-3">
									<span className="font-inter font-medium text-base text-foreground">
										John Smith
									</span>
									<motion.span
										initial={{ scale: 1 }}
										whileInView={{ scale: 0 }}
										transition={{ delay: 1.9, type: "spring" }}
										viewport={{ once: true }}
										className="rounded-full bg-primary/20 px-3 py-0.5 font-medium text-base text-primary"
									>
										New
									</motion.span>
								</div>
								<p className="line-clamp-3 font-inter text-base text-muted-foreground">
									Make this bigger - Homepage
								</p>
								<div className="mt-1 flex items-center gap-1.5">
									<span className="relative flex h-2 w-2">
										<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
										<span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
									</span>
									<p className="font-inter text-base text-muted-foreground/69">
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
