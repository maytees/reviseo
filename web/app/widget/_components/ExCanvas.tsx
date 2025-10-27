"use client";
import dynamic from "next/dynamic";

import "@excalidraw/excalidraw/index.css";

import type {
	ExcalidrawElement,
	ExcalidrawImageElement,
	FileId,
} from "@excalidraw/excalidraw/element/types";
import type {
	AppState,
	BinaryFiles,
	DataURL,
} from "@excalidraw/excalidraw/types";
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
	const [initialData, setInitialData] = useState<{
		elements?: ExcalidrawElement[];
		appState?: Partial<AppState>;
		files?: BinaryFiles;
		scrollToContent?: boolean;
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
			const fileId = "screenshot-image";

			const imageElement: ExcalidrawImageElement = {
				type: "image",
				crop: null,
				id: fileId,
				x: 0,
				y: 0,
				width: img.width / 2,
				height: img.height / 2,
				status: "saved",
				locked: true,
				version: 1,
				scale: [1, 1],
				fileId: fileId as FileId,
				versionNonce: 1,
				isDeleted: false,
				seed: (Math.random() * 100000) | 0,
				angle: 0,
				strokeColor: "transparent",
				backgroundColor: "transparent",
				fillStyle: "solid",
				strokeWidth: 1,
				strokeStyle: "solid",
				roughness: 0,
				opacity: 100,
				groupIds: [],
				frameId: null,
				roundness: null,
				boundElements: null,
				index: null,
				updated: Date.now(),
				link: null,
			};

			setInitialData({
				elements: [imageElement],
				appState: {
					viewBackgroundColor: "#ebede8",
				},
				scrollToContent: true,
				files: {
					[fileId]: {
						id: fileId as FileId,
						dataURL: imageUrl as DataURL,
						mimeType: "image/png",
						created: Date.now(),
						lastRetrieved: Date.now(),
					},
				},
			});
			setImageLoading(false);
		};

		img.onerror = (e) => {
			console.log(imageUrl);
			console.error("Failed to load screenshot image: ", e);
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
				<div style={{ width: "100%", height: "100%" }}>
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
				</div>
			)}
		</>
	);
};

export default ExCanvas;
