import { ExternalLink } from "lucide-react";
import moment from "moment";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import VerifyInstallation from "@/app/(main)/(onboarding)/onboarding/_components/VerifyInstallation";
import { getUserData } from "@/app/data/user/get-user-data";
import { getWebsiteByIdAndDevId } from "@/app/data/website/get-website-by-id-and-dev-id";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const website = await getWebsiteByIdAndDevId(id);

	return {
		title: website ? website.name : "Website",
	};
}

import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import DashboardFooter from "../../_components/DashboardFooter";
import CopyProjectId from "../_components/CopyProjectId";
import WebsiteDropdownMenu from "../_components/WebsiteDropdownMenu";
import EditWebsiteDetailsDialog from "./_components/EditWebsiteDetailsDialog";
import WebsiteTabs from "./_components/WebsiteTabs";

const WebsitePage = async ({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	appUrl: string;
	searchParams: Promise<{
		[key: string]: string | string[] | undefined;
	}>;
}) => {
	const userData = await getUserData();
	const { id } = await params;
	const searchParamsResolved = await searchParams;
	const openId = searchParamsResolved.open;

	const website = await getWebsiteByIdAndDevId(id);

	if (!website || !userData) return notFound();

	return (
		<HoverCard openDelay={100} closeDelay={0}>
			<div className="flex h-full flex-col gap-0.5">
				<div className="flex flex-row items-center justify-between">
					<div className="flex items-center gap-4">
						<h1 className="font-bold font-caudex text-3xl">{website.name}</h1>
						<div className="flex flex-row items-center">
							<EditWebsiteDetailsDialog website={website} />
							<CopyProjectId projectId={website.projectId} />
						</div>
					</div>
					<div className="flex flex-row items-center gap-2">
						<Badge
							variant={"outline"}
							size={"sm"}
							className="text-muted-foreground text-xs"
						>
							{moment(website.verifiedAt).fromNow()
								? moment(website.verifiedAt).fromNow()
								: "Not Verified"}
						</Badge>
						<VerifyInstallation
							hideIcon
							size={"sm"}
							className=""
							projectId={website.projectId}
							reset={false}
						/>
						<WebsiteDropdownMenu website={website} />
					</div>
				</div>
				<div className="w-fit">
					<HoverCardTrigger asChild>
						<Link
							href={website.url}
							className="flex w-fit items-center text-muted-foreground text-sm hover:underline peer-hover:underline"
							target="_blank"
						>
							{website.url}
							<ExternalLink className="ml-1 size-2.5 underline peer-hover:underline" />
						</Link>
					</HoverCardTrigger>
				</div>
				<HoverCardContent align="start" className="border border-border p-1">
					<Image
						src={
							website.screenshotKey
								? `/api/s3/screenshot/${website.screenshotKey}`
								: "https://avatar.vercel.sh/1"
						}
						alt={website.name}
						width={1920}
						height={1080}
						unoptimized
						className="z-40 h-auto w-full rounded object-cover"
					/>
				</HoverCardContent>
				<Suspense fallback={<div className="mt-4">Loading...</div>}>
					<WebsiteTabs website={website} openId={openId} userData={userData} />
				</Suspense>
				<div className="mt-auto">
					<DashboardFooter />
				</div>
			</div>
		</HoverCard>
	);
};

export default WebsitePage;
