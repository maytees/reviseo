"use client";
import { motion } from "motion/react";
import type React from "react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
	content,
	contentClassName,
}: {
	content: {
		title: string;
		description: string;
		content?: React.ReactNode | any;
		reverse?: boolean;
	}[];
	contentClassName?: string;
}) => {
	return (
		<div className="flex flex-col items-center gap-12 rounded-md p-4 lg:gap-32 lg:p-0">
			{content.map((item, index) => (
				<motion.div
					key={item.title + index}
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.6,
						delay: index * 0.1,
						ease: "easeOut",
					}}
					viewport={{ once: true, amount: 0.3 }}
					className={cn(
						"flex w-full flex-col items-center justify-between lg:px-32",
						item.reverse
							? "lg:flex-row-reverse lg:space-x-10 lg:space-x-reverse"
							: "lg:flex-row lg:space-x-10",
					)}
				>
					<div className="flex w-full justify-center px-4 lg:w-1/2">
						<div className="flex w-full max-w-2xl flex-col items-center gap-3 lg:items-start">
							<h2 className="text-center font-bold font-caudex text-2xl lg:text-left lg:text-4xl">
								{item.title}
							</h2>
							<p className="max-w-sm text-center font-inter text-base text-muted-foreground lg:text-left lg:text-lg">
								{item.description}
							</p>
						</div>
					</div>
					<div className="mt-8 flex w-full items-center justify-center lg:mt-0 lg:w-1/2">
						<div
							className={cn(
								"h-[60vh] w-full overflow-hidden rounded-md",
								contentClassName,
							)}
						>
							{item.content ?? null}
						</div>
					</div>
				</motion.div>
			))}
		</div>
	);
};
