/**
 * Better Auth's email-OTP sign-up defaults `user.name` to the email's
 * local part ("jordan@x.com" → "jordan"). Treat that — or an empty value —
 * as "no real name yet" so every flow that collects a name knows to ask.
 */
export function isPlaceholderName(
	name: string | null | undefined,
	email: string,
): boolean {
	const trimmed = name?.trim();
	if (!trimmed) return true;
	return trimmed.toLowerCase() === email.split("@")[0]?.toLowerCase();
}
