import {
	ExternalLink,
	HouseIcon,
	Notebook,
	PanelsTopLeftIcon,
	Paperclip,
	Scroll,
	Settings,
	Text,
} from "lucide-react";
import Link from "next/link";
import {
	type CourseType,
	getCourseById,
} from "@/app/data/user/get-course-by-id";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailsView from "./_components/DetailsView";
import SettingsView from "./_components/SettingsView";

const CoursePage = async ({
	params,
}: {
	params: Promise<{ courseId: string }>;
}) => {
	const { courseId } = await params;
	const course: CourseType | { error: string } = await getCourseById(courseId);

	if (!course) return <div>404 not found</div>;

	return (
		<div className="">
			<div className={`absolute h-14 w-4 ${course.color}`}></div>
			<div className="flex flex-col items-start ml-6">
				<div className="flex flex-col gap-1">
					<h1 className="flex flex-row items-center gap-4 text-2xl font-bold">
						<span>{course.name}</span>
						{course.coursePage ? (
							<Button mode={"icon"} asChild variant={"outline"} size={"sm"}>
								<Link href={course.coursePage}>
									<ExternalLink />
								</Link>
							</Button>
						) : null}
						{/* {course.instructor ? (
							<span className="mt-2 text-sm text-muted-foreground">
								- {course.instructor}
							</span>
						) : (
							<div>
								<Button mode={"link"} underline={"dashed"}>
									<Plus />
									Add Instructor
								</Button>
							</div>
						)} */}
					</h1>
					<p className="text-sm text-muted-foreground">{course.code}</p>
				</div>
			</div>

			<Tabs defaultValue="overview" className="mt-8">
				<ScrollArea>
					<TabsList className="h-auto w-full rounded-none border-b bg-transparent p-0">
						<TabsTrigger
							value="overview"
							className="data-[state=active]:after:bg-primary relative flex-col rounded-none px-4 py-2 text-sm after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
						>
							<HouseIcon
								className="mb-1.5 opacity-60"
								size={18}
								aria-hidden="true"
							/>
							Overview
						</TabsTrigger>
						<TabsTrigger
							value="assignments"
							className="data-[state=active]:after:bg-primary relative flex-col rounded-none px-4 py-2 text-sm after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
						>
							<Paperclip
								className="mb-1.5 opacity-60"
								size={18}
								aria-hidden="true"
							/>
							Assignments
						</TabsTrigger>
						<TabsTrigger
							value="notes"
							className="data-[state=active]:after:bg-primary relative flex-col rounded-none px-4 py-2 text-sm after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
						>
							<Notebook
								className="mb-1.5 opacity-60"
								size={18}
								aria-hidden="true"
							/>
							Notes
						</TabsTrigger>
						<TabsTrigger
							value="projects"
							className="data-[state=active]:after:bg-primary relative flex-col rounded-none px-4 py-2 text-sm after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
						>
							<PanelsTopLeftIcon
								className="mb-1.5 opacity-60"
								size={18}
								aria-hidden="true"
							/>
							Projects
						</TabsTrigger>
						<TabsTrigger
							value="syllabus"
							className="data-[state=active]:after:bg-primary relative flex-col rounded-none px-4 py-2 text-sm after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
						>
							<Scroll
								className="mb-1.5 opacity-60"
								size={18}
								aria-hidden="true"
							/>
							Syllabus
						</TabsTrigger>
						<TabsTrigger
							value="details"
							className="data-[state=active]:after:bg-primary relative flex-col rounded-none px-4 py-2 text-sm after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
						>
							<Text
								className="mb-1.5 opacity-60"
								size={18}
								aria-hidden="true"
							/>
							Details
						</TabsTrigger>
						<TabsTrigger
							value="settings"
							className="data-[state=active]:after:bg-primary relative flex-col rounded-none px-4 py-2 text-sm after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
						>
							<Settings
								className="mb-1.5 opacity-60"
								size={18}
								aria-hidden="true"
							/>
							Settings
						</TabsTrigger>
					</TabsList>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
				<TabsContent value="overview">
					<p className="p-4 pt-1 text-xs text-center text-muted-foreground">
						Overview
					</p>
				</TabsContent>
				<TabsContent value="assignments">
					<p className="p-4 pt-1 text-xs text-center text-muted-foreground">
						Assignments
					</p>
				</TabsContent>
				<TabsContent value="notes">
					<p className="p-4 pt-1 text-xs text-center text-muted-foreground">
						Notes
					</p>
				</TabsContent>
				<TabsContent value="projects">
					<p className="p-4 pt-1 text-xs text-center text-muted-foreground">
						Projects
					</p>
				</TabsContent>
				<TabsContent value="syllabus">
					<p className="p-4 pt-1 text-xs text-center text-muted-foreground">
						Syllabus
					</p>
				</TabsContent>
				<TabsContent value="settings">
					<SettingsView course={course} />
				</TabsContent>
				<TabsContent value="details">
					<DetailsView course={course} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default CoursePage;
