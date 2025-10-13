"use client"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { Angry, MailIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const emails = [
    {
        id: 1,
        from: "Client",
        subject: "Quick question about the design",
        preview: "Can you make it more... you know... pop? But also keep it minimal.",
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
        preview: "My wife says it needs to be more professional but also fun and quirky.",
        time: "30s ago",
    },
    {
        id: 4,
        from: "Client",
        subject: "URGENT: Changes needed",
        preview: "Can we make the logo bigger? And smaller? At the same time?",
        time: "Just now",
    },
]

export function ConfusingEmails() {
    const [visibleEmails, setVisibleEmails] = useState<number[]>([])
    const [isComplete, setIsComplete] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, amount: 0.3 })

    useEffect(() => {
        if (!isInView) return

        const timers = emails.map((email, index) => {
            return setTimeout(() => {
                setVisibleEmails((prev) => [...prev, email.id])
                if (index === emails.length - 1) {
                    setTimeout(() => setIsComplete(true), 100)
                }
            }, index * 700)
        })

        return () => timers.forEach(clearTimeout)
    }, [isInView])

    return (
        <div ref={containerRef} className="h-full flex flex-col z-50 text-xs sm:text-sm">
            {/* Email toolbar */}
            <div className="border-b border-border px-2 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2">
                <MailIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-sm font-medium ml-1">Inbox</span>
                <span className="text-[9px] sm:text-xs text-muted-foreground ml-auto">{visibleEmails.length} messages</span>
            </div>

            {/* Email list */}
            <div className="flex-1 relative overflow-hidden ">
                <AnimatePresence>
                    {emails.map((email, index) => {
                        const isVisible = visibleEmails.includes(email.id)
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
                                className="border-b border-border px-2 sm:px-4 py-1.5 sm:py-3 hover:bg-accent/50 cursor-pointer transition-colors"
                                style={{
                                    position: "relative",
                                    zIndex: emails.length - index,
                                }}
                            >
                                <div className="flex items-start justify-between gap-2 sm:gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1 sm:gap-2 mb-0.5">
                                            <span className="font-semibold text-[10px] sm:text-sm truncate">{email.from}</span>
                                            <span className="text-[9px] sm:text-xs text-muted-foreground flex-shrink-0">{email.time}</span>
                                        </div>
                                        <div className="text-[10px] sm:text-sm font-medium mb-0.5 truncate">{email.subject}</div>
                                        <div className="text-[10px] sm:text-sm text-muted-foreground truncate">{email.preview}</div>
                                    </div>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={isVisible ? { scale: 1 } : { scale: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 flex-shrink-0 mt-0.5 sm:mt-1"
                                    />
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>

                {/* Confusion overlay */}
                <AnimatePresence>
                    {isComplete && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute inset-0  pointer-events-none flex items-center justify-center"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: 0 }}
                                animate={{
                                    scale: 1,
                                    rotate: 360
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
                                    }
                                }}
                                className="bg-yellow-400 size-12 sm:size-20 flex justify-center items-center mb-8 sm:mb-20 z-20 text-black px-3 py-1.5 sm:px-6 sm:py-3 rounded-full font-bold shadow-lg"
                            >
                                <Angry className="size-12 sm:size-20" />
                                {/* 😵 */}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
