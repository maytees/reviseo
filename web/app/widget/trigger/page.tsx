"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { type MouseEventHandler, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const TriggerButton = () => {
	const {
		data: session,
		isPending, //loading state
	} = authClient.useSession();

	const [healthy, setHealthy] = useState(false);
	const triggerId = useId();

	// useEffect(() => {
	// 	console.log(session, "session");
	// 	console.log(session?.user, "session.user");
	// 	console.log(isPending, "is pending");
	// 	console.log(error, "error");
	// }, [isPending, error, session]);

	const handleWidgetOpen: MouseEventHandler<HTMLButtonElement> = () => {
		// console.log(session, "session");
		// console.log(session?.user, "session.user");
		// console.log(isPending, "is pending");
		// console.log(error, "error");
		window.parent.postMessage({ type: "OPEN_FORM" }, "*");
	};

	useEffect(() => {
		const parent = window.parent;
		const origin = "*"; // or restrict later to your domain

		// Send initial health check
		parent.postMessage({ type: "HEALTH_CHECK" }, origin);

		// Listen for parent confirmation
		const handleMessage = (event: MessageEvent) => {
			if (event.data?.type === "HEALTH_OK") {
				setHealthy(true);
				// Let parent know widget is ready to show
				parent.postMessage({ type: "READY" }, origin);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, []);

	if (!healthy) return null; // hide everything until confirmed healthy

	return (
		<AnimatePresence>
			{session?.user && (
				<motion.div
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					whileTap={{ rotate: -25, scale: 1.05 }}
					key={"reviseo-trigger"}
				>
					<Button
						disabled={isPending}
						id={triggerId}
						className={cn("rounded-full border-2 border-border size-14")}
						variant={"secondary"}
						onClick={handleWidgetOpen}
					>
						{/* <Bug className={"text-foreground"} /> */}
						<Image
							loading="eager"
							preload
							src={"/logo.svg"}
							width={35}
							height={35}
							alt={"Reviseo Logo"}
						/>
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default TriggerButton;
