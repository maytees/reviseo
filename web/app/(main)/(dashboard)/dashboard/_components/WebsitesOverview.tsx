import { ArrowRight, Globe } from "lucide-react";
import Link from "next/link";
import type { UserDataType } from "@/app/data/user/get-user-data";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import { env } from "@/lib/env";
import { getDomain } from "@/lib/getDomain";
import SiteLinkMedia from "../websites/_components/SiteLinkMedia";

const WebsitesOverview = ({ userData }: { userData: UserDataType }) => {
	const websites = userData?.developerWebsites.slice(0, 5) || [];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Websites</CardTitle>
				<CardDescription>
					Quick overview of your active websites
				</CardDescription>
				<CardAction>
					<Button size={"sm"} asChild variant={"ghost"}>
						<Link href={`/dashboard/websites`}>See All Websites</Link>
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				{userData?.developerWebsites.length === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Globe />
							</EmptyMedia>
							<EmptyTitle>No Websites</EmptyTitle>
							<EmptyDescription>
								You don&apos;t currently have any websites added. Add one to get
								started.
							</EmptyDescription>
							<EmptyContent>
								<Button asChild size={"sm"}>
									<Link href="/dashboard/websites">Add Website</Link>
								</Button>
							</EmptyContent>
						</EmptyHeader>
					</Empty>
				) : (
					<div className="space-y-2">
						{websites.map((website) => (
							<div
								key={website.id}
								className="flex items-center gap-3 transition-colors rounded-lg"
							>
								<SiteLinkMedia
									url={website.url}
									screenshotKey={website.screenshotKey}
									name={website.name}
									app_url={env.BETTER_AUTH_URL}
									size="small"
								/>
								<div className="flex-1 min-w-0">
									<h3 className="font-semibold truncate font-caudex">
										{website.name}
									</h3>
									<div className="flex items-center gap-1.5 mt-0.5">
										<Globe className="flex-shrink-0 text-green-400 size-3" />
										<p className="text-sm truncate text-muted-foreground">
											{getDomain(website.url)}
										</p>
									</div>
								</div>
								<Button size={"sm"} variant={"outline"} asChild>
									<Link href={`/dashboard/websites/${website.id}`}>
										Open
										<ArrowRight />
									</Link>
								</Button>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default WebsitesOverview;
