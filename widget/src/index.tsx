// src/main.tsx
// Mount Preact app directly to body
import { render } from "preact";
import ReviseoWidget from "./ReviseoWidget";

// TODO: Add where to put widget, e.g 'bottom-left', 'bottom-right'
const config: {
	projectId: string;
} = (window as any).ReviseoConfig;

if (!config?.projectId) {
	console.error("Reviseo: Missing ReviseoConfig");
} else {
	const reviseoRoot = document.createElement("div");
	reviseoRoot.id = "reviseo-container";
	reviseoRoot.style.zIndex = "2147483647";
	reviseoRoot.style.position = "fixed";

	document.body.appendChild(reviseoRoot);

	render(<ReviseoWidget projectId={config.projectId} />, reviseoRoot);
}
