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

	// Session fetched manually after cookie recovery — the hook's initial
	// fetch may have run before cookies were available.
	const [grantedSession, setGrantedSession] = useState<SessionData>(null);
	const session = hookSession ?? grantedSession;

	const [healthy, setHealthy] = useState(false);
	const [projectId, setProjectId] = useState<string | null>(null);
	const [allowed, setAllowed] = useState(false);
	// Loader-provided: this browser followed a client invite/dashboard link
	// at some point, so it very likely belongs to a Reviseo client. Only
	// hinted browsers may ever see the connect button.
	const [clientHint, setClientHint] = useState(false);
	// Silent recovery finished without a session (cookies blocked or truly
	// signed out).
	const [needsAuth, setNeedsAuth] = useState(false);
	const [awaitingLogin, setAwaitingLogin] = useState(false);
	const triggerId = useId();

	const handleWidgetOpen = () => {
		window.parent.postMessage({ type: "OPEN_FORM" }, "*");
	};

	/**
	 * Connect flow for hinted browsers, run from the button click (the user
	 * gesture Storage Access needs):
	 * 1. request storage access (one-time browser prompt at most)
	 * 2. refetch the session now that cookies flow
	 * 3. still signed out → open first-party /login in a new tab; the next
	 *    click repeats and picks the fresh session up.
	 */
	const handleConnect = async () => {
		const granted = await requestStorageAccess();

		if (granted) {
			const { data } = await authClient.getSession();
			if (data) {
				setGrantedSession(data);
				setNeedsAuth(false);
				setAwaitingLogin(false);
				return;
			}
		}

		// No grant or no account session yet — sign in first-party. That
		// visit also creates the interaction browsers require before they'll
		// grant storage access.
		window.open("/login", "_blank", "noopener");
		setAwaitingLogin(true);
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
				setClientHint(event.data.clientHint === true);
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

	// Silent cross-site cookie recovery. Nothing here may prompt or render:
	//
	// 1. Cookies already reachable → refetch session.
	// 2. Cookies blocked, but the storage-access permission was granted on
	//    an earlier visit (queryable without a gesture) →
	//    requestStorageAccess() resolves gesture-free → refetch session.
	// 3. Anything else → needsAuth; UI appears only for hinted browsers.
	useEffect(() => {
		if (isPending || session) {
			setNeedsAuth(false);
			return;
		}

		let cancelled = false;
		void (async () => {
			if (await hasStorageAccess()) {
				if (cancelled) return;
				const { data } = await authClient.getSession();
				if (cancelled) return;
				if (data) {
					setGrantedSession(data);
					return;
				}
				setNeedsAuth(true);
				return;
			}

			if (await storageAccessPermissionGranted()) {
				if (cancelled) return;
				if (await requestStorageAccess()) {
					if (cancelled) return;
					const { data } = await authClient.getSession();
					if (cancelled) return;
					if (data) {
						setGrantedSession(data);
						return;
					}
				}
			}

			if (!cancelled) setNeedsAuth(true);
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

	if (!healthy) return null;

	const signedIn = Boolean(session?.user);

	// Signed in but not a member/client of this website → hidden.
	if (signedIn && !allowed) return null;
	// Signed out: only browsers carrying the client hint (set by following
	// an invite/dashboard link) get the connect button. Everyone else —
	// i.e. the public — sees nothing, ever.
	if (!signedIn && !(clientHint && needsAuth)) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				whileTap={{ rotate: -25, scale: 1.05 }}
				key="reviseo-trigger"
			>
				<Button
					disabled={isPending}
					id={triggerId}
					className={cn(
						"size-14 rounded-full border-2 border-border",
						!signedIn && "opacity-80 saturate-50",
					)}
					variant="secondary"
					title={
						signedIn
							? "Leave feedback"
							: awaitingLogin
								? "Signed in? Click again to connect"
								: "Connect to Reviseo to leave feedback"
					}
					onClick={signedIn ? handleWidgetOpen : handleConnect}
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
		</AnimatePresence>
	);
};

export default TriggerButton;
