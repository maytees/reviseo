import type { Metadata } from "next";
import { getTeamData } from "@/app/data/org/get-team";
import DashboardFooter from "../_components/DashboardFooter";
import InviteMemberDialog from "./_components/InviteMemberDialog";
import PendingInvitations from "./_components/PendingInvitations";
import TeamMembers from "./_components/TeamMembers";
import WorkspaceSettings from "./_components/WorkspaceSettings";

export const metadata: Metadata = {
	title: "Team",
};

export default async function TeamPage() {
	const team = await getTeamData();
	const canManage =
		team.currentRole === "owner" || team.currentRole === "admin";

	return (
		<div className="flex flex-col gap-8">
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-0.5">
					<h1 className="font-bold font-caudex text-3xl">Team</h1>
					<p className="text-muted-foreground text-sm">
						Manage who has access to the{" "}
						<span className="font-medium text-foreground">
							{team.organization.name}
						</span>{" "}
						workspace.
					</p>
				</div>
				{canManage && <InviteMemberDialog />}
			</div>

			<TeamMembers
				members={team.members}
				currentUserId={team.currentUserId}
				currentRole={team.currentRole}
			/>

			{team.invitations.length > 0 && (
				<PendingInvitations
					invitations={team.invitations}
					canManage={canManage}
				/>
			)}

			<WorkspaceSettings
				organization={team.organization}
				currentRole={team.currentRole}
			/>

			<DashboardFooter />
		</div>
	);
}
