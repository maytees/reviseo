import { Polar } from "@polar-sh/sdk";
import { env } from "./env";

/** Whether billing is configured. When false (e.g. local dev), all Polar
 *  integration is disabled and the app runs without a paywall. */
export const billingEnabled = Boolean(
	env.POLAR_ACCESS_TOKEN && env.POLAR_WEBHOOK_SECRET,
);

export const polarClient = billingEnabled
	? new Polar({
			accessToken: env.POLAR_ACCESS_TOKEN,
			server: env.NODE_ENV === "production" ? "production" : "sandbox",
		})
	: null;
