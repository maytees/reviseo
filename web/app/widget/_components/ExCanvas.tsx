"use client";
import dynamic from "next/dynamic";

import "@excalidraw/excalidraw/index.css";

import type {
	ExcalidrawElement,
	ExcalidrawImageElement,
} from "@excalidraw/excalidraw/element/types";
import type { AppState } from "@excalidraw/excalidraw/types";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

const Excalidraw = dynamic(
	async () => (await import("@excalidraw/excalidraw")).Excalidraw,
	{
		ssr: false,
	},
);

const ExCanvas = ({
	imageUrl,
	pending,
}: {
	imageUrl?: string;
	pending: boolean;
}) => {
	// window.EXCALIDRAW_ASSET_PATH = "/";
	const [initialData, setInitialData] = useState<{
		elements?: ExcalidrawElement[];
		appState?: AppState;
	}>();
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
			const imageElement: ExcalidrawImageElement = {
				type: "image",
				id: "screenshot-image",
				x: 0,
				y: 0,
				width: img.width / 2,
				height: img.height / 2,
				status: "saved",
				locked: true,
				version: 1,
				scale: [1, 1],
				fileId: "screenshot",
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
				<Empty className="flex flex-col items-center justify-center w-full h-full">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Spinner />
						</EmptyMedia>
						<EmptyTitle>Loading Screenshot</EmptyTitle>
						<EmptyDescription>
							Please wait while we load the preview screenshot.{" "}
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
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
