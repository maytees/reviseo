import { Globe, Mail, PersonStanding } from "lucide-react";
import moment from "moment";
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
	// Get clients needing attention
	const attentionNeeded = userData.developerWebsites.flatMap((website) => {
		const items = [];

		// Check for pending invites
		const pendingInvites = website.invites.filter(
			(invite) => invite.status === "PENDING" && !invite.acceptedAt,
		);

		for (const invite of pendingInvites) {
			const since = moment(invite.createdAt).fromNow();

			items.push({
				id: invite.id,
				type: "pending_invite",
				email: invite.email,
				websiteName: website.name,
				websiteUrl: website.url,
				since,
				inviteId: invite.id,
			});
		}

		// Check if website has a client but they haven't submitted feedback
		if (website.clientId && website.feedback.length === 0) {
			items.push({
				id: `${website.id}-no-feedback`,
				type: "no_feedback",
				clientName: website.client?.name,
				email: website.client?.email,
				websiteName: website.name,
				websiteUrl: website.url,
				websiteId: website.id,
			});
		}

		// Check if website exists but no client invited yet
		if (!website.clientId && website.invites.length === 0) {
			items.push({
				id: `${website.id}-not-invited`,
				type: "not_invited",
				websiteName: website.name,
				websiteUrl: website.url,
				websiteId: website.id,
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
									<CardTitle>{item.websiteName}</CardTitle>
									<CardDescription>{item.websiteUrl}</CardDescription>
								</CardHeader>
								<CardContent className="px-4 space-y-4">
									<div className="space-y-1">
										<p className="px-0.5 text-sm text-muted-foreground">
											{item.type === "pending_invite" &&
												`Invited ${item.since} days ago, hasn't logged in`}
											{item.type === "no_feedback" &&
												`No feedback submitted yet`}
											{item.type === "not_invited" &&
												`Client hasn't been invited yet`}
										</p>
										<Button size="sm" variant="outline" className="w-full ">
											<Mail />
											{item.type === "not_invited"
												? "Send Invite"
												: "Resend Invite"}
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
