// src/main.tsx
// Mount Preact app into a dedicated host element on <body>
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
	// Render into our own host element instead of document.body directly:
	// frameworks that own the body (React/Next hydration, Astro view
	// transitions) replace body children on client-side navigation, which
	// would silently remove the widget until a hard refresh.
	const host = document.createElement("div");
	host.id = "reviseo-root";

	const mount = () => {
		document.body.appendChild(host);
		render(<ReviseoWidget projectId={projectId} />, host);

		// If a client-side navigation swaps the body (or removes our host),
		// re-attach it — the Preact tree inside the host stays alive.
		const observer = new MutationObserver(() => {
			if (!document.body.contains(host)) {
				document.body.appendChild(host);
			}
		});
		observer.observe(document.documentElement, {
			childList: true,
			subtree: true,
		});
	};

	if (document.body) {
		mount();
	} else {
		document.addEventListener("DOMContentLoaded", mount, { once: true });
	}
}
