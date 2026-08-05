import {
	CheckCircleIcon,
	ClockIcon,
	ExternalLink,
	Globe,
	InboxIcon,
	SendIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/app/data/require-user";
import { feedbackSelect } from "@/app/data/selects";
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
import ApprovalQueue from "./_components/ApprovalQueue";
import FeedbackBoard from "./_components/FeedbackBoard";
import SignOutButton from "./_components/SignOutButton";
import StatTile from "./_components/StatTile";
import TeamManager from "./_components/TeamManager";

export const metadata: Metadata = {
	title: "Your Feedback",
};

export default async function ClientDashboard() {
	const user = await requireUser();

	const [websites, leadRows] = await Promise.all([
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
		prisma.websiteClient.findMany({
			where: { userId: user.id, role: "lead" },
			select: { websiteId: true },
		}),
	]);

	const leadWebsiteIds = leadRows.map((row) => row.websiteId);
	const isLead = leadWebsiteIds.length > 0;

	const [boardFeedback, teams, pendingApprovals] = await Promise.all([
		prisma.feedback.findMany({
			// Leads also see teammates' submissions on sites they lead — but only
			// ones that actually reached the developer. Teammates' PENDING items
			// live in the approval queue; their REJECTED ones stay private.
			where: isLead
				? {
						OR: [
							{ authorId: user.id },
							{
								websiteId: { in: leadWebsiteIds },
								authorId: { not: user.id },
								approval: { in: ["DIRECT", "APPROVED"] },
							},
						],
					}
				: { authorId: user.id },
			select: feedbackSelect,
			orderBy: { createdAt: "desc" },
			take: 60,
		}),
		isLead
			? prisma.website.findMany({
					where: { id: { in: leadWebsiteIds } },
					select: {
						id: true,
						name: true,
						clients: {
							select: {
								id: true,
								userId: true,
								role: true,
								trusted: true,
								canAnnotate: true,
								canText: true,
								canStyle: true,
								canImage: true,
								notifyDecisions: true,
								user: { select: { name: true, email: true } },
							},
							orderBy: { createdAt: "asc" },
						},
					},
				})
			: [],
		isLead
			? prisma.feedback.findMany({
					where: {
						websiteId: { in: leadWebsiteIds },
						approval: "PENDING",
						authorId: { not: user.id },
					},
					select: feedbackSelect,
					orderBy: { createdAt: "asc" },
				})
			: [],
	]);

	// Rejected items never reached the developer, so they don't belong in the
	// lifecycle columns — the board shows them in a separate "Needs changes"
	// strip (always the viewer's own: teammates' rejections are excluded above).
	const rejectedOwn = boardFeedback.filter(
		(f) => f.approval === "REJECTED" && f.author?.id === user.id,
	);
	const boardItems = boardFeedback.filter((f) => f.approval !== "REJECTED");

	const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
	const newThisWeek = boardItems.filter((f) => f.createdAt >= weekAgo).length;
	// No resolvedAt column exists — the last write to a RESOLVED row is almost
	// always the status flip, so updatedAt is the honest approximation.
	const resolvedThisWeek = boardItems.filter(
		(f) => f.status === "RESOLVED" && f.updatedAt >= weekAgo,
	).length;
	const awaitingOwn = boardItems.filter(
		(f) => f.approval === "PENDING" && f.author?.id === user.id,
	).length;
	const resolvedTotal = boardItems.filter(
		(f) => f.status === "RESOLVED",
	).length;

	const header = (
		<div className="flex flex-wrap items-start justify-between gap-4">
			<div className="flex flex-col gap-0.5">
				<h1 className="font-bold font-caudex text-3xl">
					{user.name ? `Welcome, ${user.name}` : "Welcome"}
				</h1>
				<p className="text-muted-foreground text-sm">
					{isLead
						? `You lead the review team for ${teams.length === 1 ? teams[0].name : `${teams.length} websites`}.`
						: "Track the feedback you've submitted and see what's been resolved."}
				</p>
			</div>
			<div className="flex items-center gap-2">
				{isLead && (
					<Badge variant="primary" appearance="light">
						Team lead
					</Badge>
				)}
				<SignOutButton />
			</div>
		</div>
	);

	if (websites.length === 0) {
		return (
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
				{header}
				<Card>
					<CardContent>
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
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
			{header}

			{/* Summary strip */}
			<div className="grid gap-3 sm:grid-cols-3">
				{isLead ? (
					<>
						<StatTile
							icon={ClockIcon}
							label="Awaiting your approval"
							value={pendingApprovals.length}
							tone="amber"
							emphasize={pendingApprovals.length > 0}
						/>
						<StatTile
							icon={InboxIcon}
							label="New this week"
							value={newThisWeek}
							tone="blue"
						/>
						<StatTile
							icon={CheckCircleIcon}
							label="Resolved this week"
							value={resolvedThisWeek}
							tone="emerald"
						/>
					</>
				) : (
					<>
						<StatTile
							icon={SendIcon}
							label="Submitted"
							value={boardItems.length + rejectedOwn.length}
							tone="violet"
						/>
						<StatTile
							icon={ClockIcon}
							label="Awaiting approval"
							value={awaitingOwn}
							tone="amber"
							emphasize={awaitingOwn > 0}
						/>
						<StatTile
							icon={CheckCircleIcon}
							label="Resolved"
							value={resolvedTotal}
							tone="emerald"
						/>
					</>
				)}
			</div>

			{/* Lead-only: approval queue — the one thing a lead must act on */}
			{isLead && pendingApprovals.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Needs your review</CardTitle>
						<CardDescription>
							{pendingApprovals.length} submission
							{pendingApprovals.length === 1 ? "" : "s"} from your team, waiting
							for your approval before the developer sees them
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ApprovalQueue items={pendingApprovals} />
					</CardContent>
				</Card>
			)}

			{/* Read-only lifecycle board */}
			<Card>
				<CardHeader>
					<CardTitle>Where things stand</CardTitle>
					<CardDescription>
						{isLead
							? "Every submission from you and your team, from new to resolved. The developer moves items along — click any card for details."
							: "Your submissions, from new to resolved. The developer moves items along — click any card for details."}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FeedbackBoard
						items={boardItems}
						rejectedItems={rejectedOwn}
						websites={websites.map((w) => ({ id: w.id, name: w.name }))}
						viewerId={user.id}
						isLead={isLead}
					/>
				</CardContent>
			</Card>

			{/* Lead-only: team management */}
			{isLead && teams.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Your team</CardTitle>
						<CardDescription>
							Invite teammates to review, choose which tools they can use, and
							mark trusted people whose feedback skips your approval.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-8">
						{teams.map((team) => (
							<TeamManager
								key={team.id}
								websiteId={team.id}
								websiteName={team.name}
								members={team.clients}
								notifyDecisions={
									team.clients.find((c) => c.userId === user.id)
										?.notifyDecisions ?? false
								}
							/>
						))}
					</CardContent>
				</Card>
			)}

			{/* Websites strip */}
			<Card>
				<CardHeader>
					<CardTitle>Websites you review</CardTitle>
					<CardDescription>
						Open a site and click the Reviseo button to leave feedback
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					{websites.map((website) => (
						<div
							key={website.id}
							className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3"
						>
							<div className="flex min-w-0 items-center gap-3">
								<div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
									<Globe className="size-4 text-primary" />
								</div>
								<div className="flex min-w-0 flex-col">
									<span className="truncate font-medium text-sm">
										{website.name}
									</span>
									<span className="truncate text-muted-foreground text-xs">
										Managed by{" "}
										{website.developer.name || website.developer.email}
									</span>
								</div>
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
					))}
				</CardContent>
			</Card>
		</div>
	);
}
