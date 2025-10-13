"use client"

import { Card } from "@/components/ui/card";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { motion } from "framer-motion";
import { ArrowRight, Check, Download, Inbox, Pencil, Shield, Users, Zap } from "lucide-react";
import { SiAngular, SiExcalidraw, SiFramer, SiHtml5, SiJavascript, SiNextdotjs, SiReact, SiShopify, SiSquarespace, SiVuedotjs, SiWebflow, SiWix, SiWordpress } from "react-icons/si";

export function ExcalidrawBentoCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="h-full "
        >
            <Card className="group h-full relative border-border bg-gradient-to-br from-card to-card/50 p-4 transition-all duration-300 hover:shadow-lg sm:p-6 md:p-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative flex h-full flex-col">
                    {/* Header */}
                    <div className="mb-4 sm:mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            viewport={{ once: true }}
                            className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary sm:mb-4 sm:px-3 sm:py-1.5 sm:text-sm"
                        >
                            <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                            Powered by Excalidraw
                        </motion.div>

                        <h3 className="mb-1.5 text-balance text-xl font-bold text-foreground sm:mb-2 sm:text-2xl md:text-3xl font-caudex">Annotate with Ease</h3>
                        <p className="text-pretty text-sm text-muted-foreground sm:text-base md:text-lg font-alegreya">
                            Draw, sketch, and highlight directly on feedback using the proven Excalidraw technology trusted by
                            millions
                        </p>
                    </div>

                    {/* Visual Demo Area */}
                    <div className="relative mb-4 flex-1 sm:mb-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            viewport={{ once: true }}
                            className="relative flex h-full min-h-[200px] items-center justify-center rounded-lg border border-border bg-muted/30 p-3 sm:min-h-[260px] sm:p-4"
                        >
                            <motion.div
                                initial={{ y: 0 }}
                                whileInView={{ y: -10 }}
                                transition={{
                                    delay: 0.6,
                                    duration: 0.8,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{
                                    y: -15,
                                    transition: { duration: 0.3 }
                                }}
                                viewport={{ once: true }}
                            >
                                <SiExcalidraw className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] text-[#6965db]" />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Features List */}
                    <div className="mb-4 grid gap-2 sm:mb-6 sm:grid-cols-2 sm:gap-3">
                        {["Easy to use", "Handrawn aesthetic", "Canvas export", "Beautiful by default"].map(
                            (feature, index) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 sm:h-5 sm:w-5">
                                        <Check className="h-2.5 w-2.5 text-primary sm:h-3 sm:w-3" />
                                    </div>
                                    <span className="text-sm text-foreground sm:text-base font-alegreya">{feature}</span>
                                </motion.div>
                            ),
                        )}
                    </div>

                    {/* CTA */}
                    <motion.button
                        whileHover={{ x: 4 }}
                        className="group/btn inline-flex items-center gap-2 text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:text-sm"
                    >
                        Try it now
                        <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1 sm:h-4 sm:w-4" />
                    </motion.button>
                </div>
            </Card>
        </motion.div >
    )
}

export function QuickInstallCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="h-full"
        >
            <Card className="group h-full border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-6">
                <div className="flex h-full flex-col gap-2 justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary sm:px-3 sm:py-1.5">
                            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                            Simple integration
                        </div>
                        <h4 className="text-lg font-semibold font-caudex">Get started instantly</h4>
                        <p className="mt-1 text-base text-muted-foreground font-alegreya">
                            Add a simple script tag or use our React, Vue, or Angular components.
                        </p>
                    </div>
                    <div className="mt-3 space-y-2">
                        <div className="rounded-md border border-border bg-muted/30 p-2.5 text-xs sm:text-sm font-mono">
                            <div className="text-muted-foreground">&lt;script src=&quot;reviseo.js&quot;&gt;&lt;/script&gt;</div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                <span>Vanilla</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <span>React</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>Vue</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                                <span>And more...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
export function OrbitingCirclesCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="h-full"
        >
            <Card className="relative h-full overflow-hidden border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-6">
                {/* Background Gradient */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 0.15, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="absolute top-30 -left-20 w-[500px] h-[500px] pointer-events-none blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, var(--primary), var(--accent), transparent 70%)'
                    }}
                />

                <div className="flex h-full flex-col relative z-10">
                    <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-primary">
                        <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                        Universal compatibility
                    </div>
                    <h4 className="text-lg font-semibold font-caudex">Works everywhere</h4>
                    <p className="mt-1 text-base text-muted-foreground font-alegreya">
                        Integrate with any platform or framework
                    </p>

                    <div className="relative flex-1 flex items-center justify-center mt-4">
                        <OrbitingCircles iconSize={32} radius={120} speed={1.5}>
                            <SiVuedotjs className="w-8 h-8 text-[#4FC08D]" />
                            <SiNextdotjs className="w-8 h-8 text-foreground" />
                            <SiReact className="w-8 h-8 text-[#61DAFB]" />
                            <SiJavascript className="w-8 h-8 text-[#F7DF1E]" />
                            <SiWebflow className="w-8 h-8 text-[#4353FF]" />
                        </OrbitingCircles>
                        <OrbitingCircles iconSize={28} radius={80} reverse speed={2}>
                            <SiFramer className="w-7 h-7 text-[#0055FF]" />
                            <SiShopify className="w-7 h-7 text-[#96BF48]" />
                            <SiWordpress className="w-7 h-7 text-[#21759B]" />
                            <SiWix className="w-7 h-7 text-[#0C6EFC]" />
                        </OrbitingCircles>
                        <OrbitingCircles iconSize={24} radius={50} speed={2.5}>
                            <SiSquarespace className="w-6 h-6 text-foreground" />
                            <SiHtml5 className="w-6 h-6 text-[#E34F26]" />
                            <SiAngular className="w-6 h-6 text-[#DD0031]" />
                        </OrbitingCircles>

                        {/* Center logo */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center shadow-lg">
                                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.08551 7.64096L20.9305 23.1111L29.5204 15.2222C32.0314 12.9162 32.3898 10.5998 31.6756 8.49414C29.0409 0.726192 18.5867 0 10.3841 0H7.06182C4.63169 0 2.66167 1.97001 2.66167 4.40015C2.66167 5.63211 3.17814 6.80765 4.08551 7.64096Z" fill="url(#paint0_linear_13_92)" />
                                    <path d="M23.7138 25.5349L9.40358 12.4444L2.10638 19.1197C-0.0245027 21.0689 -0.330499 23.0269 0.27368 24.8071C2.51034 31.3974 11.3891 32 18.3485 32L21.2028 32C23.2574 32 24.923 30.3344 24.923 28.2798C24.923 27.2357 24.4842 26.2396 23.7138 25.5349Z" fill="url(#paint1_linear_13_92)" />
                                    <defs>
                                        <linearGradient id="paint0_linear_13_92" x1="30.8513" y1="2.66667" x2="18.9454" y2="24.0117" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#FF0026" />
                                            <stop offset="1" stopColor="#8333A3" />
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_13_92" x1="12.4615" y1="12.4444" x2="12.4615" y2="32" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#3C1016" />
                                            <stop offset="1" stopColor="#8333A3" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

export function CollaborationCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="h-full"
        >
            <Card className="group h-full border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-6 relative overflow-hidden">
                {/* Background Gradient */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 0.15, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="absolute -top-0 left-20 w-[500px] h-[500px] pointer-events-none blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, var(--primary), transparent 70%)'
                    }}
                />

                <div className="flex h-full flex-col gap-2 justify-between relative z-10">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary sm:px-3 sm:py-1.5">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                            Invite only access
                        </div>
                        <h4 className="text-lg font-semibold font-caudex">Easy For Clients</h4>
                        <p className="mt-1 text-base text-muted-foreground font-alegreya">
                            Send email invites to clients. Only invited clients can see the feedback widget—simple and secure.
                        </p>
                    </div>
                    <div className="mt-3 flex justify-end">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            viewport={{ once: true }}
                        >
                            <Inbox className="size-24 text-primary" />
                        </motion.div>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

export function SpeedCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="h-full"
        >
            <Card className="h-full overflow-hidden border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-6">
                <div className="flex h-full flex-col justify-between">
                    <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-primary">
                        <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                        Performance
                    </div>
                    <div>
                        <div className="text-3xl font-bold font-caudex">~12ms</div>
                        <div className="text-xs text-muted-foreground">Average latency</div>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

export function SecurityCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="h-full"
        >
            <Card className="h-full overflow-hidden border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-6">
                <div className="flex h-full flex-col">
                    <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-primary">
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                        Security
                    </div>
                    <ul className="mt-1 grid gap-2 text-sm">
                        {[
                            "Data encrypted at rest",
                            "Signed URLs for attachments",
                            "SSO and 2FA ready",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-2">
                                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10">
                                    <Check className="h-2.5 w-2.5 text-primary" />
                                </div>
                                <span className="text-muted-foreground font-alegreya">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>
        </motion.div>
    )
}
