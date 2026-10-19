export const DASHBOARD_CHOOSER_PATH = "/choose-dashboard";

/** Keep sign-in return paths on this origin and avoid returning to sign-in. */
export function safeNextPath(raw: string | null | undefined): string | null {
	if (!raw?.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
		return null;
	}

	try {
		const origin = "https://reviseo.invalid";
		const target = new URL(raw, origin);
		const pathname = decodeURIComponent(target.pathname).replace(/\/+$/, "");
		if (
			target.origin !== origin ||
			pathname.startsWith("//") ||
			pathname.includes("\\") ||
			pathname === "/login" ||
			pathname === "/verify-request"
		) {
			return null;
		}

		return `${target.pathname}${target.search}${target.hash}`;
	} catch {
		return null;
	}
}
