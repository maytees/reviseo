"use client";

import { CalendarIcon, MailIcon } from "lucide-react";
import moment from "moment";
import type { ReactNode } from "react";
import type { WebsiteDataTypeNonNullable } from "@/app/data/website/get-website-by-id-and-dev-id";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	INVITE_STATUS_BADGE_MAP,
	INVITE_STATUS_CONFIG,
} from "@/lib/types";

interface InvitesDialogProps {
	website: WebsiteDataTypeNonNullable;
	children: ReactNode;
}

const InvitesDialog = ({ website, children }: InvitesDialogProps) => {
	const invites = website.invites || [];

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Client Invitations</DialogTitle>
					<DialogDescription>
						View all invitations sent to clients for {website.name}
					</DialogDescription>
				</DialogHeader>

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
					<ScrollArea className="h-[400px] pr-4">
						<div className="space-y-4">
							{invites.map((invite, index) => {
								const StatusIcon = INVITE_STATUS_CONFIG[invite.status].icon;
								const isExpired =
									invite.expiresAt && new Date(invite.expiresAt) < new Date();

								return (
									<div key={invite.id}>
										<div className="flex flex-col gap-3 p-4 border rounded-lg bg-card/30">
											{/* Email and Status Row */}
											<div className="flex items-start justify-between gap-2">
												<div className="flex items-center gap-2 min-w-0 flex-1">
													<MailIcon className="size-4 text-muted-foreground shrink-0" />
													<span className="text-sm font-medium truncate">
														{invite.email}
													</span>
												</div>
												<Badge
													variant={INVITE_STATUS_BADGE_MAP[invite.status]}
													appearance="outline"
													size="sm"
													className="shrink-0"
												>
													<StatusIcon className="size-3" />
													<span>{INVITE_STATUS_CONFIG[invite.status].label}</span>
												</Badge>
											</div>

											{/* Dates Row */}
											<div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
												<div className="flex items-center gap-1.5">
													<CalendarIcon className="size-3" />
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

										{index < invites.length - 1 && <Separator className="my-2" />}
									</div>
								);
							})}
						</div>
					</ScrollArea>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default InvitesDialog;
