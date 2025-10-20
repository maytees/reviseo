"use client";
import { motion } from "motion/react";
import {
	MacAppMock,
	MacAppMockContent,
	MacAppMockHeader,
	MacAppMockTitle,
} from "../ui/mac-app-mock";
import { StickyScroll } from "../ui/sticky-scroll-reveal";
import { ConfusingEmails } from "./ConfusingEmails";

const content = [
	{
		title: '"Can you make it pop more?" — What does that even mean?',
		description:
			"You're left guessing what the client wants. Colors? Fonts? Layout? You're shooting in the dark.",
		content: (
			<MacAppMock className="">
				<MacAppMockHeader>
					<MacAppMockTitle>Mail</MacAppMockTitle>
				</MacAppMockHeader>
				<MacAppMockContent>
					<ConfusingEmails />
				</MacAppMockContent>
			</MacAppMock>
		),
	},
];

const Problems = () => {
	return (
		<section className="mt-48 w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
			<div className="flex flex-col items-center justify-center gap-4 max-w-3xl">
				<motion.h2
					initial={{ opacity: 0, scale: 1.1, y: 100 }}
					whileInView={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
					viewport={{ once: true }}
					className="text-3xl sm:text-4xl md:text-5xl text-center font-bold font-caudex"
				>
					Freelance web developers waste hours decoding vague client feedback
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
					You&apos;re spending more time on client communication than actual
					development work.
				</motion.p>
			</div>
			<div className="w-full h-full pb-52 mt-20 min-w-screen">
				<StickyScroll content={content} />
			</div>
		</section>
	);
};

export default Problems;
