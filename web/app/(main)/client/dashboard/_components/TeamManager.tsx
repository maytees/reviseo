"use client";

import { ShieldCheckIcon, Trash2Icon, UserRoundPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	inviteClientMember,
	type MemberPermissions,
	removeClientMember,
	updateClientMember,
	updateLeadNotifyDecisions,
} from "../actions";

export type TeamMemberRow = {
	id: string;
	role: string;
	trusted: boolean;
	canAnnotate: boolean;
	canText: boolean;
	canStyle: boolean;
	canImage: boolean;
	user: { name: string | null; email: string };
};

const PERMISSION_FIELDS = [
	{ key: "canAnnotate", label: "Annotate" },
	{ key: "canText", label: "Text" },
	{ key: "canStyle", label: "Style" },
	{ key: "canImage", label: "Images" },
] as const;

const initials = (name: string | null, email: string) => {
	const source = name?.trim() || email;
	const parts = source.split(/\s+/).filter(Boolean);
	if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
	return source.slice(0, 2).toUpperCase();
};

const permsOf = (m: TeamMemberRow): MemberPermissions => ({
	trusted: m.trusted,
	canAnnotate: m.canAnnotate,
	canText: m.canText,
	canStyle: m.canStyle,
	canImage: m.canImage,
});

const MemberRow = ({ member }: { member: TeamMemberRow }) => {
	const router = useRouter();
	const [perms, setPerms] = useState<MemberPermissions>(permsOf(member));
	const [isPending, startTransition] = useTransition();

	const save = (next: MemberPermissions) => {
		const previous = perms;
		setPerms(next);
		startTransition(async () => {
			const result = await updateClientMember(member.id, next);
			if (result.status === "error") {
				setPerms(previous);
				toast.error(result.message);
			}
		});
	};

	const remove = () => {
		startTransition(async () => {
			const result = await removeClientMember(member.id);
			if (result.status === "error") toast.error(result.message);
			else {
				toast.success(result.message);
				router.refresh();
			}
		});
	};

	const isLead = member.role === "lead";

	return (
		<div className="flex flex-col gap-2 rounded-lg border border-border p-3">
			<div className="flex items-center justify-between gap-2">
				<div className="flex min-w-0 items-center gap-2.5">
					<Avatar className="size-8">
						<AvatarFallback className="text-xs">
							{initials(member.user.name, member.user.email)}
						</AvatarFallback>
					</Avatar>
					<div className="flex min-w-0 flex-col">
						<span className="truncate font-medium text-sm">
							{member.user.name || member.user.email}
						</span>
						<span className="truncate text-muted-foreground text-xs">
							{member.user.email}
						</span>
					</div>
				</div>
				<div className="flex shrink-0 items-center gap-1.5">
					{isLead ? (
						<Badge variant="primary">Lead</Badge>
					) : (
						<>
							{perms.trusted && (
								<Badge variant="success">
									<ShieldCheckIcon className="mr-1 size-3" />
									Trusted
								</Badge>
							)}
							<Button
								variant="ghost"
								size="icon"
								className="size-7 text-muted-foreground hover:text-destructive"
								disabled={isPending}
								onClick={remove}
								title="Remove from team"
							>
								<Trash2Icon className="size-3.5" />
							</Button>
						</>
					)}
				</div>
			</div>
			{!isLead && (
				<div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-border/60 border-t pt-2.5">
					<span className="text-muted-foreground text-xs">Can use</span>
					{PERMISSION_FIELDS.map((field) => (
						<label
							key={field.key}
							htmlFor={`${member.id}-${field.key}`}
							className="flex cursor-pointer items-center gap-1.5 text-xs"
						>
							<Checkbox
								id={`${member.id}-${field.key}`}
								checked={perms[field.key]}
								disabled={isPending}
								onCheckedChange={(checked) =>
									save({ ...perms, [field.key]: checked === true })
								}
							/>
							{field.label}
						</label>
					))}
					<span
						aria-hidden
						className="hidden h-4 w-px bg-border sm:inline-block"
					/>
					<Tooltip>
						<TooltipTrigger asChild>
							<label
								htmlFor={`${member.id}-trusted`}
								className="flex cursor-pointer items-center gap-1.5 text-xs"
							>
								<Checkbox
									id={`${member.id}-trusted`}
									checked={perms.trusted}
									disabled={isPending}
									onCheckedChange={(checked) =>
										save({ ...perms, trusted: checked === true })
									}
								/>
								Trusted
							</label>
						</TooltipTrigger>
						<TooltipContent>
							Trusted members skip your approval — their feedback goes straight
							to the developer.
						</TooltipContent>
					</Tooltip>
				</div>
			)}
		</div>
	);
};

const InviteMemberDialog = ({ websiteId }: { websiteId: string }) => {
	const router = useRouter();
	const emailId = useId();
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [perms, setPerms] = useState<MemberPermissions>({
		trusted: false,
		canAnnotate: true,
		canText: true,
		canStyle: true,
		canImage: true,
	});
	const [isPending, startTransition] = useTransition();

	const submit = () => {
		startTransition(async () => {
			const result = await inviteClientMember(websiteId, email.trim(), perms);
			if (result.status === "error") toast.error(result.message);
			else {
				toast.success(result.message);
				setOpen(false);
				setEmail("");
				router.refresh();
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" variant="outline">
					<UserRoundPlusIcon className="size-4" />
					Invite teammate
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Invite a teammate</DialogTitle>
					<DialogDescription>
						They'll get an email invitation to review this website with the
						permissions you pick. Their feedback comes to you for approval first
						— unless you mark them trusted.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<label className="font-medium text-sm" htmlFor={emailId}>
							Email
						</label>
						<Input
							id={emailId}
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="teammate@company.com"
							disabled={isPending}
							autoComplete="off"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<span className="font-medium text-sm">Can use</span>
						<div className="flex flex-wrap gap-x-4 gap-y-2">
							{PERMISSION_FIELDS.map((field) => (
								<label
									key={field.key}
									htmlFor={`invite-${field.key}`}
									className="flex cursor-pointer items-center gap-1.5 text-sm"
								>
									<Checkbox
										id={`invite-${field.key}`}
										checked={perms[field.key]}
										disabled={isPending}
										onCheckedChange={(checked) =>
											setPerms({ ...perms, [field.key]: checked === true })
										}
									/>
									{field.label}
								</label>
							))}
						</div>
					</div>
					<label
						htmlFor="invite-trusted"
						className="flex cursor-pointer items-start gap-2 text-sm"
					>
						<Checkbox
							id="invite-trusted"
							checked={perms.trusted}
							disabled={isPending}
							onCheckedChange={(checked) =>
								setPerms({ ...perms, trusted: checked === true })
							}
							className="mt-0.5"
						/>
						<span>
							Trusted — their feedback skips your approval and goes straight to
							the developer
						</span>
					</label>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						disabled={isPending}
						onClick={() => setOpen(false)}
					>
						Cancel
					</Button>
					<Button disabled={isPending || !email.trim()} onClick={submit}>
						{isPending ? "Sending…" : "Send invitation"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

/** Off by default: whether teammates get result emails on approve/reject. */
const DecisionEmailToggle = ({
	websiteId,
	initialEnabled,
}: {
	websiteId: string;
	initialEnabled: boolean;
}) => {
	const switchId = useId();
	const [enabled, setEnabled] = useState(initialEnabled);
	const [isPending, startTransition] = useTransition();

	const toggle = (next: boolean) => {
		const previous = enabled;
		setEnabled(next);
		startTransition(async () => {
			const result = await updateLeadNotifyDecisions(websiteId, next);
			if (result.status === "error") {
				setEnabled(previous);
				toast.error(result.message);
			}
		});
	};

	return (
		<label
			htmlFor={switchId}
			className="flex cursor-pointer items-center gap-2 text-muted-foreground text-xs"
		>
			<Switch
				id={switchId}
				size="sm"
				checked={enabled}
				disabled={isPending}
				onCheckedChange={toggle}
			/>
			Email teammates when you approve or reject their submissions
		</label>
	);
};

/** Lead-only: manage one website's client team. */
const TeamManager = ({
	websiteId,
	websiteName,
	members,
	notifyDecisions,
}: {
	websiteId: string;
	websiteName: string;
	members: TeamMemberRow[];
	notifyDecisions: boolean;
}) => {
	// Lead first, then everyone else in their original (join-date) order.
	const sorted = [
		...members.filter((m) => m.role === "lead"),
		...members.filter((m) => m.role !== "lead"),
	];
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between gap-2">
				<span className="font-caudex font-semibold">{websiteName}</span>
				<InviteMemberDialog websiteId={websiteId} />
			</div>
			<DecisionEmailToggle
				websiteId={websiteId}
				initialEnabled={notifyDecisions}
			/>
			{sorted.map((member) => (
				<MemberRow key={member.id} member={member} />
			))}
		</div>
	);
};

export default TeamManager;
