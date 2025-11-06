"use client";
import Image from "next/image";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import { cn } from "@/lib/utils";

const ScreenshotPreview = ({
	app_url,
	screenshotKey,
	className,
	onZoomChange,
}: {
	app_url: string;
	screenshotKey: string;
	className?: string;
	onZoomChange?: (isZoomed: boolean) => void;
}) => {
	return (
		<ImageZoom
			zoomMargin={20}
			backdropClassName={cn(
				'[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80',
			)}
			className="hover:cursor-nesw-resize"
			onZoomChange={onZoomChange}
		>
			<Image
				src={`${app_url}/api/s3/annotations/${screenshotKey}`}
				unoptimized
				alt={`Feedback Image`}
				width={1920}
				height={1080}
				className={cn(
					"z-40 object-cover w-full h-auto transition-all ease-in-out rounded hover:cursor-nesw-resize aspect-video lg:w-20 duration-400 hover:opacity-80",
					className,
				)}
			/>
		</ImageZoom>
	);
};

export default ScreenshotPreview;
