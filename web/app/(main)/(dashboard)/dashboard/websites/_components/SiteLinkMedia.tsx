"use client";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SiteLinkMedia = ({
	url,
	screenshotKey,
	name,
	app_url,
}: {
	url: string;
	app_url: string;
	screenshotKey: string | null;
	name: string;
}) => {
	// Construct the URL from the key, similar to how feedback screenshots work
	const screenshotUrl = screenshotKey
		? `${app_url}/api/s3/screenshot/${screenshotKey}`
		: null;

	return (
		<div className="relative group">
			<Link
				href={url}
				onClick={(e) => e.stopPropagation()}
				target="_blank"
				className="block"
			>
				<Image
					src={screenshotUrl ?? "https://avatar.vercel.sh/1"}
					alt={name}
					width={1920}
					unoptimized
					height={1080}
					className="z-40 object-cover w-full h-auto transition-all ease-in-out rounded lg:w-36 duration-400 hover:opacity-80"
				/>
			</Link>
			<ExternalLink className="absolute top-2 right-2 z-50 size-3.5 opacity-0 group-hover:opacity-70 transition-opacity duration-400 ease-in-out text-white" />
		</div>
	);
};

export default SiteLinkMedia;
