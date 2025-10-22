"use client";
import dynamic from "next/dynamic";

import "@excalidraw/excalidraw/index.css";

import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const Excalidraw = dynamic(
	async () => (await import("@excalidraw/excalidraw")).Excalidraw,
	{
		ssr: false,
	},
);

// // Inject Excalidraw CSS into document head (outside shadow DOM) - only once
// if (!document.getElementById("excalidraw-styles")) {
// 	const excalidrawStyle = document.createElement("style");
// 	excalidrawStyle.id = "excalidraw-styles";
// 	excalidrawStyle.textContent = excalidrawCSS;
// 	document.head.appendChild(excalidrawStyle);
// }

const ExCanvas = ({
	imageUrl,
	pending,
}: {
	imageUrl?: string;
	pending: boolean;
}) => {
	// window.EXCALIDRAW_ASSET_PATH = "/";
	const [initialData, setInitialData] = useState(undefined);
	const [imageLoading, setImageLoading] = useState(false);
	const { theme } = useTheme();

	useEffect(() => {
		if (!imageUrl) {
			setInitialData(undefined);
			return;
		}

		setImageLoading(true);
		const img = new Image();
		img.src = imageUrl;

		img.onload = () => {
			const imageElement = {
				type: "image",
				id: "screenshot-image",
				x: 0,
				y: 0,
				width: img.width / 2,
				height: img.height / 2,
				fileId: "screenshot",
				status: "saved",
				locked: true,
				version: 1,
				versionNonce: 1,
				isDeleted: false,
				seed: (Math.random() * 100000) | 0,
			};

			setInitialData({
				elements: [imageElement],
				appState: { viewBackgroundColor: "#ebede8" },
				files: {
					screenshot: {
						id: "screenshot",
						dataURL: imageUrl,
						mimeType: "image/svg",
						created: Date.now(),
						lastRetrieved: Date.now(),
					},
				},
				scrollToContent: true,
			});
			setImageLoading(false);
		};

		img.onerror = () => {
			console.error("Failed to load screenshot image");
			setImageLoading(false);
		};
	}, [imageUrl]);

	return (
		<>
			{pending || imageLoading || !imageUrl ? (
				<div className="flex flex-col items-center justify-center w-full h-full">
					<Button variant="outline" size="icon">
						<Loader2 className="animate-spin" />
					</Button>
					<h1>Loading Screenshot</h1>
					<p className="text-sm text-muted-foreground">
						Please wait while we load the preview.
					</p>
				</div>
			) : (
				<slot>
					<Excalidraw
						initialData={initialData}
						theme={theme === "dark" ? "dark" : "light"}
						UIOptions={{
							canvasActions: {
								changeViewBackgroundColor: false,
								clearCanvas: false,
								export: false,
								loadScene: false,
								toggleTheme: false,
								saveAsImage: false,
								saveToActiveFile: false,
							},
						}}
					/>
				</slot>
			)}
		</>
	);
};

export default ExCanvas;
