import { NextResponse } from "next/server";
import z from "zod";
import { prisma } from "@/lib/db";

const pingSchema = z.object({ projectId: z.uuid() });

/**
 * Install heartbeat. The trigger iframe (our origin) fires this whenever the
 * widget boots on a customer page. It's how installs that inject the snippet
 * at runtime (next/script, tag managers, SPAs) get verified — their config
 * never appears in the server-rendered HTML, so string-matching can't see it.
 *
 * Public by design: projectId is already public in the page source, and the
 * only effect is flipping the website's own installed flag. Writes are
 * throttled to one per 10 minutes per website.
 */
export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid body" }, { status: 400 });
	}

	const parsed = pingSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid projectId" }, { status: 400 });
	}

	// Throttled: only touch rows not already marked verified in the last 10m.
	await prisma.website.updateMany({
		where: {
			projectId: parsed.data.projectId,
			OR: [
				{ verifiedAt: null },
				{ verifiedAt: { lt: new Date(Date.now() - 10 * 60 * 1000) } },
			],
		},
		data: { widgetInstalled: true, verifiedAt: new Date() },
	});

	// Always 200 — no existence oracle for random projectIds.
	return NextResponse.json({ ok: true });
}
