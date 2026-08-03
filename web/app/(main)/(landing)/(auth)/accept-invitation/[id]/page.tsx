import { Building2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getApiSession } from "@/app/data/api-auth";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import AcceptInvitationCard from "./AcceptInvitationCard";

export const metadata: Metadata = {
	title: "Workspace Invitation",
};

export default async function AcceptInvitationPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const session = await getApiSession();

	const invitation = await prisma.invitation.findUnique({
		where: { id },
		select: {
			id: true,
			email: true,
			role: true,
			status: true,
			expiresAt: true,
			organization: { select: { name: true } },
			user: { select: { name: true } },
		},
	});

	if (!invitation || invitation.status !== "pending") {
		return (
			<Card className="border-border bg-linear-to-br from-card to-card/50 px-3 py-7 shadow-xl backdrop-blur-sm">
				<CardHeader className="space-y-1 py-2 text-center">
					<CardTitle className="font-bold font-caudex text-2xl">
						Invitation not found
					</CardTitle>
					<CardDescription className="font-inter">
						This invitation doesn't exist, was canceled, or has already been
						used.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-center">
					<Button asChild variant="outline">
						<Link href="/">Back to home</Link>
					</Button>
				</CardContent>
			</Card>
		);
	}

	const expired = invitation.expiresAt < new Date();

	if (!session) {
		const nextUrl = encodeURIComponent(`/accept-invitation/${id}`);
		return (
			<Card className="border-border bg-linear-to-br from-card to-card/50 px-3 py-7 shadow-xl backdrop-blur-sm">
				<CardHeader className="space-y-2 py-2 text-center">
					<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
						<Building2 className="size-6 text-primary" />
					</div>
					<CardTitle className="font-bold font-caudex text-2xl">
						Join {invitation.organization.name}
					</CardTitle>
					<CardDescription className="font-inter">
						{invitation.user.name} invited you ({invitation.email}) to
						collaborate. Sign in with the invited email to accept.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-center">
					<Button asChild size="lg">
						<Link href={`/login?next=${nextUrl}`}>Sign in to accept</Link>
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<AcceptInvitationCard
			invitation={{
				id: invitation.id,
				email: invitation.email,
				role: invitation.role ?? "member",
				organizationName: invitation.organization.name,
				inviterName: invitation.user.name,
				expired,
			}}
			sessionEmail={session.user.email}
		/>
	);
}
