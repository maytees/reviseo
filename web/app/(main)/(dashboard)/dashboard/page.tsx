import { Globe, MessageCircle, PersonStanding } from "lucide-react";
import { getUserData } from "@/app/data/user/get-user-data";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import RecentSubmissions from "./_components/RecentSubmissions";

export default async function DashboardPage() {
	const userData = await getUserData();

	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-0.5">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold font-caudex">
						Welcome, {userData?.name}
					</h1>
				</div>
				<div className="flex-1">
					<p className="text-sm text-muted-foreground">
						Manage client feedback across all your websites.
					</p>
				</div>
			</div>

			<div className="flex flex-col gap-10">
				<div className="flex flex-row gap-2">
					<Card className="gap-3 w-42">
						<CardHeader className="flex flex-col items-start justify-between space-y-0">
							<Globe className="size-4 text-muted-foreground" />
							<CardTitle className="text-lg font-bold font-caudex">
								Total Websites
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{userData?.developerWebsites.length || "N/A"}
							</div>
						</CardContent>
					</Card>
					<Card className="gap-3 w-42">
						<CardHeader className="flex flex-col items-start justify-between space-y-0">
							<PersonStanding className="size-4 text-muted-foreground" />
							<CardTitle className="text-lg font-bold font-caudex">
								Total Clients
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{userData?.developerWebsites.length || "N/A"}
							</div>
						</CardContent>
					</Card>
					<Card className="gap-3 w-42">
						<CardHeader className="flex flex-col items-start justify-between space-y-0">
							<MessageCircle className="size-4 text-muted-foreground" />
							<CardTitle className="text-lg font-bold font-caudex">
								Total Feedback
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{userData?.feedback.length || "0"}
							</div>
						</CardContent>
					</Card>
				</div>
				<RecentSubmissions feedbacks={userData?.feedback} />
			</div>
		</div>
	);
}
