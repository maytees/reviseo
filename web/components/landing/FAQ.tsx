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
			"No. The widget is lightweight and loads asynchronously, so it won't affect your site's performance or speed.",
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
		// biome-ignore lint/correctness/useUniqueElementIds: <explanation>
		<section
			id="faq"
			className="mt-48 w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8"
		>
			<div className="flex flex-col items-center justify-center gap-4 max-w-3xl">
				<motion.div
					initial={{ scale: 0 }}
					whileInView={{ scale: 1 }}
					transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
					viewport={{ once: true }}
					className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
				>
					<HelpCircle className="h-4 w-4" />
					FAQ
				</motion.div>
				<motion.h2
					initial={{ opacity: 0, scale: 1.1, y: 100 }}
					whileInView={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
					viewport={{ once: true }}
					className="text-3xl sm:text-4xl md:text-5xl text-center font-bold font-caudex"
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
					className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-center font-inter"
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

					<div className="relative rounded-xl border border-border bg-gradient-to-br from-card to-card/50 p-6 sm:p-8 backdrop-blur-sm">
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
										<AccordionTrigger className="text-left hover:no-underline py-5">
											<span className="text-base sm:text-lg font-semibold font-caudex text-foreground pr-4">
												{faq.question}
											</span>
										</AccordionTrigger>
										<AccordionContent className="text-sm sm:text-base text-muted-foreground font-inter leading-relaxed pb-5">
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
						className="text-primary hover:underline font-medium"
					>
						Get in touch →
					</a>
				</p>
			</motion.div>
		</section>
	);
}
