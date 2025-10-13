import "server-only";

import { prisma as db } from "@/lib/db";
import { requireUser } from "../require-user";

export async function getCourseById(id: string) {
	const user = await requireUser();

	const data = await db.course.findUnique({
		where: {
			userId: user.id,
			id,
		},
		select: {
			id: true,
			code: true,
			color: true,
			coursePage: true,
			credits: true,
			description: true,
			instructor: true,
			isActive: true,
			name: true,
			semester: true,
			syllabusUrl: true,
			image: true,
		},
	});

	return data;
}

export type CourseType = Awaited<ReturnType<typeof getCourseById>>;
