"use client";
import { ChevronRight, Rocket } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "../ui/button";
import HeroBadge from "../ui/hero-badge";
import { HyperText } from "../ui/hyper-text";
import { TextAnimate } from "../ui/TextAnimate";

const Hero = () => {
	return (
		<section className="mt-32 flex w-full items-center justify-center px-4 sm:px-6 md:px-8">
			<div className="flex h-full w-full flex-col items-center justify-center gap-10 sm:gap-8">
				<div className="flex w-full flex-col items-center justify-center gap-3 sm:gap-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 100 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ type: "spring", duration: 1.2, bounce: 0.15 }}
					>
						<HeroBadge
							// href="/blog/announcing-reviseo"
							href="/waitlist"
							// text="Now In Public Beta"
							text="Waitlist Available"
							endIcon={<ChevronRight className="size-4" />}
							icon={<Rocket className="size-4" />}
						/>
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, scale: 1.1, y: 100 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
						className="max-w-3xl px-2 text-center font-bold font-caudex text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
					>
						Stop tracking client feedback with{" "}
						<span className="bg-linear-to-r from-accent to-primary bg-clip-text font-bold font-caudex text-transparent italic">
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
						className="w-full max-w-2xl px-2 text-center font-inter text-base text-muted-foreground sm:text-lg md:text-xl"
					>
						Reviseo lets your clients annotate screenshots and request changes
						directly on your website. No more back and forth confusion between
						you and your clients - see exactly what they want, and where they
						want it.
					</TextAnimate>
				</div>
				<div className="flex w-full flex-col items-center gap-2 px-2 sm:w-auto sm:flex-row">
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
						{/* <Button size={"lg"} className="w-full sm:w-auto">
							Get Started
						</Button> */}
						<Button asChild size={"lg"} className="w-full sm:w-auto">
							<Link href={"/waitlist"}>Join Waitlist</Link>
						</Button>
					</motion.div>
					{/* <motion.div
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
					</motion.div> */}
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
					className="mt-20 flex items-center gap-2"
				>
					{/* <div className="flex -space-x-2">
						<Avatar className="w-8 h-8 border-2 border-background sm:w-10 sm:h-10">
							<AvatarImage
								src="https://avatars.githubusercontent.com/u/88842870?v=4"
								alt="Freelancer 1"
							/>
							<AvatarFallback>F1</AvatarFallback>
						</Avatar>
						<Avatar className="w-8 h-8 border-2 border-background sm:w-10 sm:h-10">
							<AvatarImage
								src="https://avatars.githubusercontent.com/u/178248637?s=130&v=4"
								alt="Freelancer 2"
							/>
							<AvatarFallback>F2</AvatarFallback>
						</Avatar>
						<Avatar className="w-8 h-8 border-2 border-background sm:w-10 sm:h-10">
							<AvatarImage
								src="https://avatars.githubusercontent.com/u/178248937?s=130&v=4"
								alt="Freelancer 2"
							/>
							<AvatarFallback>F2</AvatarFallback>
						</Avatar>
						<Avatar className="w-8 h-8 border-2 border-background sm:w-10 sm:h-10">
							<AvatarImage
								src="https://avatars.githubusercontent.com/u/178248737?s=130&v=4"
								alt="Freelancer 2"
							/>
							<AvatarFallback>F2</AvatarFallback>
						</Avatar>
						<Avatar className="w-8 h-8 border-2 border-background sm:w-10 sm:h-10">
							<AvatarImage
								src="https://avatars.githubusercontent.com/u/88744505?v=4"
								alt="Freelancer 3"
							/>
							<AvatarFallback>F3</AvatarFallback>
						</Avatar>
					</div> */}
					{/* <span className="font-semibold text-muted-foreground font-inter"></span> */}
					<HyperText
						duration={4000}
						delay={1}
						className="font-light text-muted-foreground text-sm hover:cursor-pointer"
					>
						For freelancers by freelancers
					</HyperText>
				</motion.div>
			</div>
		</section>
	);
};

export default Hero;
