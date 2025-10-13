"use client"
import { motion } from "motion/react";
import { SiAngular, SiFramer, SiGatsby, SiHtml5, SiJavascript, SiNextdotjs, SiNuxtdotjs, SiReact, SiShopify, SiSquarespace, SiSvelte, SiVuedotjs, SiWebflow, SiWix, SiWordpress } from "react-icons/si";
import { Marquee, MarqueeContent, MarqueeFade } from "../ui/shadcn-io/marquee";

const UsedWith = () => {
    return (
        <section className="mt-42 w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 gap-8">
            <div className="flex flex-col items-center justify-center gap-1 sm:gap-4 w-full">
                <motion.h2
                    initial={{ opacity: 0, scale: 1.1, y: 100 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", duration: 1.2, bounce: 0.1 }}
                    className="text-2xl sm:text-3xl md:text-4xl text-center font-bold font-caudex"
                    viewport={{ once: true }}
                >
                    Works with your favorite platforms
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, scale: 1.1, y: 100 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", duration: 1.2, bounce: 0.1, delay: 0.2 }}
                    className="text-base sm:text-lg md:text-xl text-muted-foreground text-center font-alegreya px-2"
                >
                    Embeddable on any platform with a simple script tag
                </motion.p>
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 100 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", duration: 1.2, bounce: 0.1, delay: 0.5 }}
                className="flex size-full items-center justify-center   rounded-lg p-4 w-full"
                viewport={{ once: true }}
            >
                <Marquee>
                    <MarqueeFade side="left" />
                    <MarqueeFade side="right" />
                    <MarqueeContent>
                        {[
                            { name: "Vue", Icon: SiVuedotjs },
                            { name: "Next.js", Icon: SiNextdotjs },
                            { name: "React", Icon: SiReact },
                            { name: "JavaScript", Icon: SiJavascript },
                            { name: "Webflow", Icon: SiWebflow },
                            { name: "Framer", Icon: SiFramer },
                            { name: "Shopify", Icon: SiShopify },
                            { name: "WordPress", Icon: SiWordpress },
                            { name: "Wix", Icon: SiWix },
                            { name: "Squarespace", Icon: SiSquarespace },
                            { name: "HTML", Icon: SiHtml5 },
                            { name: "Angular", Icon: SiAngular },
                            { name: "Svelte", Icon: SiSvelte },
                            { name: "Gatsby", Icon: SiGatsby },
                            { name: "Nuxt", Icon: SiNuxtdotjs }
                        ].map(({ name, Icon }, index) => (
                            <div className="flex flex-col items-center justify-center h-32 w-32 px-4 gap-2" key={index}>
                                <Icon className="w-10 h-10" />
                                <span className="text-lg font-alegreya font-semibold">{name}</span>
                            </div>
                        ))}
                    </MarqueeContent>
                </Marquee>
            </motion.div>
        </section>
    )
}

export default UsedWith