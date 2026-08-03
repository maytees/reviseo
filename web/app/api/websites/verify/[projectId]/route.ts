import { NextResponse } from "next/server";
import { getApiSession, userCanAccessWebsite } from "@/app/data/api-auth";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { isSafeExternalUrl } from "@/lib/screenshot";

/** Verify the widget snippet is installed on the customer's site.
 *  Only workspace members may trigger verification (it makes our server
 *  fetch their URL and mutates widgetInstalled). */
export async function POST(
	_req: Request,
	context: { params: Promise<{ projectId: string }> },
) {
	const session = await getApiSession();
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { projectId } = await context.params;

	const existingWebsite = await prisma.website.findUnique({
		where: { projectId },
	});

	if (
		!existingWebsite ||
		!(await userCanAccessWebsite(session.user.id, existingWebsite))
	) {
		return NextResponse.json({ error: "Could not find site" }, { status: 404 });
	}

	if (!isSafeExternalUrl(existingWebsite.url)) {
		return NextResponse.json(
			{ error: "Website URL is not reachable for verification" },
			{ status: 400 },
		);
	}

	try {
		const response = await fetch(existingWebsite.url, {
			headers: {
				"User-Agent": "ReviseoBot/1.0 (Installation Verification)",
			},
			signal: AbortSignal.timeout(15_000),
		});
		const html = await response.text();

		// Remove all whitespace and newlines for comparison
		const normalizedHtml = html.replace(/\s+/g, "");

		const scriptSrc = env.NEXT_PUBLIC_WIDGET_SCRIPT_URL;

		// The signals that actually matter: this exact projectId (via the
		// window.ReviseoConfig snippet OR the data-project-id attribute of a
		// one-tag install) plus a script tag pointing at our widget bundle.
		// (The old 11-fragment IIFE match broke on minifiers/SPAs/tag
		// managers.)
		const hasConfig = normalizedHtml.includes(
			`window.ReviseoConfig={projectId:"${existingWebsite.projectId}"`,
		);
		const hasDataAttr = normalizedHtml.includes(
			`data-project-id="${existingWebsite.projectId}"`,
		);
		const hasScript = normalizedHtml.includes(scriptSrc.replace(/\s+/g, ""));

		const htmlDetected = (hasConfig || hasDataAttr) && hasScript;

		// Runtime-injected installs (next/script, tag managers, SPAs) never
		// show the snippet in server HTML — the widget's install heartbeat
		// (/api/widget/ping) covers those. A recent heartbeat counts.
		const heartbeatDetected =
			existingWebsite.widgetInstalled &&
			existingWebsite.verifiedAt !== null &&
			existingWebsite.verifiedAt >
				new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

		const isInstalled = htmlDetected || heartbeatDetected;

		await prisma.website.update({
			where: { projectId },
			data: {
				widgetInstalled: isInstalled,
				verifiedAt: isInstalled ? new Date() : existingWebsite.verifiedAt,
			},
		});

		return NextResponse.json(
			{
				installed: isInstalled,
				verifiedAt: isInstalled ? new Date() : null,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Verification fetch failed:", error);
		return NextResponse.json(
			{
				installed: false,
				error: "Could not reach your website to verify installation",
			},
			{ status: 500 },
		);
	}
}
