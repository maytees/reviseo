import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Loader2 } from "lucide-preact";
import { useEffect, useState } from "preact/hooks";
import useSystemTheme from "react-use-system-theme";
import { Button } from "./components/Button";

window.EXCALIDRAW_ASSET_PATH = "/";

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
	const [initialData, setInitialData] = useState(undefined);
	const [imageLoading, setImageLoading] = useState(false);
	const systemTheme: "dark" | "light" = useSystemTheme("dark");

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
				appState: { viewBackgroundColor: "#f8eeec" },
				files: {
					screenshot: {
						id: "screenshot",
						dataURL: imageUrl,
						mimeType: "image/svg+xml",
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
				<div className="w-full h-full flex flex-col justify-center items-center">
					<Button variant="outline" size="icon">
						<Loader2 className="animate-spin" />
					</Button>
					<h1>Loading Screenshot</h1>
					<p className="text-muted-foreground text-sm">
						Please wait while we load the preview.
					</p>
				</div>
			) : (
				<slot>
					<Excalidraw
						initialData={initialData}
						// biome-ignore lint/correctness/noConstantCondition: temp
						theme={false ? systemTheme : "light"}
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
