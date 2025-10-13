"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import type { CourseType } from "@/app/data/user/get-course-by-id";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardHeading,
	CardTitle,
	CardToolbar,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	type CourseColor,
	type CourseSchemaType,
	courseSchema,
} from "@/lib/schemas/courseSchema";
import { tryCatch } from "@/lib/try-catch";
import ColorSelectSwatch from "../../_components/color-swatch-select";
import { updateCourse } from "../../actions";

// name
// code
//color

// description
// semester
// instructor
// credits
// isActive (button to archive)
// add syllabus
// add course page

const SettingsView = ({ course }: { course: NonNullable<CourseType> }) => {
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm<CourseSchemaType>({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			name: course.name ?? "",
			code: course.code ?? "",
			color: course.color as z.infer<typeof CourseColor>,
			description: course.description ?? "",
			semester: course.semester ?? "",
			instructor: course.instructor ?? "",
			credits: course.credits ?? 0, // Add this line - use empty string for number inputs
			isActive: course.isActive ?? false,
			syllabusUrl: course.syllabusUrl ?? "",
			coursePage: course.coursePage ?? "",
		},
		mode: "onBlur",
		resetOptions: {
			keepDefaultValues: true,
		},
	});

	function onSubmit(values: CourseSchemaType) {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				updateCourse(course.id, values),
			);

			if (error) {
				toast.error("An unexpected error occurred. Please try again.");
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				router.refresh();
			} else if (result.status === "error") {
				toast.error(result.message);
			}
		});
	}

	return (
		<div className="flex flex-col gap-2 mt-8">
			<Card className="max-w-3xl">
				<CardHeader className="my-2">
					<CardHeading>
						<CardTitle>Course Info</CardTitle>
						<CardDescription>Edit course information here.</CardDescription>
					</CardHeading>
					<CardToolbar>
						<Button mode={"icon"}>
							<Pencil />
						</Button>
					</CardToolbar>
				</CardHeader>
				<Form {...form}>
					<form
						// onSubmit={form.handleSubmit(onSubmit, onError)}
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<CardContent className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												disabled={pending}
												{...field}
												placeholder="Fundamentals of Communication"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel>Code</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={pending}
												placeholder="COMM 101"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<ColorSelectSwatch form={form} />

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												disabled={pending}
												placeholder="Course description"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="semester"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel>Semester</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={pending}
												placeholder="Fall 2024"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="instructor"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel>Instructor</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={pending}
												placeholder="Dr. Smith"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="credits"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel>Credits</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={pending}
												type="number"
												placeholder="3"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="syllabusUrl"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel>Syllabus URL</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={pending}
												type="url"
												placeholder="https://example.com/syllabus.pdf"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="coursePage"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel>Course Page</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={pending}
												type="url"
												placeholder="https://example.com/course"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter className="justify-end">
							<Button type="submit">Update Info</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	);
};

export default SettingsView;
