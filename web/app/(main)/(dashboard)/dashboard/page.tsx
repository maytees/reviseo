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
		(website) => website.feedback
	);

	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-0.5">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold font-caudex">
						Welcome, {userData.name}
					</h1>
				</div>
				<div className="flex-1">
					<p className="text-sm text-muted-foreground">
						Manage client feedback across all your websites.
					</p>
				</div>
			</div>

			<div className="flex flex-row justify-between w-full gap-2">
				<div className="flex flex-col w-full gap-5 xl:w-4/6 ">
					<div className="flex flex-row w-full gap-2">
						<Card className="w-1/3 gap-1 h-34">
							<CardHeader className="flex gap-1.5 flex-col items-start justify-between space-y-0">
								<div className="p-1.5 rounded-sm bg-green-300/20">
									<Globe className="text-green-300 rounded-sm size-4" />
								</div>
								<CardTitle className="text-base font-semibold font-caudex text-muted-foreground">
									Websites
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold">
									{userData.developerWebsites.length || "N/A"}
								</div>
							</CardContent>
						</Card>
						<Card className="w-1/3 gap-1 h-34">
							<CardHeader className="flex gap-1.5 flex-col items-start justify-between space-y-0">
								<div className="p-1.5 rounded-sm bg-blue-300/20">
									<PersonStanding className="text-blue-500 size-4" />
								</div>
								<CardTitle className="text-base font-semibold font-caudex text-muted-foreground">
									Clients
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold">
									{userData.developerWebsites.reduce((acc, website) => {
										return acc + (website.clientId ? 1 : 0);
									}, 0) || "N/A"}
								</div>
							</CardContent>
						</Card>
						<Card className="w-1/3 gap-1 h-34">
							<CardHeader className="flex gap-1.5 flex-col items-start justify-between space-y-0">
								<div className="p-1.5 rounded-sm bg-amber-300/20">
									<MessageCircle className="size-4 text-amber-500" />
								</div>
								<CardTitle className="text-base font-semibold font-caudex text-muted-foreground">
									Feedback
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold">
									{allFeedback.length || "0"}
								</div>
							</CardContent>
						</Card>
					</div>
					<WebsitesOverview userData={userData} />
					<RecentSubmissions feedbacks={allFeedback} />
				</div>
				<div className="flex-col hidden w-2/6 h-full gap-5 xl:flex">
					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
							<CardDescription>Common tasks and shortcuts</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-1.5">
							<CreateWebsiteDialog className="justify-start w-full" />
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
