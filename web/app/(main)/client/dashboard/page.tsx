import {
	ExternalLink,
	Globe,
	MessageCircle,
	MousePointerClick,
} from "lucide-react";
import moment from "moment";
import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/app/data/require-user";
import { feedbackSelect } from "@/app/data/selects";
import ImageEditList from "@/components/image-edit-list";
import StyleEditList from "@/components/style-edit-list";
import TextEditList from "@/components/text-edit-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import { prisma } from "@/lib/db";
import {
	APPROVAL_CONFIG,
	STATUS_BADGE_MAP,
	STATUS_CONFIG,
	TYPE_BADGE_MAP,
	TYPE_CONFIG,
} from "@/lib/types";
import ApprovalQueue from "./_components/ApprovalQueue";
import TeamManager from "./_components/TeamManager";

export const metadata: Metadata = {
	title: "Your Feedback",
};

export default async function ClientDashboard() {
	const user = await requireUser();

	const [websites, feedback, leadRows] = await Promise.all([
		prisma.website.findMany({
			// Legacy pointer OR client-team membership
			where: {
				OR: [{ clientId: user.id }, { clients: { some: { userId: user.id } } }],
			},
			select: {
				id: true,
				name: true,
				url: true,
				developer: { select: { name: true, email: true } },
			},
			orderBy: { createdAt: "desc" },
		}),
		prisma.feedback.findMany({
			where: { authorId: user.id },
			select: feedbackSelect,
			orderBy: { createdAt: "desc" },
			take: 50,
		}),
		prisma.websiteClient.findMany({
			where: { userId: user.id, role: "lead" },
			select: { websiteId: true },
		}),
	]);

	const leadWebsiteIds = leadRows.map((row) => row.websiteId);

	// Lead-only data: the client teams they manage + submissions waiting on
	// their approval.
	const [teams, pendingApprovals] =
		leadWebsiteIds.length > 0
			? await Promise.all([
					prisma.website.findMany({
						where: { id: { in: leadWebsiteIds } },
						select: {
							id: true,
							name: true,
							clients: {
								select: {
									id: true,
									role: true,
									trusted: true,
									canAnnotate: true,
									canText: true,
									canStyle: true,
									canImage: true,
									user: { select: { name: true, email: true } },
								},
								orderBy: { createdAt: "asc" },
							},
						},
					}),
					prisma.feedback.findMany({
						where: {
							websiteId: { in: leadWebsiteIds },
							approval: "PENDING",
							authorId: { not: user.id },
						},
						select: feedbackSelect,
						orderBy: { createdAt: "asc" },
					}),
				])
			: [[], []];

	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6">
			<div className="flex flex-col gap-0.5">
				<h1 className="font-bold font-caudex text-3xl">
					{user.name ? `Welcome, ${user.name}` : "Welcome"}
				</h1>
				<p className="text-muted-foreground text-sm">
					Track the feedback you've submitted and see what's been resolved.
				</p>
			</div>

			{/* Websites you review */}
			<Card>
				<CardHeader>
					<CardTitle>Websites you review</CardTitle>
					<CardDescription>
						Open a site and click the Reviseo button to leave feedback
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
					{websites.length === 0 ? (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<Globe />
								</EmptyMedia>
								<EmptyTitle>No websites yet</EmptyTitle>
								<EmptyDescription>
									When a developer adds you to a website, it will show up here.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : (
						websites.map((website) => (
							<div
								key={website.id}
								className="flex items-center justify-between gap-4 rounded-lg border border-border p-4"
							>
								<div className="flex flex-col gap-0.5">
									<span className="font-medium">{website.name}</span>
									<span className="text-muted-foreground text-xs">
										Managed by{" "}
										{website.developer.name || website.developer.email}
									</span>
								</div>
								<Button asChild variant="outline" size="sm">
									<Link
										// #reviseo-connect marks the client's browser so the
										// widget can offer its connect button there even when
										// third-party cookies are blocked.
										href={`${website.url}#reviseo-connect`}
										target="_blank"
										rel="noopener noreferrer"
									>
										Open site
										<ExternalLink className="size-3.5" />
									</Link>
								</Button>
							</div>
						))
					)}
				</CardContent>
			</Card>

			{/* Lead-only: approval queue */}
			{leadWebsiteIds.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Approvals</CardTitle>
						<CardDescription>
							{pendingApprovals.length === 0
								? "Nothing waiting — team submissions land here for your review before the developer sees them"
								: `${pendingApprovals.length} submission${pendingApprovals.length === 1 ? "" : "s"} waiting for your review`}
						</CardDescription>
					</CardHeader>
					{pendingApprovals.length > 0 && (
						<CardContent>
							<ApprovalQueue items={pendingApprovals} />
						</CardContent>
					)}
				</Card>
			)}

			{/* Lead-only: team management */}
			{teams.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Your team</CardTitle>
						<CardDescription>
							Invite teammates to review, choose which tools they can use, and
							mark trusted people whose feedback skips your approval.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-6">
						{teams.map((team) => (
							<TeamManager
								key={team.id}
								websiteId={team.id}
								websiteName={team.name}
								members={team.clients}
							/>
						))}
					</CardContent>
				</Card>
			)}

			{/* Feedback history */}
			<Card>
				<CardHeader>
					<CardTitle>Your feedback</CardTitle>
					<CardDescription>
						{feedback.length === 0
							? "Nothing submitted yet"
							: `${feedback.length} item${feedback.length === 1 ? "" : "s"} submitted`}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
					{feedback.length === 0 ? (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<MousePointerClick />
								</EmptyMedia>
								<EmptyTitle>No feedback yet</EmptyTitle>
								<EmptyDescription>
									Visit one of your websites and click the Reviseo button to
									annotate a screenshot and submit your first feedback.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : (
						feedback.map((item) => {
							const statusConfig = STATUS_CONFIG[item.status];
							const StatusIcon = statusConfig.icon;
							return (
								<div
									key={item.id}
									className="flex flex-col gap-2 rounded-lg border border-border p-4"
								>
									<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
										<div className="flex min-w-0 flex-col gap-1">
											<span className="truncate font-medium">{item.title}</span>
											<span className="flex items-center gap-1.5 text-muted-foreground text-xs">
												<MessageCircle className="size-3" />
												{item.website.name} · {moment(item.createdAt).fromNow()}
											</span>
										</div>
										<div className="flex shrink-0 items-center gap-2">
											<Badge variant={TYPE_BADGE_MAP[item.type]}>
												{TYPE_CONFIG[item.type].label}
											</Badge>
											{(() => {
												const approvalConfig = APPROVAL_CONFIG[item.approval];
												return approvalConfig ? (
													<Badge variant={approvalConfig.badge}>
														{approvalConfig.label}
													</Badge>
												) : null;
											})()}
											<Badge variant={STATUS_BADGE_MAP[item.status]}>
												<StatusIcon className="mr-1 size-3" />
												{statusConfig.label}
											</Badge>
										</div>
									</div>
									{item.approval === "REJECTED" && item.approvalNote && (
										<p className="text-destructive text-xs">
											Note from your team lead: {item.approvalNote}
										</p>
									)}
									{/* Edit-tool batches show their changes inline so the
									    client can track which suggestions were applied. */}
									{item.type === "TEXT_EDIT" && item.textEdits.length > 0 && (
										<TextEditList edits={item.textEdits} readOnly />
									)}
									{item.type === "STYLE_EDIT" && item.styleEdits.length > 0 && (
										<StyleEditList edits={item.styleEdits} readOnly />
									)}
									{item.type === "IMAGE_EDIT" && item.imageEdits.length > 0 && (
										<ImageEditList edits={item.imageEdits} readOnly />
									)}
								</div>
							);
						})
					)}
				</CardContent>
			</Card>
		</div>
	);
}
