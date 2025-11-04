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
		<section className="flex flex-col items-center justify-center w-full px-4 mt-48 sm:px-6 md:px-8">
			{/* Section Header */}
			<div className="flex flex-col items-center justify-center max-w-3xl gap-4">
				<motion.h2
					initial={{ opacity: 0, scale: 1.1, y: 100 }}
					whileInView={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
					viewport={{ once: true }}
					className="text-4xl font-bold text-center sm:text-5xl md:text-6xl font-caudex"
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
					className="text-xl text-center sm:text-2xl md:text-3xl text-muted-foreground font-inter"
				>
					From setup to feedback in 3 simple steps
				</motion.p>
				<motion.div
					initial={{ scaleX: 0 }}
					whileInView={{ scaleX: 1 }}
					transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
					viewport={{ once: true }}
					className="w-16 h-1 mt-2 rounded-full bg-primary"
				/>
			</div>

			{/* Steps */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.1 }}
				className="w-full max-w-6xl mx-auto mt-16 space-y-24 lg:space-y-32 sm:mt-20"
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
								className="flex items-center justify-center w-12 h-12 text-xl font-bold rounded-full bg-primary text-primary-foreground shrink-0"
							>
								1
							</motion.div>
							<h3 className="text-3xl font-bold sm:text-4xl font-caudex">
								Install the widget
							</h3>
						</div>
						<p className="text-lg leading-relaxed sm:text-xl text-muted-foreground font-inter">
							Copy one line of code and paste it into your client's website.
							Works with any platform in under 60 seconds.
						</p>
						<p className="text-base text-muted-foreground/80 font-inter">
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
								className="flex items-center justify-center w-12 h-12 text-xl font-bold rounded-full bg-primary text-primary-foreground shrink-0"
							>
								2
							</motion.div>
							<h3 className="text-3xl font-bold sm:text-4xl font-caudex">
								Invite your client
							</h3>
						</div>
						<p className="text-lg leading-relaxed sm:text-xl text-muted-foreground font-inter">
							Create a client profile and send them a secure invite link. They
							sign up once and can access all their assigned websites.
						</p>
						<p className="text-base text-muted-foreground/80 font-inter">
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
								className="flex items-center justify-center w-12 h-12 text-xl font-bold rounded-full bg-primary text-primary-foreground shrink-0"
							>
								3
							</motion.div>
							<h3 className="text-3xl font-bold sm:text-4xl font-caudex">
								Get clear feedback
							</h3>
						</div>
						<p className="text-lg leading-relaxed sm:text-xl text-muted-foreground font-inter">
							Your client clicks the feedback button, draws what they want
							changed, and submits. You see it instantly in your dashboard with
							full context.
						</p>
						<p className="text-base text-muted-foreground/80 font-inter">
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

			<div className="overflow-hidden border rounded-lg shadow-2xl  bg-background border-slate-800">
				{/* Editor Header */}
				<div className="flex items-center justify-between px-4 py-2 border-b border-border">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-red-500 rounded-full" />
						<div className="w-3 h-3 bg-yellow-500 rounded-full" />
						<div className="w-3 h-3 bg-green-500 rounded-full" />
						<span className="ml-4 font-mono text-base text-slate-400">
							index.html
						</span>
					</div>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex items-center gap-1 text-sm transition-colors text-slate-400 hover:text-slate-200"
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
				<MacAppMockContent className="space-y-4 bg-background">
					{/* Email Header */}
					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<span className="text-base font-medium text-muted-foreground font-inter">
								To:
							</span>
							<span className="text-base text-foreground font-inter">
								john@clientco.com
							</span>
						</div>
						<div className="flex items-center gap-3">
							<span className="text-base font-medium text-muted-foreground font-inter">
								Subject:
							</span>
							<span className="text-base text-foreground font-inter">
								Website Feedback Access
							</span>
						</div>
					</div>

					<div className="h-px bg-border" />

					{/* Email Body */}
					<div className="space-y-4">
						<p className="text-foreground font-inter">Hi John,</p>
						<p className="leading-relaxed text-muted-foreground font-inter">
							You can now give feedback on your website using Reviseo. Click
							below to get started:
						</p>
						<Button className="w-full sm:w-auto" size="sm">
							Get Started <ArrowRight className="w-4 h-4 ml-2" />
						</Button>
						<div className="flex items-center justify-between gap-3 p-3 border rounded-md bg-muted border-border">
							<code className="font-mono text-sm break-all text-muted-foreground">
								https://reviseo.com/invite/abc123xyz
							</code>
							<motion.div
								initial={{ scale: 0 }}
								whileInView={{ scale: 1 }}
								transition={{ delay: 0.8, type: "spring" }}
								viewport={{ once: true }}
								className="flex items-center gap-1 text-sm text-green-600 shrink-0 font-inter"
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
				<div className="col-span-2 p-4 overflow-hidden border rounded-lg shadow-xl bg-card border-border">
					<div className="mb-3 text-sm font-medium text-muted-foreground font-inter">
						Client's View
					</div>
					<div className="relative overflow-hidden rounded aspect-video">
						{/* Annotation overlay */}
						<Image
							src="/howitworks.svg"
							width="400"
							height="225"
							alt="Annotation Example"
							className="object-cover w-full h-full"
						/>
					</div>
					<p className="mt-3 text-sm text-muted-foreground/80 font-inter">
						Clients annotate screenshots directly in an Excalidraw canvas,
						adding a title, detailed description, and categorizing feedback as
						bugs or features.
					</p>
				</div>

				{/* Dashboard Notification */}
				<div className="col-span-2 p-4 overflow-hidden border rounded-lg shadow-xl bg-card border-border">
					<div className="flex items-center justify-between mb-4">
						<div className="text-sm font-medium text-muted-foreground font-inter">
							Your Dashboard
						</div>
						<motion.div
							initial={{ scale: 1 }}
							whileInView={{ scale: 0 }}
							transition={{ delay: 1.8, type: "spring", stiffness: 300 }}
							viewport={{ once: true }}
							className="flex items-center justify-center w-6 h-5 text-sm font-bold rounded-full bg-primary text-primary-foreground"
						>
							1
						</motion.div>
					</div>
					<div className="p-4 border rounded-lg bg-accent/10 border-border">
						<div className="flex items-start gap-4">
							<div className="h-16 overflow-hidden rounded w-17 bg-muted shrink-0">
								<div className="w-full h-full bg-gradient-to-br from-accent/10 to-primary/20" />
							</div>
							<div className="min-w-0 flex-2">
								<div className="flex items-center gap-3 mb-1">
									<span className="text-base font-medium text-foreground font-inter">
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
								<p className="text-base text-muted-foreground line-clamp-3 font-inter">
									Make this bigger - Homepage
								</p>
								<div className="flex items-center gap-1.5 mt-1">
									<span className="relative flex w-2 h-2">
										<span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
										<span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full"></span>
									</span>
									<p className="text-base text-muted-foreground/69 font-inter">
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
