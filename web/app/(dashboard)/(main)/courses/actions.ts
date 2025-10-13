"use server";

import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import {
	type CourseSchemaType,
	courseSchema,
	type DeleteCourseSchemaType,
	deleteCourseSchema,
} from "@/lib/schemas/courseSchema";
import type { ApiResponse } from "@/lib/types";

export async function createCourse(
	values: CourseSchemaType,
): Promise<ApiResponse> {
	const session = await requireUser();

	try {
		const validation = courseSchema.safeParse(values);

		if (!validation.success) {
			return {
				status: "error",
				message: "Invalid Form Data",
			};
		}

		await prisma.course.create({
			data: {
				userId: session.id,
				...validation.data,
			},
		});

		return {
			status: "success",
			message: "Course created succesfully",
		};
	} catch {
		return {
			status: "error",
			message: "Failed to create course",
		};
	}
}

export async function deleteCourse(
	id: string,
	values: DeleteCourseSchemaType,
): Promise<ApiResponse> {
	await requireUser();

	try {
		const validation = deleteCourseSchema.safeParse(values);

		if (!validation.success) {
			return {
				status: "error",
				message: "Invalid Form Data",
			};
		}

		await prisma.course.delete({
			where: {
				id,
			},
		});

		return {
			status: "success",
			message: "Course deleted succesfully",
		};
	} catch {
		return {
			status: "error",
			message: "Failed to delete course",
		};
	}
}

export async function updateCourse(
	id: string,
	values: CourseSchemaType,
): Promise<ApiResponse> {
	await requireUser();

	try {
		const validation = courseSchema.safeParse(values);

		if (!validation.success) {
			return {
				status: "error",
				message: "Invalid Form Data",
			};
		}

		await prisma.course.update({
			where: {
				id,
			},
			data: {
				...validation.data,
			},
		});

		return {
			status: "success",
			message: "Course updated succesfully",
		};
	} catch {
		return {
			status: "error",
			message: "Failed to update course",
		};
	}
}
