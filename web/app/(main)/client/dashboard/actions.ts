"use server";

import { addDays } from "date-fns";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { v4 } from "uuid";
import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import ClientInviteEmail from "@/lib/email/client-invite-email";
import FeedbackNotificationEmail from "@/lib/email/dev-feedback-notification";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import type { ApiResponse } from "@/lib/types";

/** The caller's lead row for a website, or null. Only leads manage the
 *  client team and the approval queue. */
async function requireLead(userId: string, websiteId: string) {
	const row = await prisma.websiteClient.findUnique({
		where: { websiteId_userId: { websiteId, userId } },
	});
	return row && row.role === "lead" ? row : null;
}

export type MemberPermissions = {
	trusted: boolean;
	canAnnotate: boolean;
	canText: boolean;
	canStyle: boolean;
	canImage: boolean;
};

/** Lead invites a teammate onto the website's client team. */
export async function inviteClientMember(
	websiteId: string,
	email: string,
	permissions: MemberPermissions,
): Promise<ApiResponse> {
	const user = await requireUser();

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return { status: "error", message: "Enter a valid email address" };
	}

	try {
		const lead = await requireLead(user.id, websiteId);
		if (!lead) {
			return {
				status: "error",
				message: "Only the lead client can invite teammates",
			};
		}

		const website = await prisma.website.findUnique({
			where: { id: websiteId },
			select: { id: true, name: true, url: true },
		});
		if (!website) {
			return { status: "error", message: "Website not found" };
		}

		// Already on the team?
		const existingUser = await prisma.user.findUnique({
			where: { email },
			select: { id: true },
		});
		if (existingUser) {
			const existingRow = await prisma.websiteClient.findUnique({
				where: {
					websiteId_userId: { websiteId, userId: existingUser.id },
				},
				select: { id: true },
			});
			if (existingRow) {
				return {
					status: "error",
					message: "That person is already on this website's team",
				};
			}
		}

		const token = v4();
		await prisma.invite.create({
			data: {
				websiteId,
				email,
				token,
				expiresAt: addDays(new Date(), 7),
				clientRole: "member",
				trusted: permissions.trusted,
				canAnnotate: permissions.canAnnotate,
				canText: permissions.canText,
				canStyle: permissions.canStyle,
				canImage: permissions.canImage,
				invitedById: user.id,
			},
		});

		// No clientName in the URL: the lead only knows the email, and passing
		// the local-part would silently become the member's account name. The
		// invite page asks them for a real name instead.
		const inviteeName = email.split("@")[0];
		const inviteUrl = `${env.BETTER_AUTH_URL}/invite?token=${token}`;
		if (env.NODE_ENV === "development") {
			console.log(`\n[dev-client-member-invite] ${email} -> ${inviteUrl}\n`);
		}

		const emailResponse = await resend.emails.send({
			from: "Reviseo <onboarding@reviseo.app>",
			to: [email],
			subject: `${user.name || "A teammate"} invited you to review ${website.name}`,
			react: ClientInviteEmail({
				clientName: inviteeName,
				inviteUrl,
				developerName: user.name || user.email,
				websiteName: website.name,
				websiteUrl: website.url,
			}),
		});
		if (emailResponse.error) console.error(emailResponse);

		revalidatePath("/client/dashboard");
		return { status: "success", message: `Invitation sent to ${email}` };
	} catch (e) {
		console.error("Failed to invite client member:\n", e);
		return { status: "error", message: "Failed to send invitation" };
	}
}

/** Lead updates a member's permissions / trusted flag. */
export async function updateClientMember(
	memberRowId: string,
	permissions: MemberPermissions,
): Promise<ApiResponse> {
	const user = await requireUser();

	try {
		const row = await prisma.websiteClient.findUnique({
			where: { id: memberRowId },
		});
		if (!row) return { status: "error", message: "Team member not found" };
		if (row.role === "lead") {
			return { status: "error", message: "The lead's access can't be edited" };
		}

		const lead = await requireLead(user.id, row.websiteId);
		if (!lead) {
			return {
				status: "error",
				message: "Only the lead client can manage the team",
			};
		}

		await prisma.websiteClient.update({
			where: { id: memberRowId },
			data: {
				trusted: permissions.trusted,
				canAnnotate: permissions.canAnnotate,
				canText: permissions.canText,
				canStyle: permissions.canStyle,
				canImage: permissions.canImage,
			},
		});

		revalidatePath("/client/dashboard");
		return { status: "success", message: "Team member updated" };
	} catch (e) {
		console.error("Failed to update client member:\n", e);
		return { status: "error", message: "Failed to update team member" };
	}
}

/** Lead removes a member from the team. */
export async function removeClientMember(
	memberRowId: string,
): Promise<ApiResponse> {
	const user = await requireUser();

	try {
		const row = await prisma.websiteClient.findUnique({
			where: { id: memberRowId },
		});
		if (!row) return { status: "error", message: "Team member not found" };
		if (row.role === "lead") {
			return { status: "error", message: "The lead can't be removed here" };
		}

		const lead = await requireLead(user.id, row.websiteId);
		if (!lead) {
			return {
				status: "error",
				message: "Only the lead client can manage the team",
			};
		}

		await prisma.websiteClient.delete({ where: { id: memberRowId } });

		revalidatePath("/client/dashboard");
		return { status: "success", message: "Team member removed" };
	} catch (e) {
		console.error("Failed to remove client member:\n", e);
		return { status: "error", message: "Failed to remove team member" };
	}
}

/** Lead toggles whether teammates get an email when the lead approves or
 *  rejects their submissions (off by default). */
export async function updateLeadNotifyDecisions(
	websiteId: string,
	enabled: boolean,
): Promise<ApiResponse> {
	const user = await requireUser();

	try {
		const lead = await requireLead(user.id, websiteId);
		if (!lead) {
			return {
				status: "error",
				message: "Only the lead client can change this setting",
			};
		}

		await prisma.websiteClient.update({
			where: { id: lead.id },
			data: { notifyDecisions: enabled },
		});

		revalidatePath("/client/dashboard");
		return { status: "success", message: "Setting updated" };
	} catch (e) {
		console.error("Failed to update decision-email setting:\n", e);
		return { status: "error", message: "Failed to update setting" };
	}
}

/** Lead approves or rejects a member's pending submission. Approval is the
 *  moment the developer gets notified — pending items never emailed them. */
export async function decideFeedbackApproval(
	feedbackId: string,
	decision: "APPROVED" | "REJECTED",
	note?: string,
): Promise<ApiResponse> {
	const user = await requireUser();

	try {
		const feedback = await prisma.feedback.findUnique({
			where: { id: feedbackId },
			select: {
				id: true,
				title: true,
				type: true,
				priority: true,
				pageUrl: true,
				description: true,
				approval: true,
				websiteId: true,
				author: { select: { email: true, name: true } },
				website: {
					select: {
						id: true,
						name: true,
						developer: {
							select: { email: true, name: true, emailNotifications: true },
						},
					},
				},
			},
		});
		if (!feedback) return { status: "error", message: "Feedback not found" };
		if (feedback.approval !== "PENDING") {
			return { status: "error", message: "This item isn't awaiting approval" };
		}

		const lead = await requireLead(user.id, feedback.websiteId);
		if (!lead) {
			return {
				status: "error",
				message: "Only the lead client can approve submissions",
			};
		}

		await prisma.feedback.update({
			where: { id: feedbackId },
			data: {
				approval: decision,
				approvedById: user.id,
				approvedAt: new Date(),
				approvalNote: note?.slice(0, 2000) || null,
			},
		});

		// Approval is what notifies the developer.
		if (
			decision === "APPROVED" &&
			feedback.website.developer.emailNotifications
		) {
			const emailResponse = await resend.emails.send({
				from: "Reviseo <info@reviseo.app>",
				to: [feedback.website.developer.email],
				subject: `${feedback.website.name} - New Feedback Approved`,
				react: FeedbackNotificationEmail({
					developerName: feedback.website.developer.name,
					feedbackTitle: feedback.title,
					feedbackType: feedback.type,
					priority: feedback.priority,
					pageUrl: feedback.pageUrl,
					description: (feedback.description || feedback.title).substring(
						0,
						249,
					),
					submittedAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
					websiteName: feedback.website.name,
					feedbackUrl: `${env.BETTER_AUTH_URL}/dashboard/websites/${feedback.website.id}?open=${feedback.id}`,
					allFeedbackUrl: `${env.BETTER_AUTH_URL}/dashboard/websites/${feedback.website.id}`,
					dashboardUrl: `${env.BETTER_AUTH_URL}/dashboard`,
				}),
			});
			if (emailResponse.error) console.error(emailResponse);
		}

		// Tell the member what happened — only if this lead opted in to
		// decision emails (off by default).
		if (lead.notifyDecisions && feedback.author?.email) {
			const emailResponse = await resend.emails.send({
				from: "Reviseo <info@reviseo.app>",
				to: [feedback.author.email],
				subject:
					decision === "APPROVED"
						? `Your feedback on ${feedback.website.name} was approved`
						: `Your feedback on ${feedback.website.name} needs changes`,
				html: `<p>Hi ${feedback.author.name || "there"},</p>
<p>Your submission "<strong>${feedback.title}</strong>" was ${
					decision === "APPROVED"
						? "approved and sent to the developer."
						: "not approved."
				}</p>
${note ? `<p>Note from your team lead: ${note}</p>` : ""}
<p>— Reviseo</p>`,
			});
			if (emailResponse.error) console.error(emailResponse);
		}

		revalidatePath("/client/dashboard");
		return {
			status: "success",
			message: decision === "APPROVED" ? "Approved and sent" : "Rejected",
		};
	} catch (e) {
		console.error("Failed to decide approval:\n", e);
		return { status: "error", message: "Failed to update approval" };
	}
}
