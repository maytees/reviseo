"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const footerLinks = {
	product: [
		{ name: "Features", href: "#features" },
		{ name: "Pricing", href: "#pricing" },
		{ name: "FAQ", href: "#faq" },
		{ name: "Integrations", href: "/integrations" },
		{ name: "Changelog", href: "/changelog" },
	],
	resources: [
		{ name: "Documentation", href: "/docs" },
		{ name: "Guides", href: "/guides" },
		{ name: "Blog", href: "/blog" },
	],
	company: [
		{ name: "About", href: "/about" },
		{ name: "Contact", href: "/contact" },
	],
	legal: [
		{ name: "Privacy Policy", href: "/privacy" },
		{ name: "Terms of Service", href: "/terms" },
		{ name: "Cookie Policy", href: "/cookies" },
	],
};

const socialLinks = [
	{ name: "Twitter", icon: FaTwitter, href: "https://twitter.com/reviseo" },
	{
		name: "Instagram",
		icon: FaInstagram,
		href: "https://instagram.com/reviseo",
	},
	{
		name: "LinkedIn",
		icon: FaLinkedin,
		href: "https://linkedin.com/company/reviseo",
	},
	{ name: "Email", icon: Mail, href: "mailto:hello@reviseo.dev" },
];

export function Footer() {
	return (
		<footer className="relative mt-48 w-full border-t border-border bg-gradient-to-b from-background to-muted/20">
			{/* Background Gradient */}
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				whileInView={{ opacity: 0.1, scale: 1 }}
				transition={{ duration: 1.2, ease: "easeOut" }}
				viewport={{ once: true }}
				className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none blur-3xl -z-10"
				style={{
					background:
						"radial-gradient(circle, var(--primary), var(--accent), transparent 70%)",
				}}
			/>

			<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-12 sm:py-16">
				{/* Main Footer Content */}
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
					{/* Brand Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						className="col-span-2"
					>
						<Link href="/" className="flex items-center gap-1 mb-4">
							<Image
								src="/logo.svg"
								width={32}
								height={32}
								alt="Reviseo Logo"
							/>
							<h1 className="text-4xl font-bold font-caudex">Reviseo</h1>
						</Link>
						<p className="text-sm text-muted-foreground font-alegreya max-w-xs leading-relaxed">
							Visual feedback for web freelancers. Simplify client website
							revisions with easy annotated screenshots.
						</p>
						<div className="flex items-center gap-4 mt-6">
							{socialLinks.map((social, index) => {
								const Icon = social.icon;
								return (
									<motion.a
										key={social.name}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
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
										className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
										aria-label={social.name}
									>
										<Icon className="w-5 h-5" />
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
						<h3 className="text-sm font-semibold text-foreground mb-4 font-caudex">
							Product
						</h3>
						<ul className="space-y-3">
							{footerLinks.product.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors font-alegreya"
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
						<h3 className="text-sm font-semibold text-foreground mb-4 font-caudex">
							Resources
						</h3>
						<ul className="space-y-3">
							{footerLinks.resources.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors font-alegreya"
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
						<h3 className="text-sm font-semibold text-foreground mb-4 font-caudex">
							Company
						</h3>
						<ul className="space-y-3">
							{footerLinks.company.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors font-alegreya"
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
						<h3 className="text-sm font-semibold text-foreground mb-4 font-caudex">
							Legal
						</h3>
						<ul className="space-y-3">
							{footerLinks.legal.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors font-alegreya"
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
					className="pt-8 border-t border-border/50"
				>
					<div className="flex flex-col sm:flex-row justify-center items-center gap-4">
						<p className="text-sm text-muted-foreground font-alegreya">
							© {new Date().getFullYear()} Reviseo. All rights reserved.
						</p>
					</div>
				</motion.div>
			</div>
		</footer>
	);
}
