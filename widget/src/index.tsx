// src/main.tsx
// Mount Preact app directly to body
import { render } from "preact";
import ReviseoWidget from "./ReviseoWidget";

// Project id sources, in order:
// 1. window.ReviseoConfig (the standard install snippet)
// 2. data-project-id on the <script> tag (simple one-tag install:
//    <script src="https://reviseo.app/cdn/reviseo.js" data-project-id="…">)
const config = window.ReviseoConfig;
const scriptEl = document.currentScript as HTMLScriptElement | null;
const projectId = config?.projectId || scriptEl?.dataset.projectId;

if (!projectId) {
	console.error(
		"Reviseo: no project id found. Either install the snippet that sets " +
			'window.ReviseoConfig, or add data-project-id="YOUR_PROJECT_ID" to ' +
			"the script tag. Get either from your Reviseo dashboard's Widget tab.",
	);
} else {
	render(<ReviseoWidget projectId={projectId} />, document.body);
}
