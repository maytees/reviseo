import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import type { OrderSubscription } from "@polar-sh/sdk/models/components/ordersubscription.js";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import OtpEmail from "@/lib/email/otp-email";
import { prisma } from "./db";
import DeleteAccountEmail from "./email/delete-account-email";
import { env } from "./env";
import { polarClient } from "./polar";
import { resend } from "./resend";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql", // or "mysql", "postgresql", ...etc
	}),
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
		},
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
					// Check if user has a pending invite (means they're a client)
					const invite = await prisma.invite.findFirst({
						where: {
							email: user.email,
							status: "PENDING",
							expiresAt: { gt: new Date() },
						},
					});

					// If invite exists, set role to client
					if (invite) {
						await prisma.user.update({
							where: { id: user.id },
							data: { role: "client" },
						});
					}
					// Otherwise keeps default "developer" role
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
				await resend.emails.send({
					// TODO: Use reviseo domain
					from: "Reviseo <onboarding@reviseo.app>",
					to: [email],
					subject: "Reviseo - Verify your email",
					react: OtpEmail({ otp, email }),
				});
			},
		}),
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({
					products: [
						{
							productId: env.POLAR_PROFESSIONAL_PLAN_PRODUCT_ID,
							slug: "professional", // Custom slug for easy reference in Checkout URL, e.g. /checkout/Reviseo
						},
						{
							productId: env.POLAR_PROFESSIONAL_YEARLY_PLAN_PRODUCT_ID,
							slug: "professional-yearly",
						},
						{
							productId: env.POLAR_STARTER_PLAN_PRODUCT_ID,
							slug: "starter", // Custom slug for easy reference in Checkout URL, e.g. /checkout/Reviseo
						},
						{
							productId: env.POLAR_STARTER_YEARLY_PLAN_PRODUCT_ID,
							slug: "starter-yearly",
						},
					],
					successUrl: "/success?checkout_id={CHECKOUT_ID}",
					authenticatedUsersOnly: true,
				}),
				portal(),
				webhooks({
					secret: env.POLAR_WEBHOOK_SECRET,
					onOrderPaid: async (payload) => {
						const sub = payload.data.subscription as OrderSubscription;
						const userId = payload.data.customer.externalId as string;

						await prisma.subscription.upsert({
							where: {
								id: userId,
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
	],
});
