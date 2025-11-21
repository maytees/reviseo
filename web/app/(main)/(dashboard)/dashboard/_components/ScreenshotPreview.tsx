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
					"z-40 aspect-video h-auto w-full rounded object-cover transition-all duration-400 ease-in-out hover:cursor-nesw-resize hover:opacity-80 lg:w-20",
					className,
				)}
			/>
		</ImageZoom>
	);
};

export default ScreenshotPreview;
