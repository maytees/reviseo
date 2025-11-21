"use client";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Angry, MailIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const emails = [
	{
		id: 1,
		from: "Client",
		subject: "Quick question about the design",
		preview:
			"Can you make it more... you know... pop? But also keep it minimal.",
		time: "2m ago",
	},
	{
		id: 2,
		from: "Client",
		subject: "Re: Quick question about the design",
		preview: "Actually, can we use that blue? Not that blue. The other blue.",
		time: "1m ago",
	},
	{
		id: 3,
		from: "Client",
		subject: "One more thing",
		preview:
			"My wife says it needs to be more professional but also fun and quirky.",
		time: "30s ago",
	},
	{
		id: 4,
		from: "Client",
		subject: "URGENT: Changes needed",
		preview: "Can we make the logo bigger? And smaller? At the same time?",
		time: "Just now",
	},
];

export function ConfusingEmails() {
	const [visibleEmails, setVisibleEmails] = useState<number[]>([]);
	const [isComplete, setIsComplete] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(containerRef, { once: true, amount: 0.3 });

	useEffect(() => {
		if (!isInView) return;

		const timers = emails.map((email, index) => {
			return setTimeout(() => {
				setVisibleEmails((prev) => [...prev, email.id]);
				if (index === emails.length - 1) {
					setTimeout(() => setIsComplete(true), 100);
				}
			}, index * 700);
		});

		return () => timers.forEach(clearTimeout);
	}, [isInView]);

	return (
		<div
			ref={containerRef}
			className="z-50 flex h-full flex-col text-xs sm:text-sm"
		>
			{/* Email toolbar */}
			<div className="flex items-center gap-2 border-border border-b px-2 py-1.5 sm:px-4 sm:py-2">
				<MailIcon className="h-3 w-3 sm:h-4 sm:w-4" />
				<span className="ml-1 font-medium text-[10px] sm:text-sm">Inbox</span>
				<span className="ml-auto text-[9px] text-muted-foreground sm:text-xs">
					{visibleEmails.length} messages
				</span>
			</div>

			{/* Email list */}
			<div className="relative flex-1 overflow-hidden">
				<AnimatePresence>
					{emails.map((email, index) => {
						const isVisible = visibleEmails.includes(email.id);
						return (
							<motion.div
								key={email.id}
								initial={{ opacity: 0, y: -20, scale: 0.95 }}
								animate={
									isVisible
										? {
												opacity: 1,
												y: 0,
												scale: 1,
											}
										: { opacity: 0, y: -20, scale: 0.95 }
								}
								transition={{
									duration: 0.4,
									ease: "easeOut",
								}}
								className="cursor-pointer border-border border-b px-2 py-1.5 transition-colors hover:bg-accent/50 sm:px-4 sm:py-3"
								style={{
									position: "relative",
									zIndex: emails.length - index,
								}}
							>
								<div className="flex items-start justify-between gap-2 sm:gap-3">
									<div className="min-w-0 flex-1">
										<div className="mb-0.5 flex items-center gap-1 sm:gap-2">
											<span className="truncate font-semibold text-[10px] sm:text-sm">
												{email.from}
											</span>
											<span className="flex-shrink-0 text-[9px] text-muted-foreground sm:text-xs">
												{email.time}
											</span>
										</div>
										<div className="mb-0.5 truncate font-medium text-[10px] sm:text-sm">
											{email.subject}
										</div>
										<div className="truncate text-[10px] text-muted-foreground sm:text-sm">
											{email.preview}
										</div>
									</div>
									<motion.div
										initial={{ scale: 0 }}
										animate={isVisible ? { scale: 1 } : { scale: 0 }}
										transition={{ delay: 0.3 }}
										className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500 sm:mt-1 sm:h-2 sm:w-2"
									/>
								</div>
							</motion.div>
						);
					})}
				</AnimatePresence>

				{/* Confusion overlay */}
				<AnimatePresence>
					{isComplete && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="pointer-events-none absolute inset-0 flex items-center justify-center"
						>
							<motion.div
								initial={{ scale: 0, rotate: 0 }}
								animate={{
									scale: 1,
									rotate: 360,
								}}
								transition={{
									scale: {
										type: "spring",
										stiffness: 200,
										damping: 15,
										delay: 0.6,
									},
									rotate: {
										duration: 2,
										repeat: Infinity,
										ease: "linear",
										delay: 0.6,
										repeatType: "loop",
									},
								}}
								className="z-20 mb-8 flex size-12 items-center justify-center rounded-full bg-yellow-400 px-3 py-1.5 font-bold text-black shadow-lg sm:mb-20 sm:size-20 sm:px-6 sm:py-3"
							>
								<Angry className="size-12 sm:size-20" />
								{/* 😵 */}
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
