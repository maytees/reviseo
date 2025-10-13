"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
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
import {
	type CourseSchemaType,
	courseSchema,
} from "@/lib/schemas/courseSchema";
import { tryCatch } from "@/lib/try-catch";
import ColorSelectSwatch from "../_components/color-swatch-select";
import { createCourse } from "../actions";

const CreateCoursePage = () => {
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm<CourseSchemaType>({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			name: "",
			code: "",
			color: "bg-red-400",
		},
	});

	function onSubmit(values: CourseSchemaType) {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(createCourse(values));

			if (error) {
				toast.error("An unexpected error occurred. Please try again.");
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				form.reset();
				router.push("/courses");
			} else if (result.status === "error") {
				toast.error(result.message);
			}
		});
	}

	// const onError = (errors) => {
	// 	console.log(`${JSON.stringify(errors)} are errors`);
	// };

	return (
		<>
			<h1 className="text-xl font-bold">Create Course</h1>
			<Card className="max-w-2xl">
				<Form {...form}>
					<form
						// onSubmit={form.handleSubmit(onSubmit, onError)}
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<CardHeader>
							<CardTitle>Basic Information</CardTitle>
						</CardHeader>
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
						</CardContent>

						<CardFooter className="gap-2">
							<Button disabled={pending} type="submit">
								Create Course
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</>
	);
};

export default CreateCoursePage;
