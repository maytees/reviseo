"use client";

import { Clock, X } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";

type Invitation = {
	id: string;
	email: string;
	role: string | null;
	status: string;
	expiresAt: Date;
	user: { name: string };
};

export default function PendingInvitations({
	invitations,
	canManage,
}: {
	invitations: Invitation[];
	canManage: boolean;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const cancelInvitation = (invitation: Invitation) => {
		startTransition(async () => {
			const { error } = await authClient.organization.cancelInvitation({
				invitationId: invitation.id,
			});

			if (error) {
				toast.error(error.message ?? "Failed to cancel invitation");
				return;
			}

			toast.success(`Invitation to ${invitation.email} canceled`);
			router.refresh();
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Pending Invitations</CardTitle>
				<CardDescription>
					Invitations that haven't been accepted yet
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead className="hidden sm:table-cell">Invited by</TableHead>
							<TableHead className="hidden sm:table-cell">Expires</TableHead>
							{canManage && <TableHead className="w-10" />}
						</TableRow>
					</TableHeader>
					<TableBody>
						{invitations.map((invitation) => (
							<TableRow key={invitation.id}>
								<TableCell className="font-medium text-sm">
									{invitation.email}
								</TableCell>
								<TableCell>
									<Badge variant="secondary" className="capitalize">
										{invitation.role ?? "member"}
									</Badge>
								</TableCell>
								<TableCell className="hidden text-muted-foreground text-sm sm:table-cell">
									{invitation.user.name}
								</TableCell>
								<TableCell className="hidden sm:table-cell">
									<span className="flex items-center gap-1.5 text-muted-foreground text-sm">
										<Clock className="size-3.5" />
										{moment(invitation.expiresAt).fromNow()}
									</span>
								</TableCell>
								{canManage && (
									<TableCell>
										<Button
											variant="ghost"
											size="icon"
											className="size-8"
											disabled={isPending}
											onClick={() => cancelInvitation(invitation)}
											title="Cancel invitation"
										>
											<X className="size-4" />
										</Button>
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
