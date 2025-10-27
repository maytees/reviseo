"use server";

import { env } from "@/lib/env";
import type { ApiResponse } from "@/lib/types";
import { type WaitlistFormData, waitlistSchema } from "@/lib/validations";

export async function sendWaitlistInvite(
	values: WaitlistFormData,
): Promise<ApiResponse> {
	const validation = waitlistSchema.safeParse(values);

	if (!validation.success) {
		return {
			status: "error",
			message: "Invalid form data",
		};
	}

	const { email } = validation.data;

	try {
		const response = await fetch(env.ROUTER_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${env.ROUTER_TOKEN}`,
			},
			body: JSON.stringify({
				email,
			}),
		});

		console.log(response);

		if (!response.ok) {
			return {
				status: "error",
				message: "Failed to submit form",
			};
		}

		return {
			status: "success",
			message: "Thank you for signing up to the waitlist!",
		};
	} catch (e) {
		console.error(e);
		return {
			status: "error",
			message: "Failed to send invite email",
		};
	}
}
