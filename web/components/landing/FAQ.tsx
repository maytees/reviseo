"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
	{
		question: "Do my clients need to create an account?",
		answer:
			"Yes, clients need to log in once with an invite link you send them. This keeps the widget private and ensures only they see it, not every visitor to your site.",
	},
	{
		question: "Will the widget slow down my website?",
		answer:
			"No. The widget is lightweight, so it won't affect your site's performance or speed.",
	},
	{
		question: "Do random website visitors see the widget?",
		answer:
			"No. Only logged-in clients you've invited can see the widget. Random visitors won't see anything.",
	},
	{
		question: "What platforms does Reviseo work with?",
		answer:
			"Any platform that allows custom JavaScript: React, Vue, Next.js, WordPress, Shopify, Webflow, Framer, plain HTML, you get the point.",
	},
	{
		question: "Can I cancel anytime?",
		answer: "Yes! Cancel anytime from your dashboard, no questions asked.",
	},
];

export function FAQ() {
	return (
		// biome-ignore lint/correctness/useUniqueElementIds: faqq
		<section
			id="faq"
			className="flex flex-col items-center justify-center w-full px-4 mt-48 sm:px-6 md:px-8"
		>
			<div className="flex flex-col items-center justify-center max-w-3xl gap-4">
				<motion.div
					initial={{ scale: 0 }}
					whileInView={{ scale: 1 }}
					transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
					viewport={{ once: true }}
					className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
				>
					<HelpCircle className="w-4 h-4" />
					FAQ
				</motion.div>
				<motion.h2
					initial={{ opacity: 0, scale: 1.1, y: 100 }}
					whileInView={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
					viewport={{ once: true }}
					className="text-3xl font-bold text-center sm:text-4xl md:text-5xl font-caudex"
				>
					Frequently asked questions
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
					className="text-lg text-center sm:text-xl md:text-2xl text-muted-foreground font-inter"
				>
					Everything you need to know about Reviseo
				</motion.p>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
				viewport={{ once: true, amount: 0.2 }}
				className="w-full max-w-3xl mt-16 sm:mt-20"
			>
				<div className="relative">
					{/* Background Gradient */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						whileInView={{ opacity: 0.1, scale: 1 }}
						transition={{ duration: 1.2, ease: "easeOut" }}
						viewport={{ once: true }}
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none blur-3xl -z-10"
						style={{
							background:
								"radial-gradient(circle, var(--primary), var(--accent), transparent 70%)",
						}}
					/>

					<div className="relative p-6 border rounded-xl border-border bg-gradient-to-br from-card to-card/50 sm:p-8 backdrop-blur-sm">
						<Accordion type="single" collapsible className="w-full space-y-4">
							{faqs.map((faq, index) => (
								<motion.div
									key={faq.question}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{
										duration: 0.5,
										delay: index * 0.1,
										ease: [0.22, 1, 0.36, 1],
									}}
									viewport={{ once: true }}
								>
									<AccordionItem
										value={`item-${index}`}
										className="border-border/50 rounded-lg px-4 data-[state=open]:bg-muted/30 transition-colors"
									>
										<AccordionTrigger className="py-5 text-left hover:no-underline">
											<span className="pr-4 text-base font-semibold sm:text-lg font-caudex text-foreground">
												{faq.question}
											</span>
										</AccordionTrigger>
										<AccordionContent className="pb-5 text-sm leading-relaxed sm:text-base text-muted-foreground font-inter">
											{faq.answer}
										</AccordionContent>
									</AccordionItem>
								</motion.div>
							))}
						</Accordion>
					</div>
				</div>
			</motion.div>

			{/* Still have questions? */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
				viewport={{ once: true }}
				className="mt-12 text-center"
			>
				<p className="text-base sm:text-lg text-muted-foreground font-inter">
					Still have questions?{" "}
					<a
						href="/contact"
						className="font-medium text-primary hover:underline"
					>
						Get in touch →
					</a>
				</p>
			</motion.div>
		</section>
	);
}
