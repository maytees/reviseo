import {
	BookOpen,
	CalendarPlus,
	CircleCheck,
	CircleX,
	Globe,
	LinkIcon,
	MessageCircle,
	PersonStanding,
} from "lucide-react";
import moment from "moment";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserData } from "@/app/data/user/get-user-data";
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
	Item,
	ItemActions,
	ItemContent,
	ItemGroup,
	ItemHeader,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { env } from "@/lib/env";
import { getDomain } from "@/lib/getDomain";
import DashboardFooter from "../_components/DashboardFooter";
import CreateWebsiteDialog from "./_components/CreateWebsiteDialog";
import SiteLinkMedia from "./_components/SiteLinkMedia";
import WebsiteDropdownMenu from "./_components/WebsiteDropdownMenu";

export const metadata: Metadata = {
	title: "Websites",
};

export default async function WebsitesPage() {
	const userData = await getUserData();

	if (!userData) return notFound();

	return (
		<div className="flex min-h-full flex-col">
			<div className="flex-1 space-y-4">
				<div className="flex flex-row items-center justify-between">
					<div className="flex flex-col gap-0.5">
						<div className="flex items-center justify-between">
							<h1 className="font-bold font-caudex text-3xl">
								Your Websites ({userData?.developerWebsites.length})
							</h1>
						</div>
						<div className="flex-1">
							<p className="text-muted-foreground text-sm">
								View and manage your websites.
							</p>
						</div>
					</div>
					<CreateWebsiteDialog />
				</div>
				{userData?.developerWebsites.length === 0 ? (
					<Empty className="mt-20">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Globe />
							</EmptyMedia>
							<EmptyTitle>No Websites</EmptyTitle>
							<EmptyDescription>
								You don&apos;t currently have any websites added. Please add one
								to get started.
							</EmptyDescription>
							<EmptyContent>
								<div className="flex items-center gap-2">
									<CreateWebsiteDialog />
									<Button size={"sm"} variant={"outline"}>
										<BookOpen />
										Docs
									</Button>
								</div>
							</EmptyContent>
						</EmptyHeader>
					</Empty>
				) : (
					<ItemGroup className="gap-2">
						{userData.developerWebsites.map((site) => (
							<Item
								className="w-full flex-col items-start md:items-center lg:flex-row"
								variant="outline"
								size={"sm"}
								key={site.id}
							>
								{/* Mobile: Image at top */}
								<ItemHeader className="w-full lg:hidden">
									<ItemMedia variant={"siteImage"} className="group w-full">
										<SiteLinkMedia
											url={site.url}
											screenshotKey={site.screenshotKey}
											name={site.name}
											app_url={env.BETTER_AUTH_URL}
										/>
									</ItemMedia>
								</ItemHeader>
								{/* Desktop: Image on left */}
								<ItemMedia
									variant={"siteImage"}
									className="group hidden lg:block"
								>
									<SiteLinkMedia
										app_url={env.BETTER_AUTH_URL}
										url={site.url}
										screenshotKey={site.screenshotKey}
										name={site.name}
									/>
								</ItemMedia>
								<ItemContent className="w-full">
									<ItemTitle className="font-bold font-caudex text-2xl">
										{site.name}
									</ItemTitle>
									<div className="mt-1 grid grid-cols-3 gap-y-2 space-x-4 xl:max-w-96">
										<div className="flex flex-row items-center gap-1">
											<Globe className="size-3 shrink-0 text-green-400" />
											<span className="truncate font-normal text-muted-foreground text-sm">
												{getDomain(site.url)}
											</span>
										</div>
										<div className="flex flex-row items-center gap-1">
											<PersonStanding className="size-3 shrink-0 text-blue-400" />
											<span className="truncate font-normal text-muted-foreground text-xs">
												{site.client?.name ?? "No Client"}
											</span>
										</div>
										<div className="flex flex-row items-center gap-1">
											<MessageCircle className="size-3 shrink-0 text-amber-400" />
											<span className="font-normal text-muted-foreground text-xs">
												{site.feedback.length}
											</span>
										</div>
										<div className="flex flex-row items-center gap-1">
											{site.widgetInstalled ? (
												<CircleCheck className="size-3 shrink-0 text-indigo-400" />
											) : (
												<CircleX className="size-3 shrink-0 text-destructive" />
											)}
											<span className="font-normal text-muted-foreground text-xs">
												{site.widgetInstalled
													? "Widget Installed"
													: "Widget not Installed"}
											</span>
										</div>
										<div className="flex flex-row items-center gap-1">
											<CalendarPlus className="size-3 shrink-0 text-teal-400" />
											<span className="font-normal text-muted-foreground text-xs">
												{moment(site.createdAt).format("MMM Do YY")}
											</span>
										</div>
									</div>
								</ItemContent>
								<ItemActions className="mt-2 w-full md:mt-0 lg:w-auto">
									<Button
										asChild
										variant={"dashed"}
										size={"sm"}
										className="w-full lg:w-auto"
									>
										<Link href={`/dashboard/websites/${site.id}`}>
											<LinkIcon />
											Open
										</Link>
									</Button>
									<WebsiteDropdownMenu open website={site} />
								</ItemActions>
							</Item>
						))}
					</ItemGroup>
				)}
			</div>
			<DashboardFooter />
		</div>
	);
}
