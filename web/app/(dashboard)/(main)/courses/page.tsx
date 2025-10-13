import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getAllCourses } from "@/app/data/user/get-all-courses";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseCard } from "./_components/CourseCard";

const CoursePage = () => {
	return (
		<div className="flex flex-col gap-8">
			<div className="flex items-center gap-4">
				<h1 className="text-xl font-bold">Your Courses</h1>
				<Button asChild variant={"mono"}>
					<Link href={"/courses/create"}>
						<Plus />
						Add
					</Link>
				</Button>
			</div>

			{/* TODO: Skeleton fallback */}
			<Suspense
				fallback={
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Skeleton className="w-96 h-36 rounded-3xl" />
						<Skeleton className="w-96 h-36 rounded-3xl" />
						<Skeleton className="w-96 h-36 rounded-3xl" />
						<Skeleton className="w-96 h-36 rounded-3xl" />
					</div>
				}
			>
				<RenderCourses />
			</Suspense>
		</div>
	);
};

async function RenderCourses() {
	const data = await getAllCourses();

	return (
		<>
			{data.length === 0 ? (
				// TODO: Empty state
				<div>No Courses</div>
			) : (
				// TODO: Proper cards
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{data.map((course) => (
						<CourseCard
							key={course.id}
							code={course.code || "NIL 000"}
							color={course.color}
							id={course.id}
							image={course.image || "/placeholder.svg"}
							semester={course.semester || "Fall 2025"}
							title={course.name}
						/>
						// <div
						// 	key={course.id}
						// 	className="p-4 md:w-xs w-sm bg-background border-accent border-1 rounded-2xl"
						// >
						// 	<div className="flex flex-row items-center gap-2">
						// 		<div className={`rounded-full ${course.color} size-5`} />
						// 		<h1 className="font-bold">{course.name}</h1>
						// 	</div>
						// 	<p className="text-sm font-semibold text-muted-foreground">
						// 		{course.code}
						// 	</p>
						// </div>
					))}
				</div>
			)}
		</>
	);
}

export default CoursePage;
