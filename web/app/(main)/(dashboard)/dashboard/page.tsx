import {
	Globe,
	MessageCircle,
	PersonStanding,
	UserRoundPlus,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserData } from "@/app/data/user/get-user-data";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import ClientAttention from "./_components/ClientAttention";
import InviteClientDialog from "./_components/InviteClientDialog";
import RecentSubmissions from "./_components/RecentSubmissions";
import WebsitesOverview from "./_components/WebsitesOverview";
import CreateWebsiteDialog from "./websites/_components/CreateWebsiteDialog";

export const metadata: Metadata = {
	title: "Dashboard",
};

export default async function DashboardPage() {
	const userData = await getUserData();

	if (!userData) return notFound();

	// Aggregate all feedback from developer's websites
	const allFeedback = userData.developerWebsites.flatMap(
		(website) => website.feedback,
	);

	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-0.5">
				<div className="flex items-center justify-between">
					<h1 className="font-bold font-caudex text-3xl">
						Welcome, {userData.name}
					</h1>
				</div>
				<div className="flex-1">
					<p className="text-muted-foreground text-sm">
						Manage client feedback across all your websites.
					</p>
				</div>
			</div>

			<div className="flex w-full flex-row justify-between gap-2">
				<div className="flex w-full flex-col gap-5 xl:w-4/6">
					<div className="flex w-full flex-row gap-2">
						<Card className="h-34 w-1/3 gap-1">
							<CardHeader className="flex flex-col items-start justify-between gap-1.5 space-y-0">
								<div className="rounded-sm bg-green-300/20 p-1.5">
									<Globe className="size-4 rounded-sm text-green-300" />
								</div>
								<CardTitle className="font-caudex font-semibold text-base text-muted-foreground">
									Websites
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="font-bold text-3xl">
									{userData.developerWebsites.length || "N/A"}
								</div>
							</CardContent>
						</Card>
						<Card className="h-34 w-1/3 gap-1">
							<CardHeader className="flex flex-col items-start justify-between gap-1.5 space-y-0">
								<div className="rounded-sm bg-blue-300/20 p-1.5">
									<PersonStanding className="size-4 text-blue-500" />
								</div>
								<CardTitle className="font-caudex font-semibold text-base text-muted-foreground">
									Clients
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="font-bold text-3xl">
									{userData.developerWebsites.reduce((acc, website) => {
										return acc + (website.clientId ? 1 : 0);
									}, 0) || "N/A"}
								</div>
							</CardContent>
						</Card>
						<Card className="h-34 w-1/3 gap-1">
							<CardHeader className="flex flex-col items-start justify-between gap-1.5 space-y-0">
								<div className="rounded-sm bg-amber-300/20 p-1.5">
									<MessageCircle className="size-4 text-amber-500" />
								</div>
								<CardTitle className="font-caudex font-semibold text-base text-muted-foreground">
									Feedback
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="font-bold text-3xl">
									{allFeedback.length || "0"}
								</div>
							</CardContent>
						</Card>
					</div>
					<WebsitesOverview userData={userData} />
					<RecentSubmissions feedbacks={allFeedback} />
				</div>
				<div className="hidden h-full w-2/6 flex-col gap-5 xl:flex">
					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
							<CardDescription>Common tasks and shortcuts</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-1.5">
							<CreateWebsiteDialog className="w-full justify-start" />
							<InviteClientDialog userData={userData}>
								<Button
									size={"sm"}
									className="justify-start"
									variant={"outline"}
								>
									<UserRoundPlus />
									Invite Client
								</Button>
							</InviteClientDialog>
							<Button
								asChild
								size={"sm"}
								className="justify-start"
								variant={"outline"}
							>
								<Link href={`/dashboard/websites`}>
									<MessageCircle />
									View All Feedback
								</Link>
							</Button>
						</CardContent>
					</Card>
					<ClientAttention userData={userData} />
				</div>
			</div>
		</div>
	);
}
