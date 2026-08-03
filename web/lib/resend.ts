import { Resend } from "resend";
import { env } from "./env";

/** In development, emails are logged to the server console instead of sent,
 *  so the app works without a real Resend key. */
const devResendStub = {
	emails: {
		send: async (opts: { to: string | string[]; subject: string }) => {
			console.log(
				`[dev-email] to=${Array.isArray(opts.to) ? opts.to.join(",") : opts.to} subject="${opts.subject}"`,
			);
			return { data: { id: "dev-email" }, error: null };
		},
	},
} as unknown as Resend;

export const resend =
	env.NODE_ENV === "development"
		? devResendStub
		: new Resend(env.RESEND_API_KEY);
