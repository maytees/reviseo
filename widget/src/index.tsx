// src/main.tsx
// Mount Preact app directly to body
import { render } from "preact";
import ReviseoWidget from "./ReviseoWidget";

document.addEventListener("DOMContentLoaded", () => {
	const reviseoRoot = document.createElement("div");
	reviseoRoot.id = "reviseo-container";
	reviseoRoot.style.zIndex = "2147483647";
	reviseoRoot.style.position = "fixed";

	document.body.appendChild(reviseoRoot);

	render(<ReviseoWidget />, reviseoRoot);
});
