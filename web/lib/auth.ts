import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import OtpEmail from "@/components/email/otp-email";
import { prisma } from "./db";
import { env } from "./env";
import { resend } from "./resend";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql", // or "mysql", "postgresql", ...etc
	}),
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
					from: "Molnr <molnr@molnr.app>",
					to: [email],
					subject: "Molnr - Verify your email",
					react: OtpEmail({ otp, email }),
				});
			},
		}),
	],
});
