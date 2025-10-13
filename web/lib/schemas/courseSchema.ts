// import { z } from "zod";

// export const CourseColor = z.enum([
// 	"bg-red-400",
// 	"bg-orange-400",
// 	"bg-amber-400",
// 	"bg-lime-400",
// 	"bg-emerald-400",
// 	"bg-blue-400",
// 	"bg-indigo-400",
// 	"bg-violet-400",
// ]);

// export const courseSchema = z.object({
// 	name: z
// 		.string()
// 		.min(1, { error: "Name must be at least 1 character long!" })
// 		.max(100, { error: "Name shouldn't exceed 100 characters!" }),
// 	code: z.string(),
// 	description: z
// 		.string()
// 		.max(600, { error: "Description shouldn't exceed 1,000 characters!" })
// 		.optional(),
// 	color: CourseColor.default("bg-blue-400").optional(),
// 	semester: z
// 		.string()
// 		.max(50, { error: "Semester shouldn't exceed 50 characters!" })
// 		.optional(),
// 	instructor: z
// 		.string()
// 		.max(100, { error: "Instructor name shouldn't exceed 100 characters!" })
// 		.optional(),
// 	credits: z.coerce
// 		.number<number>()
// 		.min(0, { error: "Credits must be a positive number!" })
// 		.max(20, { error: "Credits shouldn't exceed 20 characters!" })
// 		.optional(),
// 	isActive: z.boolean().default(true).optional(),
// 	// syllabusUrl: z.url({ error: "Please enter a valid URL!" }),
// 	syllabusUrl: z.url().optional().or(z.literal("")),
// 	coursePage: z
// 		.url({ error: "Please enter a valid URL!" })
// 		.optional()
// 		.or(z.literal("")),
// });

// export const deleteCourseSchema = z.object({
// 	name: z.string({ error: "Name is required!" }),
// });

// export type CourseSchemaType = z.infer<typeof courseSchema>;
// export type DeleteCourseSchemaType = z.infer<typeof deleteCourseSchema>;
