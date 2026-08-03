"use client";

import { Building2, CheckIcon, XIcon } from "lucide-react";
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
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { skipOnboardingAfterJoin } from "./actions";

type InvitationView = {
	id: string;
	email: string;
	role: string;
	organizationName: string;
	inviterName: string;
	expired: boolean;
};

export default function AcceptInvitationCard({
	invitation,
	sessionEmail,
}: {
	invitation: InvitationView;
	sessionEmail: string;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const emailMismatch =
		invitation.email.toLowerCase() !== sessionEmail.toLowerCase();

	const accept = () => {
		startTransition(async () => {
			const { error } = await authClient.organization.acceptInvitation({
				invitationId: invitation.id,
			});

			if (error) {
				toast.error(error.message ?? "Failed to accept invitation");
				return;
			}

			// Joining an existing workspace — no developer onboarding needed.
			await skipOnboardingAfterJoin();

			toast.success(`Welcome to ${invitation.organizationName}!`);
			// Hard navigation: session's active org just changed server-side.
			window.location.assign("/dashboard");
		});
	};

	const reject = () => {
		startTransition(async () => {
			const { error } = await authClient.organization.rejectInvitation({
				invitationId: invitation.id,
			});

			if (error) {
				toast.error(error.message ?? "Failed to decline invitation");
				return;
			}

			toast.success("Invitation declined");
			router.push("/");
		});
	};

	return (
		<Card className="border-border bg-linear-to-br from-card to-card/50 px-3 py-7 shadow-xl backdrop-blur-sm">
			<CardHeader className="space-y-2 py-2 text-center">
				<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
					<Building2 className="size-6 text-primary" />
				</div>
				<CardTitle className="font-bold font-caudex text-2xl">
					Join {invitation.organizationName}
				</CardTitle>
				<CardDescription className="font-inter">
					{invitation.inviterName} invited you to join as{" "}
					<Badge variant="secondary" className="capitalize">
						{invitation.role}
					</Badge>
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col items-center gap-4">
				{invitation.expired ? (
					<p className="text-center text-destructive text-sm">
						This invitation has expired. Ask {invitation.inviterName} to send a
						new one.
					</p>
				) : emailMismatch ? (
					<p className="text-center text-muted-foreground text-sm">
						This invitation was sent to{" "}
						<span className="font-medium text-foreground">
							{invitation.email}
						</span>
						, but you're signed in as{" "}
						<span className="font-medium text-foreground">{sessionEmail}</span>.
						Sign in with the invited email to accept it.
					</p>
				) : (
					<div className="flex gap-3">
						<Button
							variant="outline"
							disabled={isPending}
							onClick={reject}
							size="lg"
						>
							<XIcon className="size-4" />
							Decline
						</Button>
						<Button disabled={isPending} onClick={accept} size="lg">
							<CheckIcon className="size-4" />
							{isPending ? "Joining…" : "Accept Invitation"}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
