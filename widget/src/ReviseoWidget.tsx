import { useEffect, useRef } from "preact/hooks";

const WIDGET_ORIGIN =
	import.meta.env.VITE_WIDGET_ORIGIN || "http://localhost:3000";

export default function ReviseoWidget() {
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerIframeRef = useRef<HTMLIFrameElement>(null);
	const healthTimeoutRef = useRef<number>();

	useEffect(() => {
		// Health check timeout
		healthTimeoutRef.current = window.setTimeout(() => {
			console.error("Reviseo widget failed health check. Not showing iframe.");
		}, 5000);

		// Message listener
		const handleMessage = (event: MessageEvent) => {
			if (event.origin !== WIDGET_ORIGIN) return;
			if (!event.data?.type) return;

			switch (event.data.type) {
				case "HEALTH_CHECK":
					// Respond to health check
					triggerIframeRef.current?.contentWindow?.postMessage(
						{ type: "HEALTH_OK" },
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
					const formIframe = document.createElement("iframe");
					formIframe.onerror = () => {
						console.error("Error occurred when rendering Reviseo modal.");
						formIframe.style.display = "none";
					};
					formIframe.src = `${WIDGET_ORIGIN}/widget/modal`;
					formIframe.style.cssText =
						"display:block;position:fixed;bottom:0;right:0;width:100%;height:100%;border:none;";
					formIframe.id = "reviseo-modal";
					containerRef.current?.appendChild(formIframe);
					break;
				}

				case "CLOSE_FORM": {
					const modal = document.getElementById("reviseo-modal");
					if (modal) modal.remove();
					break;
				}

				case "REQUEST_PAGE_URL": {
					// Send current page URL to modal iframe
					const modalIframe = document.getElementById(
						"reviseo-modal",
					) as HTMLIFrameElement;
					if (modalIframe?.contentWindow) {
						modalIframe.contentWindow.postMessage(
							{ type: "PAGE_URL_RESPONSE", url: window.location.href },
							WIDGET_ORIGIN,
						);
					}
					break;
				}

				case "REQUEST_PAGE_SCREENSHOT": {
					const mi = document.getElementById(
						"reviseo-modal",
					) as HTMLIFrameElement;
					console.log("todo screenshot (dont mess with this right now)");
					// Screenshot logic here when ready
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
		};
	}, []);

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
