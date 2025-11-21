"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";

const footerLinks = {
	product: [
		{ name: "Features", href: "/#features" },
		{ name: "Pricing", href: "/#pricing" },
		{ name: "FAQ", href: "/#faq" },
		{ name: "Changelog", href: "/changelog" },
	],
	resources: [
		// { name: "Documentation", href: "/docs" },
		{ name: "Guides", href: "/blog" },
		{ name: "Blog", href: "/blog" },
	],
	company: [
		{ name: "About", href: "/about" },
		{ name: "Contact", href: "/#contact" },
	],
	legal: [
		{ name: "Privacy Policy", href: "/privacy" },
		{ name: "Terms of Service", href: "/terms" },
	],
};

const socialLinks = [
	{
		name: "LinkedIn",
		icon: FaLinkedin,
		href: "https://linkedin.com/company/reviseoapp",
	},
	{ name: "Email", icon: Mail, href: "/#contact" },
];

export function Footer() {
	return (
		<footer className="relative z-40 mt-48 w-full overflow-x-hidden border-border border-t bg-gradient-to-b from-background to-muted/20">
			{/* Background Gradient */}
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				whileInView={{ opacity: 0.1, scale: 1 }}
				transition={{ duration: 1.2, ease: "easeOut" }}
				viewport={{ once: true }}
				className="-translate-x-1/2 -z-10 pointer-events-none absolute top-0 left-1/2 h-[400px] w-[800px] blur-3xl"
				style={{
					background:
						"radial-gradient(circle, var(--primary), var(--accent), transparent 70%)",
				}}
			/>

			<div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-8">
				{/* Main Footer Content */}
				<div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6 lg:gap-12">
					{/* Brand Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						className="col-span-2"
					>
						<Link href="/" className="mb-4 flex items-center gap-1">
							<Image
								src="/logo.svg"
								width={32}
								height={32}
								alt="Reviseo Logo"
							/>
							<h1 className="font-bold font-caudex text-4xl">Reviseo</h1>
						</Link>
						<p className="max-w-xs font-inter text-muted-foreground text-sm leading-relaxed">
							Visual feedback for web freelancers. Simplify client website
							revisions with easy annotated screenshots.
						</p>
						<div className="mt-6 flex items-center gap-4">
							{socialLinks.map((social, index) => {
								const Icon = social.icon;
								const isEmail = social.name === "Email";
								return (
									<motion.a
										key={social.name}
										href={social.href}
										target={isEmail ? undefined : "_blank"}
										rel={isEmail ? undefined : "noopener noreferrer"}
										initial={{ opacity: 0, scale: 0 }}
										whileInView={{ opacity: 1, scale: 1 }}
										transition={{
											duration: 0.3,
											delay: 0.1 + index * 0.05,
											type: "spring",
											stiffness: 200,
										}}
										viewport={{ once: true }}
										whileHover={{ scale: 1.1 }}
										className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
										aria-label={social.name}
									>
										<Icon className="h-5 w-5" />
									</motion.a>
								);
							})}
						</div>
					</motion.div>

					{/* Product Links */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						viewport={{ once: true }}
					>
						<h3 className="mb-4 font-caudex font-semibold text-foreground text-sm">
							Product
						</h3>
						<ul className="space-y-3">
							{footerLinks.product.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="font-inter text-muted-foreground text-sm transition-colors hover:text-foreground"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</motion.div>

					{/* Resources Links */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						viewport={{ once: true }}
					>
						<h3 className="mb-4 font-caudex font-semibold text-foreground text-sm">
							Resources
						</h3>
						<ul className="space-y-3">
							{footerLinks.resources.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="font-inter text-muted-foreground text-sm transition-colors hover:text-foreground"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</motion.div>

					{/* Company Links */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						viewport={{ once: true }}
					>
						<h3 className="mb-4 font-caudex font-semibold text-foreground text-sm">
							Company
						</h3>
						<ul className="space-y-3">
							{footerLinks.company.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="font-inter text-muted-foreground text-sm transition-colors hover:text-foreground"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</motion.div>

					{/* Legal Links */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						viewport={{ once: true }}
					>
						<h3 className="mb-4 font-caudex font-semibold text-foreground text-sm">
							Legal
						</h3>
						<ul className="space-y-3">
							{footerLinks.legal.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="font-inter text-muted-foreground text-sm transition-colors hover:text-foreground"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</motion.div>
				</div>

				{/* Bottom Bar */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.5 }}
					viewport={{ once: true }}
					className="border-border/50 border-t pt-8"
				>
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<p className="font-inter text-muted-foreground text-sm">
							© {new Date().getFullYear()} Reviseo. All rights reserved.
						</p>
					</div>
				</motion.div>
			</div>
		</footer>
	);
}
