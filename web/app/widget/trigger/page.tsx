"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { type MouseEventHandler, useEffect, useId } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const TriggerButton = () => {
	const {
		data: session,
		isPending, //loading state
		error,
	} = authClient.useSession();

	const triggerId = useId();

	useEffect(() => {
		console.log(session, "session");
		console.log(session?.user, "session.user");
		console.log(isPending, "is pending");
		console.log(error, "error");
	}, [isPending, error, session]);

	const handleWidgetOpen: MouseEventHandler<HTMLButtonElement> = (e) => {
		console.log(session, "session");
		console.log(session?.user, "session.user");
		console.log(isPending, "is pending");
		console.log(error, "error");
		window.parent.postMessage({ type: "OPEN_FORM" }, "*");
	};

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
							priority
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
