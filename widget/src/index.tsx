import { render } from "preact";
import { FeedbackWidget } from "./FeedbackWidget";
import "./style.css";

// Auto-initialize when script loads
function init() {
	const container = document.createElement("div");
	container.id = "feedback-widget-root";
	document.body.appendChild(container);

	render(<FeedbackWidget />, container);
}

// Run when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
