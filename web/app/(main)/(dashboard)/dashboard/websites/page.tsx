import {
	BookOpen,
	CalendarPlus,
	Circle,
	Globe,
	LinkIcon,
	MessageCircle,
	PersonStanding,
} from "lucide-react";
import moment from "moment";
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
import { getDomain } from "@/lib/getDomain";
import { cn } from "@/lib/utils";
import DashboardFooter from "../_components/DashboardFooter";
import CreateWebsiteDialog from "./_components/CreateWebsiteDialog";
import SiteLinkMedia from "./_components/SiteLinkMedia";
import WebsiteDropdownMenu from "./_components/WebsiteDropdownMenu";

export default async function WebsitesPage() {
	const userData = await getUserData();

	if (!userData) return notFound();

	return (
		<div className="flex flex-col min-h-full">
			<div className="flex-1 space-y-4">
				<div className="flex flex-row items-center justify-between">
					<div className="flex flex-col gap-0.5">
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-bold font-caudex">
								Your Websites ({userData?.developerWebsites.length})
							</h1>
						</div>
						<div className="flex-1">
							<p className="text-sm text-muted-foreground">
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
								className="flex-col items-start w-full lg:flex-row md:items-center"
								variant="outline"
								size={"sm"}
								key={site.id}
							>
								{/* Mobile: Image at top */}
								<ItemHeader className="w-full lg:hidden">
									<ItemMedia variant={"siteImage"} className="w-full group">
										<SiteLinkMedia
											url={site.url}
											screenshotUrl={site.screenshotUrl}
											name={site.name}
										/>
									</ItemMedia>
								</ItemHeader>
								{/* Desktop: Image on left */}
								<ItemMedia
									variant={"siteImage"}
									className="hidden lg:block group"
								>
									<SiteLinkMedia
										url={site.url}
										screenshotUrl={site.screenshotUrl}
										name={site.name}
									/>
								</ItemMedia>
								<ItemContent className="w-full">
									<ItemTitle className="text-2xl font-bold font-caudex">
										{site.name}
									</ItemTitle>
									<div className="grid grid-cols-3 mt-1 space-x-4 xl:max-w-96 gap-y-2">
										<div className="flex flex-row items-center gap-1">
											<Globe className="flex-shrink-0 text-green-400 size-3" />
											<span className="text-sm font-normal truncate text-muted-foreground">
												{getDomain(site.url)}
											</span>
										</div>
										<div className="flex flex-row items-center gap-1">
											<PersonStanding className="flex-shrink-0 text-blue-400 size-3" />
											<span className="text-xs font-normal truncate text-muted-foreground">
												{site.client?.name ?? "No Client"}
											</span>
										</div>
										<div className="flex flex-row items-center gap-1">
											<MessageCircle className="flex-shrink-0 size-3 text-amber-400" />
											<span className="text-xs font-normal text-muted-foreground">
												{site.feedback.length}
											</span>
										</div>
										<div className="flex flex-row items-center gap-1">
											<Circle
												className={cn("size-3 flex-shrink-0", {
													"text-indigo-400": site.widgetInstalled,
													"text-red-400": !site.widgetInstalled,
												})}
											/>
											<span className="text-xs font-normal text-muted-foreground">
												{site.widgetInstalled
													? "Widget Installed"
													: "Widget Pending"}
											</span>
										</div>
										<div className="flex flex-row items-center gap-1">
											<CalendarPlus className="flex-shrink-0 text-teal-400 size-3" />
											<span className="text-xs font-normal text-muted-foreground">
												{moment(site.createdAt).format("MMM Do YY")}
											</span>
										</div>
									</div>
								</ItemContent>
								<ItemActions className="w-full mt-2 lg:w-auto md:mt-0">
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
									<WebsiteDropdownMenu
										websiteName={site.name}
										websiteId={site.id}
										projectId={site.projectId}
									/>
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
