"use client";

import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Contact() {
	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const subject = formData.get("subject") as string;
		const message = formData.get("message") as string;

		// Construct mailto URL
		const mailtoBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${encodeURIComponent(message)}`;
		const mailtoLink = `mailto:inquire@reviseo.app?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;

		// Open mailto link
		window.location.href = mailtoLink;
	}

	return (
		// biome-ignore lint/correctness/useUniqueElementIds: goon
		<section
			id="contact"
			className="mt-48 flex w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8"
		>
			<div className="flex max-w-3xl flex-col items-center justify-center gap-4">
				<motion.div
					initial={{ scale: 0 }}
					whileInView={{ scale: 1 }}
					transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
					viewport={{ once: true }}
					className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary text-xs"
				>
					<Mail className="h-4 w-4" />
					Contact
				</motion.div>
				<motion.h2
					initial={{ opacity: 0, scale: 1.1, y: 100 }}
					whileInView={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
					viewport={{ once: true }}
					className="text-center font-bold font-caudex text-3xl sm:text-4xl md:text-5xl"
				>
					Get in touch
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
					className="text-center font-inter text-lg text-muted-foreground sm:text-xl md:text-2xl"
				>
					Have a question? We'd love to hear from you
				</motion.p>
			</div>
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
				viewport={{ once: true, amount: 0.2 }}
				className="mt-16 w-full max-w-3xl sm:mt-20"
			>
				<div className="relative">
					{/* Background Gradient */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						whileInView={{ opacity: 0.1, scale: 1 }}
						transition={{ duration: 1.2, ease: "easeOut" }}
						viewport={{ once: true }}
						className="-translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] blur-3xl"
						style={{
							background:
								"radial-gradient(circle, var(--primary), var(--accent), transparent 70%)",
						}}
					/>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="relative rounded-xl border border-border bg-linear-to-br from-card to-card/50 p-6 backdrop-blur-sm sm:p-8"
					>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid gap-6 sm:grid-cols-2">
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: 0.1 }}
									viewport={{ once: true }}
									className="space-y-2"
								>
									<label
										htmlFor="name"
										className="font-inter font-medium text-foreground text-sm"
									>
										Name
									</label>
									{/** biome-ignore lint/correctness/useUniqueElementIds: <goon> */}
									<Input
										id="name"
										name="name"
										type="text"
										placeholder="John Doe"
										required
										className="bg-background/50"
									/>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, x: 20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: 0.1 }}
									viewport={{ once: true }}
									className="space-y-2"
								>
									<label
										htmlFor="email"
										className="font-inter font-medium text-foreground text-sm"
									>
										Email
									</label>
									{/** biome-ignore lint/correctness/useUniqueElementIds: <goon> */}
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="john@example.com"
										required
										className="bg-background/50"
									/>
								</motion.div>
							</div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}
								viewport={{ once: true }}
								className="space-y-2"
							>
								<label
									htmlFor="subject"
									className="font-inter font-medium text-foreground text-sm"
								>
									Subject
								</label>
								{/** biome-ignore lint/correctness/useUniqueElementIds: <goon> */}
								<Input
									id="subject"
									name="subject"
									type="text"
									placeholder="How can we help?"
									required
									className="bg-background/50"
								/>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.3 }}
								viewport={{ once: true }}
								className="space-y-2"
							>
								<label
									htmlFor="message"
									className="font-inter font-medium text-foreground text-sm"
								>
									Message
								</label>
								{/** biome-ignore lint/correctness/useUniqueElementIds: goon */}
								<Textarea
									id="message"
									name="message"
									placeholder="Tell us more about your inquiry..."
									required
									className="min-h-[150px] resize-none bg-background/50"
								/>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.4 }}
								viewport={{ once: true }}
							>
								<Button type="submit" size="lg" className="w-full sm:w-auto">
									Send Message
									<Send className="ml-2 h-4 w-4" />
								</Button>
							</motion.div>
						</form>
					</motion.div>
				</div>
			</motion.div>
			<p className="mt-4 text-muted-foreground text-sm">
				Or send an email to <strong>help@reviseo.app</strong>
			</p>
		</section>
	);
}
