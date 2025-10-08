import excalidrawCSS from "@excalidraw/excalidraw/index.css?inline"; // 👈 inline import
import { render } from "preact";
import { FeedbackWidget } from "./FeedbackWidget";
import widgetCSS from "./style.css?inline";

function init() {
	// Create shadow DOM container
	const container = document.createElement("div");
	container.id = "feedback-widget-root";
	document.body.appendChild(container);
	const shadowRoot = container.attachShadow({ mode: "open" });

	// Inject widget CSS into shadow DOM
	const shadowStyle = document.createElement("style");
	shadowStyle.textContent = widgetCSS;
	shadowRoot.appendChild(shadowStyle);

	// Create shadow container for the entire widget
	const shadowContainer = document.createElement("div");
	shadowRoot.appendChild(shadowContainer);

	// Create portal container INSIDE shadow DOM for dialog
	const portalContainer = document.createElement("div");
	portalContainer.id = "feedback-widget-portal";
	shadowRoot.appendChild(portalContainer);

	const style = document.createElement("style");
	style.textContent = excalidrawCSS;
	shadowRoot.appendChild(style);

	// Render with portal container reference
	render(<FeedbackWidget portalContainer={portalContainer} />, shadowContainer);
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
