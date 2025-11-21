"use client";

import {
	CalendarIcon,
	MailIcon,
	MailPlus,
	MoreVertical,
	RotateCw,
	XCircle,
} from "lucide-react";
import moment from "moment";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { WebsiteDataTypeNonNullable } from "@/app/data/website/get-website-by-id-and-dev-id";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { tryCatch } from "@/lib/try-catch";
import { INVITE_STATUS_BADGE_MAP, INVITE_STATUS_CONFIG } from "@/lib/types";
import { resendInvite, revokeInvite } from "./actions";

interface InvitesCardProps {
	website: WebsiteDataTypeNonNullable;
}

const InvitesCard = ({ website }: InvitesCardProps) => {
	const invites = website.invites || [];
	const [isPending, startTransition] = useTransition();
	const [loadingInviteId, setLoadingInviteId] = useState<string | null>(null);

	const handleResendInvite = (inviteId: string) => {
		setLoadingInviteId(inviteId);
		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				resendInvite(inviteId, website.id),
			);

			if (error) {
				toast.error("An unexpected error occurred. Please try again.");
				setLoadingInviteId(null);
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
			setLoadingInviteId(null);
		});
	};

	const handleRevokeInvite = (inviteId: string) => {
		setLoadingInviteId(inviteId);
		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				revokeInvite(inviteId, website.id),
			);

			if (error) {
				toast.error("An unexpected error occurred. Please try again.");
				setLoadingInviteId(null);
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
			setLoadingInviteId(null);
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Invitations</CardTitle>
				<CardDescription>
					Manage all invitations sent for this website
				</CardDescription>
			</CardHeader>
			<CardContent>
				{invites.length === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<MailIcon />
							</EmptyMedia>
							<EmptyTitle>No Invitations Sent</EmptyTitle>
							<EmptyDescription>
								You haven't sent any invitations yet. Invite a client to start
								collecting feedback.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					<div className="space-y-3">
						{invites
							.sort((a, b) => +b.createdAt - +a.createdAt)
							.map((invite) => {
								const StatusIcon = INVITE_STATUS_CONFIG[invite.status].icon;
								const isExpired =
									invite.expiresAt && new Date(invite.expiresAt) < new Date();
								const canResend =
									invite.status === "PENDING" || invite.status === "REVOKED";

								return (
									<div
										key={invite.id}
										className="flex flex-col gap-3 rounded-lg border bg-card/30 p-4"
									>
										{/* Email and Status Row */}
										<div className="flex items-start justify-between gap-2">
											<div className="flex min-w-0 flex-1 items-center gap-2">
												<MailIcon className="size-4 shrink-0 text-muted-foreground" />
												<span className="truncate font-medium text-sm">
													{invite.email}
												</span>
											</div>
											<div className="flex shrink-0 items-center gap-2">
												<Badge
													variant={INVITE_STATUS_BADGE_MAP[invite.status]}
													appearance="outline"
													size="sm"
												>
													<StatusIcon className="size-3" />
													<span>
														{INVITE_STATUS_CONFIG[invite.status].label}
													</span>
												</Badge>
												{canResend && (
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="sm"
																mode="icon"
																disabled={
																	isPending && loadingInviteId === invite.id
																}
															>
																<MoreVertical className="size-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() => handleResendInvite(invite.id)}
																disabled={
																	isPending && loadingInviteId === invite.id
																}
															>
																<RotateCw className="size-4" />
																Resend Invite
															</DropdownMenuItem>
															{invite.status === "PENDING" && (
																<DropdownMenuItem
																	variant="destructive"
																	onClick={() => handleRevokeInvite(invite.id)}
																	disabled={
																		isPending && loadingInviteId === invite.id
																	}
																>
																	<XCircle className="size-4" />
																	Revoke Invite
																</DropdownMenuItem>
															)}
														</DropdownMenuContent>
													</DropdownMenu>
												)}
											</div>
										</div>

										{/* Dates Row */}
										<div className="flex flex-wrap gap-4 text-muted-foreground text-xs">
											<div className="flex items-center gap-1.5">
												<MailPlus className="size-3" />
												<span>
													Sent {moment(invite.createdAt).format("MMM D, YYYY")}
												</span>
											</div>

											{invite.acceptedAt && (
												<div className="flex items-center gap-1.5">
													<CalendarIcon className="size-3 text-emerald-500" />
													<span>
														Accepted{" "}
														{moment(invite.acceptedAt).format("MMM D, YYYY")}
													</span>
												</div>
											)}

											{invite.expiresAt && (
												<div className="flex items-center gap-1.5">
													<CalendarIcon
														className={`size-3 ${isExpired ? "text-red-500" : ""}`}
													/>
													<span className={isExpired ? "text-red-500" : ""}>
														{isExpired ? "Expired" : "Expires"}{" "}
														{moment(invite.expiresAt).format("MMM D, YYYY")}
													</span>
												</div>
											)}
										</div>
									</div>
								);
							})}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default InvitesCard;
