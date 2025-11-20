import { ArrowRight, Globe, PersonStanding } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import type { UserDataType } from "@/app/data/user/get-user-data";
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

const ClientAttention = ({
	userData,
}: {
	userData: NonNullable<UserDataType>;
}) => {
	// Get websites needing attention with their type
	const attentionNeeded = userData.developerWebsites.flatMap((website) => {
		const items: Array<{
			id: string;
			type: "pending_invite" | "no_feedback" | "not_invited";
			since?: string;
			website: typeof website;
		}> = [];

		// Check for pending invites
		const pendingInvites = website.invites.filter(
			(invite) => invite.status === "PENDING" && !invite.acceptedAt,
		);

		if (pendingInvites.length > 0) {
			const since = moment(pendingInvites[0].createdAt).fromNow();

			items.push({
				id: `${website.id}-pending-invite`,
				type: "pending_invite",
				since,
				website,
			});
		}

		// Check if website has a client but they haven't submitted feedback
		if (website.clientId && website.feedback.length === 0) {
			items.push({
				id: `${website.id}-no-feedback`,
				type: "no_feedback",
				website,
			});
		}

		// Check if website exists but no client invited yet
		if (!website.clientId && website.invites.length === 0) {
			items.push({
				id: `${website.id}-not-invited`,
				type: "not_invited",
				website,
			});
		}

		return items;
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Catch Up</CardTitle>
				<CardDescription>
					Get quick insight into what your clients are up to, and not.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-2.5">
				{userData?.developerWebsites.length === 0 ? (
					// No websites at all - different empty state
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Globe />
							</EmptyMedia>
							<EmptyTitle>No Websites Yet</EmptyTitle>
							<EmptyDescription>
								Create your first website to start receiving feedback from
								clients.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : !attentionNeeded || attentionNeeded.length === 0 ? (
					// Has websites but no clients needing attention
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<PersonStanding />
							</EmptyMedia>
							<EmptyTitle>All Caught Up!</EmptyTitle>
							<EmptyDescription>
								No clients need your attention right now. All invites have been
								accepted and feedback is flowing smoothly.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					// Show clients needing attention
					<div className="flex gap-3 overflow-x-auto lg:flex-col">
						{attentionNeeded.map((item) => (
							<Card
								key={item.id}
								className="gap-3.5 py-4 border bg-background/30 border-background/40 min-w-[260px] shrink-0"
							>
								<CardHeader className="px-4">
									<CardTitle>{item.website.name}</CardTitle>
									<CardDescription>{item.website.url}</CardDescription>
								</CardHeader>
								<CardContent className="px-4 space-y-4">
									<div className="space-y-1">
										<p className="px-0.5 text-sm text-muted-foreground">
											{item.type === "pending_invite" &&
												`Invited ${item.since}, hasn't logged in`}
											{item.type === "no_feedback" &&
												`No feedback submitted yet`}
											{item.type === "not_invited" &&
												`Client hasn't been invited yet`}
										</p>

										<Button size="sm" variant="outline" className="w-full" asChild>
											<Link href={`/dashboard/websites/${item.website.id}?tab=client`}>
												View Client
												<ArrowRight />
											</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default ClientAttention;
