"use client";

import { Clock, RefreshCw, X } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import type { UserDataType } from "@/app/data/user/get-user-data";
import {
	resendInvite,
	revokeInvite,
} from "@/app/(main)/(dashboard)/dashboard/websites/[id]/_components/client/actions";
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
import { tryCatch } from "@/lib/try-catch";

type Website = NonNullable<UserDataType>["developerWebsites"][number];
type Invite = Website["invites"][number];

export default function PendingClientInvites({
	items,
}: {
	items: { invite: Invite; website: Website }[];
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleResend = (invite: Invite, website: Website) => {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				resendInvite(invite.id, website.id),
			);
			if (error || result?.status === "error") {
				toast.error(result?.message ?? "Failed to resend invite");
				return;
			}
			toast.success(`Invite resent to ${invite.email}`);
			router.refresh();
		});
	};

	const handleRevoke = (invite: Invite, website: Website) => {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				revokeInvite(invite.id, website.id),
			);
			if (error || result?.status === "error") {
				toast.error(result?.message ?? "Failed to revoke invite");
				return;
			}
			toast.success("Invite revoked");
			router.refresh();
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Pending Invites</CardTitle>
				<CardDescription>
					Client invitations that haven't been accepted yet
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Email</TableHead>
							<TableHead>Website</TableHead>
							<TableHead className="hidden sm:table-cell">Expires</TableHead>
							<TableHead className="w-24" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map(({ invite, website }) => (
							<TableRow key={invite.id}>
								<TableCell className="font-medium text-sm">
									{invite.email}
								</TableCell>
								<TableCell className="text-sm">{website.name}</TableCell>
								<TableCell className="hidden sm:table-cell">
									<span className="flex items-center gap-1.5 text-muted-foreground text-sm">
										<Clock className="size-3.5" />
										{invite.expiresAt
											? moment(invite.expiresAt).fromNow()
											: "—"}
									</span>
								</TableCell>
								<TableCell>
									<div className="flex gap-1">
										<Button
											variant="ghost"
											size="icon"
											className="size-8"
											title="Resend invite"
											disabled={isPending}
											onClick={() => handleResend(invite, website)}
										>
											<RefreshCw className="size-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="size-8"
											title="Revoke invite"
											disabled={isPending}
											onClick={() => handleRevoke(invite, website)}
										>
											<X className="size-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
