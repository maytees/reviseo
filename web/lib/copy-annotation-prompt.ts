"use client";

import {
	type AnnotationPromptInput,
	annotationPrompt,
} from "@/lib/annotation-prompt";

function escapeHtml(text: string): string {
	return text.replace(/[&<>"']/g, (character) => {
		const entities: Record<string, string> = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
		};
		return entities[character];
	});
}

/** Rasterize the saved SVG so image pasting works in AI chat inputs. */
async function annotationPng(screenshotKey: string): Promise<Blob> {
	const response = await fetch(
		`/api/s3/annotations/${encodeURIComponent(screenshotKey)}`,
		{ credentials: "same-origin", signal: AbortSignal.timeout(30_000) },
	);
	if (!response.ok) {
		throw new Error(
			"Couldn't load the annotated screenshot. Please try again.",
		);
	}

	const url = URL.createObjectURL(await response.blob());
	try {
		const image = new Image();
		image.src = url;
		await image.decode();
		if (!image.naturalWidth || !image.naturalHeight) {
			throw new Error("The annotated screenshot could not be read.");
		}

		// Keep large screenshots within browser canvas limits while retaining
		// enough detail to read the annotations.
		const scale = Math.min(
			1,
			8192 / Math.max(image.naturalWidth, image.naturalHeight),
			Math.sqrt(16_000_000 / (image.naturalWidth * image.naturalHeight)),
		);
		const canvas = document.createElement("canvas");
		canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
		canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
		const context = canvas.getContext("2d");
		if (!context)
			throw new Error("Your browser couldn't prepare the screenshot.");
		context.fillStyle = "white";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
		return await new Promise<Blob>((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (blob) resolve(blob);
				else reject(new Error("Couldn't prepare the screenshot for copying."));
			}, "image/png");
		});
	} finally {
		URL.revokeObjectURL(url);
	}
}

function blobDataUrl(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () =>
			reject(new Error("Couldn't prepare the screenshot."));
		reader.readAsDataURL(blob);
	});
}

/** Call directly from the click handler: Safari requires the clipboard write
 * to begin during the user gesture, with image loading deferred as a promise. */
export function copyAnnotationPrompt(
	feedback: AnnotationPromptInput & { screenshotKey: string },
): Promise<void> {
	if (
		!window.isSecureContext ||
		!navigator.clipboard?.write ||
		typeof ClipboardItem === "undefined"
	) {
		return Promise.reject(
			new Error(
				"Your browser doesn't support copying images. Try a current browser over HTTPS.",
			),
		);
	}

	const prompt = annotationPrompt(feedback);
	const png = annotationPng(feedback.screenshotKey);
	const html = png.then(async (blob) => {
		const imageUrl = await blobDataUrl(blob);
		return new Blob(
			[
				`<div><p style="white-space:pre-wrap">${escapeHtml(prompt)}</p><p><img src="${imageUrl}" alt="Annotated screenshot for ${escapeHtml(feedback.title)}" /></p></div>`,
			],
			{ type: "text/html" },
		);
	});
	// The browser can reject clipboard access before it consumes these
	// deferred representations. Observe later image failures in that case.
	void png.catch(() => {});
	void html.catch(() => {});

	// One item with rich HTML, PNG and plain text representations. Rich paste
	// targets receive text + image; text-only and image-only targets can pick
	// the representation they support.
	return navigator.clipboard.write([
		new ClipboardItem({
			"text/html": html,
			"image/png": png,
			"text/plain": new Blob([prompt], { type: "text/plain" }),
		}),
	]);
}
