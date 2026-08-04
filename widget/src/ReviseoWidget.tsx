import { snapdom } from "@zumer/snapdom";
import { useEffect, useRef } from "preact/hooks";
import { useUserAgent } from "./hooks/useBrowserInfo";
import { TextEditEngine } from "./text-edit";

/** Remove all HTML comments (prevents invalid XML like "--") */
function removeAllComments(root) {
	const it = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
	const toRemove = [];
	while (it.nextNode()) toRemove.push(it.currentNode);
	for (const n of toRemove) n.remove();
}

/**
 * Sanitize attributes to produce valid XHTML inside foreignObject.
 * - Drop "@", unknown ":" prefixes
 * - Drop common framework directives (x-*, v-*, :*, on:*, bind:*, let:*, class:*)
 */
function sanitizeAttributesForXHTML(
	root,
	opts = {
		stripFrameworkDirectives: true,
	},
) {
	const { stripFrameworkDirectives } = opts;
	const ALLOWED_PREFIXES = new Set(["xml", "xlink"]);

	const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
	while (walker.nextNode()) {
		const el = walker.currentNode;
		if (!(el instanceof HTMLElement)) continue;

		// Copy first—NamedNodeMap is live
		for (const attr of Array.from(el.attributes)) {
			const name = attr.name;

			// "@": never valid in XML attribute names
			if (name.includes("@")) {
				el.removeAttribute(name);
				continue;
			}

			// ":" requires a declared namespace (xml:, xlink:)
			if (name.includes(":")) {
				const prefix = name.split(":", 1)[0];
				if (!ALLOWED_PREFIXES.has(prefix)) {
					el.removeAttribute(name);
					continue;
				}
			}

			if (!stripFrameworkDirectives) continue;

			// Common framework directives that break XHTML
			if (
				name.startsWith("x-") || // Alpine
				name.startsWith("v-") || // Vue
				name.startsWith(":") || // Vue/Alpine shorthand
				name.startsWith("on:") || // Svelte
				name.startsWith("bind:") || // Svelte
				name.startsWith("let:") || // Svelte
				name.startsWith("class:") // Svelte
			) {
				el.removeAttribute(name);
			}
		}
	}
}

/** SnapDOM plugin: sanitize attrs + remove comments on the clone */
function sanitizePlugin(options) {
	return {
		name: "sanitize-xml",
		async afterClone(ctx) {
			const root = ctx.clone;
			if (!root) return;
			sanitizeAttributesForXHTML(root, {
				stripFrameworkDirectives: true,
				...options,
			});
			removeAllComments(root);
		},
	};
}

function clipRegionPlugin(defaultRect = {}) {
	return {
		name: "clip-region",
		async beforeClone(ctx) {
			if (!isValidRect(ctx.__clipRegion) && isValidRect(defaultRect)) {
				ctx.__clipRegion = normalizeRect(defaultRect);
			}

			if (ctx.options && ctx.options.noShadows == null) {
				ctx.options.noShadows = true;
			}
		},

		async afterClone(context) {
			const region =
				context.__clipRegion && normalizeRect(context.__clipRegion);
			if (!isValidRect(region)) return;

			const root = context.clone;
			if (!root || !(root instanceof HTMLElement)) return;

			const doc = root.ownerDocument || document;

			// Viewport: caja final recortada
			const viewport = doc.createElement("div");
			viewport.style.position = "relative";
			viewport.style.overflow = "hidden";
			viewport.style.display = "block";
			viewport.style.width = `${Math.round(region.width)}px`;
			viewport.style.height = `${Math.round(region.height)}px`;

			// Desplazar el clon para alinear la región en (0,0)
			root.style.position = "absolute";
			root.style.left = `${-Math.round(region.x)}px`;
			root.style.top = `${-Math.round(region.y)}px`;
			// Asegurar que ocupe el contenido completo:
			root.style.right = "auto";
			root.style.bottom = "auto";

			// Reemplazar root por viewport
			viewport.appendChild(root);
			context.clone = viewport;
		},
	};
}

function isValidRect(r) {
	return (
		r &&
		Number.isFinite(r.x) &&
		Number.isFinite(r.y) &&
		r.width > 0 &&
		r.height > 0
	);
}

function normalizeRect(r) {
	return {
		x: Number(r.x) || 0,
		y: Number(r.y) || 0,
		width: Math.max(0, Number(r.width) || 0),
		height: Math.max(0, Number(r.height) || 0),
	};
}

function cropImageFromDataURL(dataURL, cropX, cropY, cropWidth, cropHeight) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			try {
				// Draw the full image
				const fullCanvas = document.createElement("canvas");
				fullCanvas.width = img.width;
				fullCanvas.height = img.height;
				const ctx = fullCanvas.getContext("2d");
				ctx.drawImage(img, 0, 0);

				// Crop to specified area
				const croppedCanvas = document.createElement("canvas");
				croppedCanvas.width = cropWidth;
				croppedCanvas.height = cropHeight;
				const croppedCtx = croppedCanvas.getContext("2d");

				croppedCtx.drawImage(
					fullCanvas,
					cropX,
					cropY,
					cropWidth,
					cropHeight, // source rect
					0,
					0,
					cropWidth,
					cropHeight, // destination rect
				);

				// Return cropped data URL
				const croppedDataURL = croppedCanvas.toDataURL("image/png");
				resolve(croppedDataURL);
			} catch (err) {
				reject(err);
			}
		};

		img.onerror = (err) => reject(err);
		img.src = dataURL;
	});
}

const WIDGET_ORIGIN =
	import.meta.env.VITE_WIDGET_ORIGIN || "http://localhost:3000";

const CLIENT_HINT_KEY = "__reviseo_client";
const CLIENT_HINT_FRAGMENT = "reviseo-connect";
// First-party flag: this browser already saw the text-edit onboarding card.
const TEXT_ONBOARDING_KEY = "__reviseo_text_onboarding";

// Trigger iframe sizes: collapsed = just the round button; expanded = room
// for the speed-dial circles and their tooltips.
const TRIGGER_COLLAPSED = { width: "64px", height: "64px" };
const TRIGGER_EXPANDED = { width: "240px", height: "240px" };

/**
 * Client hint: invite emails and the client dashboard link to the customer
 * site with a `#reviseo-connect` fragment. Seeing it once marks THIS
 * browser (in the customer site's own first-party localStorage — never
 * partitioned) as belonging to a Reviseo client. Only hinted browsers may
 * show the widget's connect button when cookies are blocked; the public
 * never has the hint and never sees any UI.
 */
function readClientHint(): boolean {
	try {
		if (window.location.hash.includes(CLIENT_HINT_FRAGMENT)) {
			localStorage.setItem(CLIENT_HINT_KEY, "1");
			// Strip our marker from the URL bar
			history.replaceState(
				null,
				"",
				window.location.pathname + window.location.search,
			);
			return true;
		}
		return localStorage.getItem(CLIENT_HINT_KEY) === "1";
	} catch {
		return false;
	}
}

export default function ReviseoWidget({ projectId }: { projectId: string }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerIframeRef = useRef<HTMLIFrameElement>(null);
	const healthTimeoutRef = useRef<number>();

	const browserInfo = useUserAgent();
	// Keep latest browserInfo readable from the (mount-once) message handler
	// without re-running the effect — re-running would append a second modal
	// iframe.
	const browserInfoRef = useRef(browserInfo);
	browserInfoRef.current = browserInfo;

	const textEngineRef = useRef<TextEditEngine | null>(null);

	useEffect(() => {
		// Health check timeout (generous: first load may compile/hydrate slowly)
		healthTimeoutRef.current = window.setTimeout(() => {
			console.warn(
				"Reviseo widget did not finish its health check yet. The trigger stays hidden until it does.",
			);
		}, 15000);

		// Preload modal iframe (hidden)
		const modalIframe = document.createElement("iframe");
		modalIframe.src = `${WIDGET_ORIGIN}/widget/modal`;
		modalIframe.style.cssText =
			"display:none;position:fixed;bottom:0;right:0;width:100%;height:100%;border:none;z-index:2147483647;";
		modalIframe.id = "reviseo-modal";
		modalIframe.onerror = () => {
			console.error("Error occurred when loading Reviseo modal.");
		};
		containerRef.current?.appendChild(modalIframe);

		const setTriggerSize = (size: { width: string; height: string }) => {
			const trigger = triggerIframeRef.current;
			if (!trigger) return;
			trigger.style.width = size.width;
			trigger.style.height = size.height;
		};

		const showModal = (message: Record<string, unknown>) => {
			const modal = document.getElementById(
				"reviseo-modal",
			) as HTMLIFrameElement | null;
			if (!modal) return;
			modal.style.display = "block";
			modal.contentWindow?.postMessage(message, WIDGET_ORIGIN);
		};

		const startTextMode = () => {
			if (!textEngineRef.current) {
				textEngineRef.current = new TextEditEngine();
			}
			const engine = textEngineRef.current;
			if (engine.isActive()) return;

			// The banner owns the screen during text mode; the trigger returns
			// when the mode ends.
			if (triggerIframeRef.current) {
				triggerIframeRef.current.style.display = "none";
			}
			setTriggerSize(TRIGGER_COLLAPSED);

			engine.start({
				onEditsChanged: () => {},
				onReview: (edits) => {
					showModal({
						type: "SHOW_TEXT_REVIEW",
						edits,
						url: window.location.href,
					});
				},
				onExit: () => {
					if (triggerIframeRef.current) {
						triggerIframeRef.current.style.display = "block";
					}
				},
			});
		};

		// Message listener
		const handleMessage = async (event: MessageEvent) => {
			if (event.origin !== WIDGET_ORIGIN) return;
			if (!event.data?.type) return;

			switch (event.data.type) {
				case "EXPAND_TRIGGER":
					setTriggerSize(TRIGGER_EXPANDED);
					break;

				case "COLLAPSE_TRIGGER":
					setTriggerSize(TRIGGER_COLLAPSED);
					break;

				case "TEXT_MODE_START": {
					let seen = false;
					try {
						seen = localStorage.getItem(TEXT_ONBOARDING_KEY) === "1";
					} catch {}
					if (seen) {
						startTextMode();
					} else {
						showModal({ type: "SHOW_TEXT_GUIDE" });
					}
					break;
				}

				case "TEXT_GUIDE_DONE": {
					try {
						localStorage.setItem(TEXT_ONBOARDING_KEY, "1");
					} catch {}
					const modal = document.getElementById("reviseo-modal");
					if (modal) modal.style.display = "none";
					startTextMode();
					break;
				}

				case "TEXT_EDIT_REMOVED":
					if (typeof event.data.id === "string") {
						textEngineRef.current?.removeEdit(event.data.id);
					}
					break;

				case "TEXT_SUBMITTED":
					// Batch is saved server-side; wipe local state and restore
					// the page. The modal keeps showing its success view until
					// it closes itself (CLOSE_FORM).
					textEngineRef.current?.clearAfterSubmit();
					break;

				case "HEALTH_CHECK":
					// Respond to health check
					triggerIframeRef.current?.contentWindow?.postMessage(
						{ type: "HEALTH_OK", projectId, clientHint: readClientHint() },
						WIDGET_ORIGIN,
					);
					break;

				case "READY":
					// Widget reports it's ready
					if (healthTimeoutRef.current) {
						clearTimeout(healthTimeoutRef.current);
					}
					if (triggerIframeRef.current) {
						triggerIframeRef.current.style.display = "block";
					}
					break;

				case "OPEN_FORM": {
					const modal = document.getElementById(
						"reviseo-modal",
					) as HTMLIFrameElement;
					if (modal) {
						modal.style.display = "block";
						// Tell modal to show and capture screenshot
						modal.contentWindow?.postMessage(
							{ type: "SHOW_MODAL" },
							WIDGET_ORIGIN,
						);
					}
					break;
				}

				case "CLOSE_FORM": {
					const modal = document.getElementById("reviseo-modal");
					if (modal) {
						modal.style.display = "none";
					}
					break;
				}

				case "REQUEST_PAGE_DATA": {
					// Send current page URL to modal iframe
					const modalIframe = document.getElementById(
						"reviseo-modal",
					) as HTMLIFrameElement;

					if (modalIframe?.contentWindow) {
						modalIframe.contentWindow.postMessage(
							{
								type: "PAGE_DATA_RESPONSE",
								url: window.location.href,
								viewportHeight: window.innerHeight,
								viewportWidth: window.innerWidth,
								browserInfo: browserInfoRef.current,
								projectId,
							},
							WIDGET_ORIGIN,
						);
					}
					break;
				}
				case "REQUEST_PAGE_SCREENSHOT": {
					const modalIframe = document.getElementById(
						"reviseo-modal",
					) as HTMLIFrameElement | null;
					if (!modalIframe) break;

					// const pngDataUrl = await captureViewport();
					const result = await snapdom.toPng(document.body, {
						plugins: [
							sanitizePlugin,
							clipRegionPlugin({
								x: window.scrollX,
								y: window.scrollY,
								width: window.innerWidth,
								height: window.innerHeight,
							}),
						],
						exclude: ["#reviseo-container"],
						scale: 0.5,
						quality: 1,
						// No external CORS proxy: never route customer page
						// resources through a third-party service.
						embedFonts: true,
					});

					const cropped = await cropImageFromDataURL(
						result.src,
						0,
						0,
						window.innerWidth,
						window.innerHeight,
					);

					modalIframe.contentWindow?.postMessage(
						{
							type: "PAGE_SCREENSHOT_RESPONSE",
							image: cropped,
						},
						WIDGET_ORIGIN,
					);

					break;
				}
			}
		};

		window.addEventListener("message", handleMessage);

		// Cleanup
		return () => {
			window.removeEventListener("message", handleMessage);
			if (healthTimeoutRef.current) {
				clearTimeout(healthTimeoutRef.current);
			}
			textEngineRef.current?.stop();
			modalIframe.remove();
		};
		// Mount-once: modal iframe + listener must not be duplicated.
	}, [projectId]);

	return (
		<div
			ref={containerRef}
			id="reviseo-container"
			style={{
				zIndex: 2147483647,
				position: "fixed",
			}}
		>
			<iframe
				ref={triggerIframeRef}
				src={`${WIDGET_ORIGIN}/widget/trigger`}
				id="reviseo-trigger"
				title={"Reviseo Trigger"}
				style={{
					position: "fixed",
					bottom: "20px",
					right: "20px",
					width: "64px",
					height: "64px",
					margin: "auto",
					border: "none",
					display: "none", // hidden initially
				}}
			/>
		</div>
	);
}
