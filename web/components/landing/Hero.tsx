"use client";
import { ChevronRight, PartyPopper } from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import HeroBadge from "../ui/hero-badge";
import { TextAnimate } from "../ui/TextAnimate";

const Hero = () => {
	return (
		<section className="mt-32 w-full flex items-center justify-center px-4 sm:px-6 md:px-8">
			<div className="flex flex-col h-full items-center justify-center gap-10 sm:gap-8 w-full">
				<div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full">
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 100 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ type: "spring", duration: 1.2, bounce: 0.15 }}
					>
						<HeroBadge
							href="/blog/announcing-reviseo"
							text="Now In Public Beta"
							endIcon={<ChevronRight className="size-4" />}
							icon={<PartyPopper className="size-4" />}
						/>
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, scale: 1.1, y: 100 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
						className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center max-w-3xl font-bold font-caudex px-2"
					>
						Stop tracking client feedback with{" "}
						<span className="font-caudex bg-gradient-to-r from-accent to-primary font-bold bg-clip-text italic text-transparent">
							endless
						</span>{" "}
						emails
					</motion.h1>
					<TextAnimate
						animation="blurIn"
						duration={2}
						delay={0.4}
						once
						segmentClassName="text-base sm:text-lg md:text-xl text-muted-foreground font-inter"
						by="word"
						className="text-base sm:text-lg md:text-xl text-muted-foreground text-center w-full max-w-2xl font-inter px-2"
					>
						Reviseo lets your clients annotate screenshots and requset changes
						directly on your website. No more back and forth confusion between
						you and your clients - see exactly what they want, and where they
						want it.
					</TextAnimate>
				</div>
				<div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto px-2">
					<motion.div
						initial={{ opacity: 0, scale: 1.1, y: 100 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{
							type: "spring",
							duration: 1.2,
							bounce: 0.1,
							delay: 1.2,
						}}
						className="w-full sm:w-auto"
					>
						<Button size={"lg"} className="w-full sm:w-auto">
							Get Started
						</Button>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, scale: 1.1, y: 100 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{
							type: "spring",
							duration: 1.2,
							bounce: 0.1,
							delay: 1.4,
						}}
						className="w-full sm:w-auto"
					>
						<Button size={"lg"} variant={"inset"} className="w-full sm:w-auto">
							Watch Demo
						</Button>
					</motion.div>
				</div>
				<motion.div
					initial={{ opacity: 0, scale: 1.1, y: 100 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					transition={{
						type: "spring",
						duration: 1.2,
						bounce: 0.1,
						delay: 1.5,
					}}
					className="flex items-center gap-2 mt-20"
				>
					<div className="flex -space-x-2">
						<Avatar className="border-2 border-background w-8 h-8 sm:w-10 sm:h-10">
							<AvatarImage
								src="https://avatars.githubusercontent.com/u/88842870?v=4"
								alt="Freelancer 1"
							/>
							<AvatarFallback>F1</AvatarFallback>
						</Avatar>
						<Avatar className="border-2 border-background w-8 h-8 sm:w-10 sm:h-10">
							<AvatarImage
								src="https://avatars.githubusercontent.com/u/178248637?s=130&v=4"
								alt="Freelancer 2"
							/>
							<AvatarFallback>F2</AvatarFallback>
						</Avatar>
						<Avatar className="border-2 border-background w-8 h-8 sm:w-10 sm:h-10">
							<AvatarImage
								src="https://avatars.githubusercontent.com/u/178248937?s=130&v=4"
								alt="Freelancer 2"
							/>
							<AvatarFallback>F2</AvatarFallback>
						</Avatar>
						<Avatar className="border-2 border-background w-8 h-8 sm:w-10 sm:h-10">
							<AvatarImage
								src="https://avatars.githubusercontent.com/u/178248737?s=130&v=4"
								alt="Freelancer 2"
							/>
							<AvatarFallback>F2</AvatarFallback>
						</Avatar>
						<Avatar className="border-2 border-background w-8 h-8 sm:w-10 sm:h-10">
							<AvatarImage
								src="https://avatars.githubusercontent.com/u/88744505?v=4"
								alt="Freelancer 3"
							/>
							<AvatarFallback>F3</AvatarFallback>
						</Avatar>
					</div>
					<span className="font-semibold text-muted-foreground font-inter">
						For freelancers by freelancers
					</span>
				</motion.div>
			</div>
		</section>
	);
};

export default Hero;
