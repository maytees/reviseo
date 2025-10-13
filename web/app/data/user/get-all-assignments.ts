import "server-only";

import { prisma as db } from "@/lib/db";
import { requireUser } from "../require-user";

export async function getAllAssignments() {
	const user = await requireUser();

	const data = await db.assignment.findMany({
		where: {
			userId: user.id,
		},
		select: {
			id: true,
			title: true,
			description: true,
			dueDate: true,
			status: true,
			priority: true,
			type: true,
			points: true,
			weight: true,
			url: true,
			fileUrl: true,
			completedAt: true,
			course: {
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
			},
			subtasks: {
				select: {
					id: true,
					title: true,
					completed: true,
					order: true,
				},
			},
		},
	});

	return data;
}

export type AssignmentsType = Awaited<ReturnType<typeof getAllAssignments>>[0];
