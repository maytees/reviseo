"use client";

import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { cn } from "@/lib/utils";

const ScreenshotPreview = ({
	app_url,
	screenshotKey,
	className,
}: {
	app_url: string;
	screenshotKey: string;
	className?: string;
}) => {
	return (
		<PhotoProvider>
			<PhotoView src={`${app_url}/api/s3/annotations/${screenshotKey}`}>
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
			</PhotoView>
		</PhotoProvider>
	);
};

export default ScreenshotPreview;
