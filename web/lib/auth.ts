import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import type { OrderSubscription } from "@polar-sh/sdk/models/components/ordersubscription.js";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, organization } from "better-auth/plugins";
import OrgInviteEmail from "@/lib/email/org-invite-email";
import OtpEmail from "@/lib/email/otp-email";
import { prisma } from "./db";
import DeleteAccountEmail from "./email/delete-account-email";
import { env } from "./env";
import { billingEnabled, polarClient } from "./polar";
import { resend } from "./resend";

// Cross-origin widget iframes need sameSite:"none" cookies, which require
// HTTPS. Over plain http (local dev) that combination silently drops the
// session cookie, so fall back to "lax" there.
const isSecureOrigin = env.BETTER_AUTH_URL.startsWith("https://");

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql", // or "mysql", "postgresql", ...etc
	}),
	advanced: {
		defaultCookieAttributes: isSecureOrigin
			? { sameSite: "none", secure: true }
			: { sameSite: "lax", secure: false },
	},
	user: {
		additionalFields: {
			hasCompletedOnboarding: {
				type: "boolean",
				required: false,
				defaultValue: false,
				input: false, // don't allow user to manually set this
			},
			// "developer" | "client" | "admin"
			role: {
				type: "string",
				required: false,
				defaultValue: "developer",
				input: false, // don't allow user to manually set this
				returned: true,
			},
			emailNotifications: {
				type: "boolean",
				required: false,
				defaultValue: true,
				input: true,
				returned: true,
			},
		},
		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ user, url }) => {
				await resend.emails.send({
					from: "Reviseo <onboarding@reviseo.app>",
					to: [user.email],
					subject: "Confirm your account deletion",
					react: DeleteAccountEmail({
						userName: user.name,
						userEmail: user.email,
						verificationUrl: url,
					}),
				});
			},
		},
	},
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					// Check if user has a pending feedback-client invite
					const invite = await prisma.invite.findFirst({
						where: {
							email: user.email,
							status: "PENDING",
							expiresAt: { gt: new Date() },
						},
					});

					if (invite) {
						// Client account: no workspace of their own
						await prisma.user.update({
							where: { id: user.id },
							data: { role: "client" },
						});
						return;
					}

					// Signing up to join an agency? Don't create a personal
					// workspace — they're here to accept an org invitation.
					const orgInvitation = await prisma.invitation.findFirst({
						where: {
							email: user.email,
							status: "pending",
							expiresAt: { gt: new Date() },
						},
						select: { id: true },
					});
					if (orgInvitation) return;

					// Developer account: every developer gets a personal
					// workspace (organization) they own. Agencies invite
					// teammates into it later.
					const slugBase = (user.name || user.email.split("@")[0])
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, "-")
						.replace(/(^-|-$)/g, "");
					await prisma.organization.create({
						data: {
							id: crypto.randomUUID(),
							name: `${user.name || "My"} Workspace`,
							slug: `${slugBase || "workspace"}-${user.id.slice(0, 6)}`,
							createdAt: new Date(),
							members: {
								create: {
									id: crypto.randomUUID(),
									userId: user.id,
									role: "owner",
									createdAt: new Date(),
								},
							},
						},
					});
				},
			},
		},
		session: {
			create: {
				before: async (session) => {
					// Default the session's active organization to the user's
					// first membership so org-scoped queries always work.
					const membership = await prisma.member.findFirst({
						where: { userId: session.userId },
						orderBy: { createdAt: "asc" },
						select: { organizationId: true },
					});

					return {
						data: {
							...session,
							activeOrganizationId: membership?.organizationId ?? null,
						},
					};
				},
			},
		},
	},
	socialProviders: {
		github: {
			clientId: env.AUTH_GITHUB_CLIENT_ID,
			clientSecret: env.AUTH_GITHUB_SECRET,
		},
	},
	plugins: [
		emailOTP({
			expiresIn: 60 * 10, // Ten minutes
			async sendVerificationOTP({ email, otp }) {
				if (env.NODE_ENV === "development") {
					console.log(`\n[dev-otp] Login code for ${email}: ${otp}\n`);
				}
				await resend.emails.send({
					// TODO: Use reviseo domain
					from: "Reviseo <onboarding@reviseo.app>",
					to: [email],
					subject: "Reviseo - Verify your email",
					react: OtpEmail({ otp, email }),
				});
			},
		}),
		organization({
			// Teammate invites (agency members) — distinct from per-website
			// feedback-client invites, which use the custom Invite model.
			async sendInvitationEmail(data) {
				const inviteUrl = `${env.BETTER_AUTH_URL}/accept-invitation/${data.id}`;
				if (env.NODE_ENV === "development") {
					console.log(`\n[dev-org-invite] ${data.email} -> ${inviteUrl}\n`);
				}
				await resend.emails.send({
					from: "Reviseo <onboarding@reviseo.app>",
					to: [data.email],
					subject: `Join ${data.organization.name} on Reviseo`,
					react: OrgInviteEmail({
						inviteUrl,
						organizationName: data.organization.name,
						inviterName: data.inviter.user.name,
						inviterEmail: data.inviter.user.email,
					}),
				});
			},
		}),
		// Billing plugin only when Polar is configured (disabled in local dev).
		...(billingEnabled && polarClient
			? [
					polar({
						client: polarClient,
						createCustomerOnSignUp: true,
						use: [
							checkout({
								products: [
									{
										// biome-ignore lint/style/noNonNullAssertion: guarded by billingEnabled
										productId: env.POLAR_PROFESSIONAL_PLAN_PRODUCT_ID!,
										slug: "professional",
									},
									{
										// biome-ignore lint/style/noNonNullAssertion: guarded by billingEnabled
										productId: env.POLAR_PROFESSIONAL_YEARLY_PLAN_PRODUCT_ID!,
										slug: "professional-yearly",
									},
									{
										// biome-ignore lint/style/noNonNullAssertion: guarded by billingEnabled
										productId: env.POLAR_STARTER_PLAN_PRODUCT_ID!,
										slug: "starter",
									},
									{
										// biome-ignore lint/style/noNonNullAssertion: guarded by billingEnabled
										productId: env.POLAR_STARTER_YEARLY_PLAN_PRODUCT_ID!,
										slug: "starter-yearly",
									},
								],
								successUrl: "/success?checkout_id={CHECKOUT_ID}",
								authenticatedUsersOnly: true,
							}),
							portal(),
							webhooks({
								// biome-ignore lint/style/noNonNullAssertion: guarded by billingEnabled
								secret: env.POLAR_WEBHOOK_SECRET!,
								onOrderPaid: async (payload) => {
									const sub = payload.data.subscription as OrderSubscription;
									const userId = payload.data.customer.externalId as string;

									await prisma.subscription.upsert({
										// Subscription.userId is @unique — this is the correct
										// upsert key (previously keyed on `id`, which never
										// matched and broke renewals).
										where: {
											userId,
										},
										create: {
											userId,
											polarSubId: sub.id,
											status: sub.status,
											planId: sub.productId,
											currentPeriodStart: sub.currentPeriodStart,
											currentPeriodEnd: sub.currentPeriodEnd,
										},
										update: {
											status: "active",
											planId: sub.productId,
											polarSubId: sub.id,
											currentPeriodStart: sub.currentPeriodStart,
											currentPeriodEnd: sub.currentPeriodEnd,
										},
									});
								},
								onSubscriptionRevoked: async (payload) => {
									const sub = payload.data;

									await prisma.subscription.update({
										where: { polarSubId: sub.id },
										data: { status: "expired" },
									});
								},
							}),
						],
					}),
				]
			: []),
	],
});
