"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { type MouseEventHandler, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const TriggerButton = () => {
	const { data: session, isPending } = authClient.useSession();

	const [healthy, setHealthy] = useState(false);
	const [projectId, setProjectId] = useState<string | null>(null);
	const [allowed, setAllowed] = useState(false); // <--- NEW
	const triggerId = useId();

	const handleWidgetOpen: MouseEventHandler<HTMLButtonElement> = () => {
		window.parent.postMessage({ type: "OPEN_FORM" }, "*");
	};

	// Handshake with the parent loader. Retries HEALTH_CHECK until the
	// parent acknowledges — a single message can race the parent's listener
	// attachment and silently kill the widget.
	useEffect(() => {
		const parent = window.parent;
		const origin = "*";
		let acknowledged = false;
		let attempts = 0;

		const sendHealthCheck = () => {
			if (acknowledged || attempts >= 30) return;
			attempts++;
			parent.postMessage({ type: "HEALTH_CHECK" }, origin);
		};

		sendHealthCheck();
		const retryInterval = window.setInterval(sendHealthCheck, 1000);

		const handleMessage = (event: MessageEvent) => {
			if (event.data?.type === "HEALTH_OK") {
				if (!event.data.projectId) {
					setHealthy(false);
					return;
				}

				acknowledged = true;
				clearInterval(retryInterval);

				setProjectId(event.data.projectId);
				setHealthy(true); // healthy means parent is valid

				parent.postMessage({ type: "READY" }, origin);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => {
			clearInterval(retryInterval);
			window.removeEventListener("message", handleMessage);
		};
	}, []);

	// When projectId is received → validate with backend
	useEffect(() => {
		if (!projectId || !session?.user?.id) {
			setAllowed(false);
			return;
		}

		const checkPermission = async () => {
			try {
				const res = await fetch("/api/widget/allowed", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						projectId,
						userId: session.user.id,
					}),
				});

				const data = await res.json();

				if (data.allowed === true) {
					setAllowed(true);
				} else {
					setAllowed(false);
					setHealthy(false); // hide widget if not allowed
				}
			} catch (err) {
				console.error("Permission check failed:", err);
				setAllowed(false);
				setHealthy(false);
			}
		};

		checkPermission();
	}, [projectId, session?.user?.id]);

	// Widget hidden until parent health + server permission both OK
	if (!healthy || !allowed) return null;

	return (
		<AnimatePresence>
			{session?.user && (
				<motion.div
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					whileTap={{ rotate: -25, scale: 1.05 }}
					key="reviseo-trigger"
				>
					<Button
						disabled={isPending}
						id={triggerId}
						className={cn("size-14 rounded-full border-2 border-border")}
						variant="secondary"
						onClick={handleWidgetOpen}
					>
						<Image
							loading="eager"
							preload
							src="/logo.svg"
							width={35}
							height={35}
							alt="Reviseo Logo"
						/>
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default TriggerButton;
