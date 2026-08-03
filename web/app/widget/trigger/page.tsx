"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
	hasStorageAccess,
	requestStorageAccess,
	storageAccessPermissionGranted,
} from "../lib/storage-access";

type SessionData = Awaited<ReturnType<typeof authClient.getSession>>["data"];

const TriggerButton = () => {
	const { data: hookSession, isPending } = authClient.useSession();

	// Session fetched manually after silent cookie recovery — the hook's
	// initial fetch may have run before cookies were available.
	const [grantedSession, setGrantedSession] = useState<SessionData>(null);
	const session = hookSession ?? grantedSession;

	const [healthy, setHealthy] = useState(false);
	const [projectId, setProjectId] = useState<string | null>(null);
	const [allowed, setAllowed] = useState(false);
	const triggerId = useId();

	const handleWidgetOpen = () => {
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

	// Silent cross-site cookie recovery. The widget must stay COMPLETELY
	// invisible to regular visitors, so nothing here may prompt or render —
	// we only reconnect when the browser lets us do it without a gesture:
	//
	// 1. Cookies already reachable → refetch session (covers a session that
	//    appeared after the hook's initial fetch failed).
	// 2. Cookies blocked, but the storage-access permission was granted on
	//    an earlier visit → requestStorageAccess() resolves gesture-free,
	//    then refetch the session.
	// 3. Anything else → no session → the trigger never renders.
	useEffect(() => {
		if (isPending || session) return;

		let cancelled = false;
		void (async () => {
			if (await hasStorageAccess()) {
				if (cancelled) return;
				const { data } = await authClient.getSession();
				if (!cancelled && data) setGrantedSession(data);
				return;
			}

			// Blocked third-party cookies: only proceed when the permission
			// is already granted — never trigger a prompt from page load.
			if (!(await storageAccessPermissionGranted())) return;
			if (cancelled) return;

			if (await requestStorageAccess()) {
				if (cancelled) return;
				const { data } = await authClient.getSession();
				if (!cancelled && data) setGrantedSession(data);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [isPending, session]);

	// When projectId + session are present → validate with backend
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
					body: JSON.stringify({ projectId }),
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

	// Invisible unless: parent healthy AND signed in AND member/client of
	// this website. Regular visitors never see anything.
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
						title="Leave feedback"
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
