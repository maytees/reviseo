import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import OtpEmail from "@/lib/email/otp-email";
import { prisma } from "./db";
import { env } from "./env";
import { resend } from "./resend";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql", // or "mysql", "postgresql", ...etc
	}),
	user: {
		additionalFields: {
			hasCompletedOnboarding: {
				type: "boolean",
				required: false,
				defaultValue: false,
				input: false, // don't allow user to manually set this
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
	],
});
