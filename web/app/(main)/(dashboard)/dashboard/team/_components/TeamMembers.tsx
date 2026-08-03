"use client";

import { Crown, MoreHorizontal, Shield, User, UserMinus } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

type Member = {
	id: string;
	role: string;
	createdAt: Date;
	user: {
		id: string;
		name: string;
		email: string;
		image: string | null;
	};
};

const ROLE_META: Record<
	string,
	{ label: string; icon: typeof Crown; badge: "primary" | "info" | "secondary" }
> = {
	owner: { label: "Owner", icon: Crown, badge: "primary" },
	admin: { label: "Admin", icon: Shield, badge: "info" },
	member: { label: "Member", icon: User, badge: "secondary" },
};

export default function TeamMembers({
	members,
	currentUserId,
	currentRole,
}: {
	members: Member[];
	currentUserId: string;
	currentRole: string;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [removeTarget, setRemoveTarget] = useState<Member | null>(null);

	const canManage = currentRole === "owner" || currentRole === "admin";

	const changeRole = (member: Member, role: "admin" | "member") => {
		startTransition(async () => {
			const { error } = await authClient.organization.updateMemberRole({
				memberId: member.id,
				role,
			});

			if (error) {
				toast.error(error.message ?? "Failed to change role");
				return;
			}

			toast.success(`${member.user.name} is now ${ROLE_META[role].label}`);
			router.refresh();
		});
	};

	const removeMember = (member: Member) => {
		startTransition(async () => {
			const { error } = await authClient.organization.removeMember({
				memberIdOrEmail: member.id,
			});

			if (error) {
				toast.error(error.message ?? "Failed to remove member");
				return;
			}

			toast.success(`${member.user.name} removed from workspace`);
			setRemoveTarget(null);
			router.refresh();
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Members</CardTitle>
				<CardDescription>
					{members.length} {members.length === 1 ? "person" : "people"} in this
					workspace
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Member</TableHead>
							<TableHead>Role</TableHead>
							<TableHead className="hidden sm:table-cell">Joined</TableHead>
							{canManage && <TableHead className="w-10" />}
						</TableRow>
					</TableHeader>
					<TableBody>
						{members.map((member) => {
							const meta = ROLE_META[member.role] ?? ROLE_META.member;
							const RoleIcon = meta.icon;
							const isSelf = member.user.id === currentUserId;
							const isOwnerRow = member.role === "owner";
							// Admins can manage members; only owners can manage admins.
							const rowManageable =
								canManage &&
								!isSelf &&
								!isOwnerRow &&
								(currentRole === "owner" || member.role === "member");

							return (
								<TableRow key={member.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="size-8">
												<AvatarImage
													src={member.user.image ?? undefined}
													alt={member.user.name}
												/>
												<AvatarFallback>
													{member.user.name?.charAt(0).toUpperCase() || "?"}
												</AvatarFallback>
											</Avatar>
											<div className="flex flex-col">
												<span className="font-medium text-sm">
													{member.user.name}
													{isSelf && (
														<span className="ml-1.5 text-muted-foreground text-xs">
															(you)
														</span>
													)}
												</span>
												<span className="text-muted-foreground text-xs">
													{member.user.email}
												</span>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant={meta.badge}>
											<RoleIcon className="mr-1 size-3" />
											{meta.label}
										</Badge>
									</TableCell>
									<TableCell className="hidden text-muted-foreground text-sm sm:table-cell">
										{moment(member.createdAt).format("MMM D, YYYY")}
									</TableCell>
									{canManage && (
										<TableCell>
											{rowManageable && (
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="size-8"
															disabled={isPending}
														>
															<MoreHorizontal className="size-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Change role</DropdownMenuLabel>
														{member.role !== "admin" && (
															<DropdownMenuItem
																onClick={() => changeRole(member, "admin")}
															>
																<Shield className="mr-2 size-4" />
																Make Admin
															</DropdownMenuItem>
														)}
														{member.role !== "member" && (
															<DropdownMenuItem
																onClick={() => changeRole(member, "member")}
															>
																<User className="mr-2 size-4" />
																Make Member
															</DropdownMenuItem>
														)}
														<DropdownMenuSeparator />
														<DropdownMenuItem
															variant="destructive"
															onClick={() => setRemoveTarget(member)}
														>
															<UserMinus className="mr-2 size-4" />
															Remove from workspace
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											)}
										</TableCell>
									)}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>

			<AlertDialog
				open={removeTarget !== null}
				onOpenChange={(open) => !open && setRemoveTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Remove {removeTarget?.user.name}?
						</AlertDialogTitle>
						<AlertDialogDescription>
							They'll lose access to every website and all feedback in this
							workspace. You can invite them again later.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							disabled={isPending}
							onClick={() => removeTarget && removeMember(removeTarget)}
						>
							Remove
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
	);
}
