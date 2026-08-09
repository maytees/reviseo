"use client";
import {
	CameraIcon,
	EyeIcon,
	ImageIcon,
	PaletteIcon,
	TextCursorInputIcon,
	XIcon,
} from "lucide-react";
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

/** Speed-dial actions shown above the main button when expanded. */
const DIAL_ACTIONS = [
	{
		key: "annotate",
		label: "Annotate screenshot",
		icon: CameraIcon,
		message: "OPEN_FORM",
	},
	{
		key: "text",
		label: "Suggest text edits",
		icon: TextCursorInputIcon,
		message: "TEXT_MODE_START",
	},
	{
		key: "style",
		label: "Suggest style changes",
		icon: PaletteIcon,
		message: "STYLE_MODE_START",
	},
	{
		key: "image",
		label: "Replace images",
		icon: ImageIcon,
		message: "IMAGE_MODE_START",
	},
	{
		key: "preview",
		label: "Preview changes",
		icon: EyeIcon,
		message: "PREVIEW_MODE_START",
	},
] as const;

/** Red pending-edits counter, pinned to a corner of its parent. */
const EditCountBadge = ({ count }: { count: number }) => (
	<motion.span
		initial={{ scale: 0 }}
		animate={{ scale: 1 }}
		transition={{ type: "spring", stiffness: 500, damping: 22 }}
		className="-top-1 -right-1 absolute z-10 flex size-5 items-center justify-center rounded-full bg-red-500 font-semibold text-[10px] text-white shadow-md"
	>
		{count > 9 ? "9+" : count}
	</motion.span>
);

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
	// Speed-dial open state. The parent iframe is resized around the
	// expand/collapse lifecycle (EXPAND_TRIGGER before showing the dial,
	// COLLAPSE_TRIGGER after the exit animation completes).
	const [expanded, setExpanded] = useState(false);
	// Unsubmitted edits (loader-reported). Closed menu → total on the main
	// button; open menu → per-mode badges on their circles.
	const [editCount, setEditCount] = useState(0);
	const [modeCounts, setModeCounts] = useState<{
		text: number;
		style: number;
		image: number;
	}>({ text: 0, style: 0, image: 0 });
	// Per-tool permissions from /api/widget/allowed. Client-team members may
	// have some tools disabled by their lead; everyone else gets all four.
	const [capabilities, setCapabilities] = useState<Record<string, boolean>>({
		annotate: true,
		text: true,
		style: true,
		image: true,
		preview: true,
	});
	const triggerId = useId();

	const expand = () => {
		window.parent.postMessage({ type: "EXPAND_TRIGGER" }, "*");
		setExpanded(true);
	};

	const collapse = () => setExpanded(false);

	const handleDialAction = (action: (typeof DIAL_ACTIONS)[number]) => {
		// The loader takes over the screen either way — snap the iframe back
		// immediately rather than waiting for the exit animation.
		setExpanded(false);
		window.parent.postMessage({ type: "COLLAPSE_TRIGGER" }, "*");
		window.parent.postMessage({ type: action.message }, "*");
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
			// Loader forwards page-level Esc — the iframe can't hear keys
			// pressed while the customer page has focus.
			if (event.data?.type === "COLLAPSE_DIAL") {
				setExpanded(false);
				return;
			}

			if (event.data?.type === "EDIT_COUNT") {
				setEditCount(
					typeof event.data.count === "number" ? event.data.count : 0,
				);
				setModeCounts({
					text: typeof event.data.text === "number" ? event.data.text : 0,
					style: typeof event.data.style === "number" ? event.data.style : 0,
					image: typeof event.data.image === "number" ? event.data.image : 0,
				});
				return;
			}

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

				// Install heartbeat — lets runtime-injected installs
				// (next/script, tag managers) pass verification even though
				// their snippet never appears in the server-rendered HTML.
				void fetch("/api/widget/ping", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ projectId: event.data.projectId }),
				}).catch(() => {});

				parent.postMessage({ type: "READY" }, origin);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => {
			clearInterval(retryInterval);
			window.removeEventListener("message", handleMessage);
		};
	}, []);

	// Esc collapses the dial (only relevant while the iframe has focus).
	useEffect(() => {
		if (!expanded) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setExpanded(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [expanded]);

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
					if (data.capabilities && typeof data.capabilities === "object") {
						setCapabilities({
							annotate: data.capabilities.annotate !== false,
							text: data.capabilities.text !== false,
							style: data.capabilities.style !== false,
							image: data.capabilities.image !== false,
							preview: data.capabilities.preview !== false,
						});
					}
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
		// biome-ignore lint/a11y/noStaticElementInteractions: transparent backdrop click-away for the dial
		// biome-ignore lint/a11y/useKeyWithClickEvents: Esc handled by a window-level listener
		<div
			className="fixed inset-0 overflow-hidden"
			onClick={(e) => {
				// Click on the transparent area (not a button) closes the dial.
				if (expanded && e.target === e.currentTarget) collapse();
			}}
		>
			{/* Speed-dial actions, stacked above the main button */}
			<AnimatePresence
				onExitComplete={() => {
					window.parent.postMessage({ type: "COLLAPSE_TRIGGER" }, "*");
				}}
			>
				{expanded && (
					<div className="absolute right-2 bottom-[76px] flex flex-col items-end gap-3">
						{[...DIAL_ACTIONS]
							.filter((action) => capabilities[action.key] !== false)
							.reverse()
							.map((action, i) => (
								<motion.div
									key={action.key}
									className="flex items-center gap-2.5"
									initial={{ opacity: 0, y: 18, scale: 0.5 }}
									animate={{
										opacity: 1,
										y: 0,
										scale: 1,
										transition: {
											type: "spring",
											stiffness: 420,
											damping: 24,
											delay: i * 0.05,
										},
									}}
									exit={{
										opacity: 0,
										y: 12,
										scale: 0.6,
										transition: { duration: 0.12, delay: i * 0.03 },
									}}
								>
									<span className="rounded-full bg-foreground/90 px-3 py-1.5 font-medium text-background text-xs shadow-lg">
										{action.label}
									</span>
									<div className="relative">
										<Button
											size="icon"
											variant="secondary"
											className="size-12 rounded-full border-2 border-border shadow-lg"
											title={action.label}
											onClick={() => handleDialAction(action)}
										>
											<action.icon className="size-5" />
										</Button>
										{action.key === "text" && modeCounts.text > 0 && (
											<EditCountBadge count={modeCounts.text} />
										)}
										{action.key === "style" && modeCounts.style > 0 && (
											<EditCountBadge count={modeCounts.style} />
										)}
										{action.key === "image" && modeCounts.image > 0 && (
											<EditCountBadge count={modeCounts.image} />
										)}
									</div>
								</motion.div>
							))}
					</div>
				)}
			</AnimatePresence>

			{/* Main trigger button */}
			<motion.div
				className="absolute right-1 bottom-1"
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				whileTap={{ scale: 1.05 }}
				key="reviseo-trigger"
			>
				{/* Pending edits reminder — moves to the text-edits circle
				    while the menu is open */}
				{!expanded && signedIn && editCount > 0 && (
					<EditCountBadge count={editCount} />
				)}
				<Button
					disabled={isPending}
					id={triggerId}
					className="size-14 rounded-full border-2 border-border"
					variant="secondary"
					title={
						signedIn
							? expanded
								? "Close"
								: "Leave feedback"
							: awaitingLogin
								? "Signed in? Click again to connect"
								: "Connect to Reviseo to leave feedback"
					}
					onClick={signedIn ? (expanded ? collapse : expand) : handleConnect}
				>
					<AnimatePresence mode="wait" initial={false}>
						{expanded ? (
							<motion.span
								key="close"
								initial={{ rotate: -90, opacity: 0 }}
								animate={{ rotate: 0, opacity: 1 }}
								exit={{ rotate: 90, opacity: 0 }}
								transition={{ duration: 0.15 }}
								className="flex"
							>
								<XIcon className="size-6" />
							</motion.span>
						) : (
							<motion.span
								key="logo"
								initial={{ rotate: 90, opacity: 0 }}
								animate={{ rotate: 0, opacity: 1 }}
								exit={{ rotate: -90, opacity: 0 }}
								transition={{ duration: 0.15 }}
								className={cn("flex", !signedIn && "opacity-80 saturate-50")}
							>
								<Image
									loading="eager"
									preload
									src="/logo.svg"
									width={35}
									height={35}
									alt="Reviseo Logo"
								/>
							</motion.span>
						)}
					</AnimatePresence>
				</Button>
			</motion.div>
		</div>
	);
};

export default TriggerButton;
