import { UserRoundPlus } from "lucide-react";
import type { Metadata } from "next";
import { getUserData } from "@/app/data/user/get-user-data";
import { Button } from "@/components/ui/button";
import DashboardFooter from "../_components/DashboardFooter";
import InviteClientDialog from "../_components/InviteClientDialog";
import ClientsList from "./_components/ClientsList";
import PendingClientInvites from "./_components/PendingClientInvites";

export const metadata: Metadata = {
	title: "Clients",
};

export default async function ClientsPage() {
	const userData = await getUserData();

	if (!userData) return null;

	const websitesWithClients = userData.developerWebsites.filter(
		(website) => website.client,
	);
	const pendingInvites = userData.developerWebsites.flatMap((website) =>
		website.invites
			.filter((invite) => invite.status === "PENDING")
			.map((invite) => ({ invite, website })),
	);

	return (
		<div className="flex flex-col gap-8">
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-0.5">
					<h1 className="font-bold font-caudex text-3xl">Clients</h1>
					<p className="text-muted-foreground text-sm">
						The people giving feedback on your websites — one client per
						website, invited by email.
					</p>
				</div>
				<InviteClientDialog userData={userData}>
					<Button>
						<UserRoundPlus />
						Invite Client
					</Button>
				</InviteClientDialog>
			</div>

			<ClientsList websites={websitesWithClients} />

			{pendingInvites.length > 0 && (
				<PendingClientInvites items={pendingInvites} />
			)}

			<DashboardFooter />
		</div>
	);
}
