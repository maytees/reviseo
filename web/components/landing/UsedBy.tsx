"use client";
import { motion } from "motion/react";
import {
	SiAngular,
	SiFramer,
	SiGatsby,
	SiHtml5,
	SiJavascript,
	SiNextdotjs,
	SiNuxt,
	SiReact,
	SiShopify,
	SiSquarespace,
	SiSvelte,
	SiVuedotjs,
	SiWebflow,
	SiWix,
	SiWordpress,
} from "react-icons/si";
import { Marquee, MarqueeContent, MarqueeFade } from "../ui/shadcn-io/marquee";

const UsedWith = () => {
	return (
		<section className="mt-42 flex w-full flex-col items-center justify-center gap-8 px-4 sm:px-6 md:px-8">
			<div className="flex w-full flex-col items-center justify-center gap-1 sm:gap-4">
				<motion.h2
					initial={{ opacity: 0, scale: 1.1, y: 100 }}
					whileInView={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
					className="text-center font-bold font-caudex text-2xl sm:text-3xl md:text-4xl"
					viewport={{ once: true }}
				>
					Works with your favorite platforms
				</motion.h2>
				<motion.p
					initial={{ opacity: 0, scale: 1.1, y: 100 }}
					whileInView={{ opacity: 1, scale: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{
						type: "spring",
						duration: 1.2,
						bounce: 0.1,
						delay: 0.2,
					}}
					className="px-2 text-center font-inter text-base text-muted-foreground sm:text-lg md:text-xl"
				>
					Embeddable on any platform with a simple script tag
				</motion.p>
			</div>
			<motion.div
				initial={{ opacity: 0, scale: 0.5, y: 100 }}
				whileInView={{ opacity: 1, scale: 1, y: 0 }}
				transition={{ type: "spring", duration: 1.2, bounce: 0.1, delay: 0.5 }}
				className="flex size-full w-full items-center justify-center rounded-lg p-4"
				viewport={{ once: true }}
			>
				<Marquee>
					<MarqueeFade side="left" />
					<MarqueeFade side="right" />
					<MarqueeContent>
						{[
							{ name: "Vue", Icon: SiVuedotjs, color: "text-[#4FC08D]" },
							{ name: "Next.js", Icon: SiNextdotjs, color: "text-foreground" },
							{ name: "React", Icon: SiReact, color: "text-[#61DAFB]" },
							{
								name: "JavaScript",
								Icon: SiJavascript,
								color: "text-[#F7DF1E]",
							},
							{ name: "Webflow", Icon: SiWebflow, color: "text-[#4353FF]" },
							{ name: "Framer", Icon: SiFramer, color: "text-[#0055FF]" },
							{ name: "Shopify", Icon: SiShopify, color: "text-[#96BF48]" },
							{ name: "WordPress", Icon: SiWordpress, color: "text-[#21759B]" },
							{ name: "Wix", Icon: SiWix, color: "text-[#0C6EFC]" },
							{
								name: "Squarespace",
								Icon: SiSquarespace,
								color: "text-foreground",
							},
							{ name: "HTML", Icon: SiHtml5, color: "text-[#E34F26]" },
							{ name: "Angular", Icon: SiAngular, color: "text-[#DD0031]" },
							{ name: "Svelte", Icon: SiSvelte, color: "text-[#FF3E00]" },
							{ name: "Gatsby", Icon: SiGatsby, color: "text-[#663399]" },
							{ name: "Nuxt", Icon: SiNuxt, color: "text-[#00DC82]" },
						].map(({ name, Icon, color }) => (
							<div
								className="flex h-32 w-32 flex-col items-center justify-center gap-2 px-4"
								key={name}
							>
								<Icon className={`h-10 w-10 ${color}`} />
								<span className="font-inter font-semibold text-lg">{name}</span>
							</div>
						))}
					</MarqueeContent>
				</Marquee>
			</motion.div>
		</section>
	);
};

export default UsedWith;
