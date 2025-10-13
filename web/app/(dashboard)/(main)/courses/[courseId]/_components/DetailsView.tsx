"use client";
import {
	Award,
	Calendar,
	Code,
	ExternalLink,
	Globe,
	GraduationCap,
	User,
} from "lucide-react";
import Link from "next/link";
import type { CourseType } from "@/app/data/user/get-course-by-id";
import { Button } from "@/components/ui/button";

const DetailsView = ({ course }: { course: NonNullable<CourseType> }) => {
	const colorMap = {
		"bg-red-400": "red",
		"bg-orange-400": "orange",
		"bg-amber-400": "amber",
		"bg-lime-400": "lime",
		"bg-emerald-400": "emerald",
		"bg-blue-400": "blue",
		"bg-indigo-400": "indigo",
		"bg-violet-400": "violet",
	};

	const colorStr = colorMap[course.color as keyof typeof colorMap];

	return (
		<div className="mt-8 space-y-8 pb-32">
			{/* Course Title and Description */}
			<div className="space-y-3 max-w-4xl">
				<div className="gap-1">
					<h2 className="text-4xl font-bold">{course.name}</h2>
					{/* <p className="text-muted-foreground text-sm">{course.code}</p> */}
				</div>
				{course.description && (
					<p className=" text-muted-foreground leading-relaxed">
						{course.description}
					</p>
				)}
			</div>

			{/* Course Details */}
			<div className="grid pr-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* Course Code */}
				<div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
					<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
						<Code className="w-6 h-6 text-muted-foreground" />
					</div>
					<div className="flex-1">
						<p className="text-sm text-muted-foreground">Course Code</p>
						<p className="text-lg font-medium">
							{course.code || "Not specified"}
						</p>
					</div>
				</div>

				{/* Color */}
				<div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
					<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
						<div className={`w-6 h-6 rounded-full ${course.color}`} />
					</div>
					<div className="flex-1">
						<p className="text-sm text-muted-foreground">Color</p>
						<p className="text-lg font-medium capitalize">{colorStr}</p>
					</div>
				</div>

				{/* Semester */}
				<div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
					<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
						<Calendar className="w-6 h-6 text-muted-foreground" />
					</div>
					<div className="flex-1">
						<p className="text-sm text-muted-foreground">Semester</p>
						<p className="text-lg font-medium">
							{course.semester || "Not specified"}
						</p>
					</div>
				</div>

				{/* Instructor */}
				<div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
					<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
						<User className="w-6 h-6 text-muted-foreground" />
					</div>
					<div className="flex-1">
						<p className="text-sm text-muted-foreground">Instructor</p>
						<p className="text-lg font-medium">
							{course.instructor || "Not specified"}
						</p>
					</div>
				</div>

				{/* Credits */}
				<div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
					<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
						<Award className="w-6 h-6 text-muted-foreground" />
					</div>
					<div className="flex-1">
						<p className="text-sm text-muted-foreground">Credits</p>
						<p className="text-lg font-medium">
							{course.credits || "Not specified"}
						</p>
					</div>
				</div>

				{/* Status */}
				<div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
					<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
						<div
							className={`w-4 h-4 rounded-full ${course.isActive ? "bg-green-500" : "bg-gray-400"}`}
						/>
					</div>
					<div className="flex-1">
						<p className="text-sm text-muted-foreground">Status</p>
						<p className="text-lg font-medium">
							{course.isActive ? "Active" : "Inactive"}
						</p>
					</div>
				</div>
			</div>

			{/* Links Section */}
			{(course.syllabusUrl || course.coursePage) && (
				<div className="space-y-6 pr-5">
					<h3 className="text-2xl font-semibold">Course Resources</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Syllabus URL */}
						{course.syllabusUrl && (
							<div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
								<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
									<GraduationCap className="w-6 h-6 text-muted-foreground" />
								</div>
								<div className="flex-1">
									<p className="text-sm text-muted-foreground">Syllabus</p>
									<Button
										mode={"link"}
										underline={"solid"}
										asChild
										className="p-0 h-auto text-lg"
									>
										<Link href={course.syllabusUrl}>
											View Syllabus
											<ExternalLink className="w-4 h-4" />
										</Link>
									</Button>
								</div>
							</div>
						)}

						{/* Course Page */}
						{course.coursePage && (
							<div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
								<div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
									<Globe className="w-6 h-6 text-muted-foreground" />
								</div>
								<div className="flex-1">
									<p className="text-sm text-muted-foreground">Course Page</p>
									<Button
										mode={"link"}
										underline={"solid"}
										asChild
										className="p-0 h-auto text-lg"
									>
										<Link href={course.coursePage}>
											Visit Course Page
											<ExternalLink className="w-4 h-4" />
										</Link>
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default DetailsView;
