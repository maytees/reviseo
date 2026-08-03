import "server-only";

import { env } from "./env";

// NOTE: Automatic site-preview screenshots (Puppeteer/@sparticuz/chromium)
// are currently disabled — the dependency was removed to keep deploys lean
// and reliable. Existing screenshots in S3 still render via
// /api/s3/screenshot/[key]; new websites simply show the fallback preview.
// Restore from git history (lib/screenshot.ts pre-removal) if needed.

/** Basic SSRF guard: only allow http(s) URLs to public-looking hosts. */
export function isSafeExternalUrl(raw: string): boolean {
	let parsed: URL;
	try {
		parsed = new URL(raw);
	} catch {
		return false;
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;

	const host = parsed.hostname.toLowerCase();

	// In local dev the user's own test sites live on localhost — allow them.
	if (env.NODE_ENV === "development") return true;

	if (
		host === "localhost" ||
		host === "0.0.0.0" ||
		host.endsWith(".localhost") ||
		host.endsWith(".local") ||
		host.endsWith(".internal")
	) {
		return false;
	}

	// Block IP-literal hosts in private/reserved ranges.
	const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
	if (ipv4) {
		const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
		if (
			a === 10 ||
			a === 127 ||
			a === 0 ||
			(a === 172 && b >= 16 && b <= 31) ||
			(a === 192 && b === 168) ||
			(a === 169 && b === 254) ||
			(a === 100 && b >= 64 && b <= 127)
		) {
			return false;
		}
	}
	// IPv6 literals: block outright (no legitimate customer site needs one).
	if (host.includes(":")) return false;

	return true;
}
