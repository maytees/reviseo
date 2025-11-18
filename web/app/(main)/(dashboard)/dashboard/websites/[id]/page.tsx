import { ExternalLink } from "lucide-react";
import moment from "moment";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import VerifyInstallation from "@/app/(main)/(onboarding)/onboarding/_components/VerifyInstallation";
import { requireUser } from "@/app/data/require-user";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardFooter from "../../_components/DashboardFooter";
import CopyProjectId from "../_components/CopyProjectId";
import WebsiteDropdownMenu from "../_components/WebsiteDropdownMenu";
import ClientInfo from "./_components/client/ClientInfo";
import EditWebsiteDetailsDialog from "./_components/EditWebsiteDetailsDialog";
import FeedbackTable from "./_components/feedback/FeedbackTable";
import SettingsTab from "./_components/settings/SettingsTab";
import WidgetTab from "./_components/widget/WidgetTab";


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
	await requireUser();
	const { id } = await params;
	const openId = (await searchParams).open;

	const website = await getWebsiteByIdAndDevId(id);

	if (!website) return notFound();

	return (
		<HoverCard openDelay={100} closeDelay={0}>
			<div className="flex flex-col gap-0.5 h-full">
				<div className="flex flex-row items-center justify-between">
					<div className="flex items-center gap-4">
						<h1 className="text-3xl font-bold font-caudex">{website.name}</h1>
						<div className="flex flex-row items-center ">
							<EditWebsiteDetailsDialog website={website} />
							<CopyProjectId projectId={website.projectId} />
						</div>
					</div>
					<div className="flex flex-row items-center gap-2">
						<Badge
							variant={"outline"}
							size={"sm"}
							className="text-xs text-muted-foreground"
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
				<div className=" w-fit">
					<HoverCardTrigger asChild>
						<Link
							href={website.url}
							className="flex items-center text-sm w-fit peer-hover:underline hover:underline text-muted-foreground"
							target="_blank"
						>
							{website.url}
							<ExternalLink className="ml-1 peer-hover:underline underline size-2.5" />
						</Link>
					</HoverCardTrigger>
				</div>
				<HoverCardContent align="start" className="p-1 border border-border">
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
						className="z-40 object-cover w-full h-auto rounded"
					/>
				</HoverCardContent>
				<Tabs defaultValue="feedback" className="mt-4">
					<TabsList className="grid h-8 grid-cols-4">
						<TabsTrigger value={"feedback"}>Feedback</TabsTrigger>
						<TabsTrigger value={"client"}>Client</TabsTrigger>
						<TabsTrigger value={"widget"}>Widget</TabsTrigger>
						<TabsTrigger value={"settings"}>Settings</TabsTrigger>
					</TabsList>
					<TabsContent value="feedback">
						<FeedbackTable website={website} open={openId} />
					</TabsContent>
					<TabsContent value="client">
						<ClientInfo website={website} />
					</TabsContent>
					<TabsContent value="widget">
						<WidgetTab
							projectId={website.projectId}
							widgetInstalled={website.widgetInstalled}
							verifiedAt={website.verifiedAt}
						/>
					</TabsContent>
					<TabsContent value="settings">
					<SettingsTab website={website} />
				</TabsContent>
				</Tabs>
				<div className="mt-auto">
					<DashboardFooter />
				</div>
			</div>
		</HoverCard>
	);
};

export default WebsitePage;
