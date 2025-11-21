"use client";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SiteLinkMedia = ({
	url,
	screenshotKey,
	name,
	app_url,
	size = "default",
}: {
	url: string;
	app_url: string;
	screenshotKey: string | null;
	name: string;
	size?: "default" | "small";
}) => {
	// Construct the URL from the key, similar to how feedback screenshots work
	const screenshotUrl = screenshotKey
		? `${app_url}/api/s3/screenshot/${screenshotKey}`
		: null;

	return (
		<div className="group relative">
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
					className={cn(
						"z-40 h-auto w-full rounded object-cover transition-all duration-400 ease-in-out hover:opacity-80",
						size === "small" ? "w-16" : "lg:w-36",
					)}
				/>
			</Link>
			<ExternalLink className="absolute top-2 right-2 z-50 size-3.5 text-white opacity-0 transition-opacity duration-400 ease-in-out group-hover:opacity-70" />
		</div>
	);
};

export default SiteLinkMedia;
