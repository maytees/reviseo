"use client";

import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";

const ScreenshotPreview = ({
	app_url,
	screenshotKey,
}: {
	app_url: string;
	screenshotKey: string;
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
					className="z-40 object-cover w-full h-auto transition-all ease-in-out rounded hover:cursor-nesw-resize aspect-video lg:w-20 duration-400 hover:opacity-80"
				/>
			</PhotoView>
		</PhotoProvider>
	);
};

export default ScreenshotPreview;
