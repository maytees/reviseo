import { prisma } from "@/lib/db";

export async function POST(request: Request) {
	const {
		projectId,
		userId,
	}: {
		projectId: string;
		userId: string;
	} = await request.json();

	if (!projectId || !userId) {
		return Response.json(
			{ error: "Missing projectId or userId", allowed: false },
			{ status: 400 },
		);
	}

	const existingWebsite = await prisma.website.findFirst({
		where: {
			projectId,
			OR: [{ clientId: userId }, { developerId: userId }],
		},
	});

	if (!existingWebsite) {
		return Response.json(
			{ error: "Could not find site", allowed: false },
			{ status: 404 },
		);
	}

	return Response.json({ allowed: true }, { status: 200 });
}
