import { getAllAssignments } from "@/app/data/user/get-all-assignments";
import { getAllCourses } from "@/app/data/user/get-all-courses";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, Table } from "lucide-react";
import { Suspense } from "react";
import AssignmentsKanban from "./_components/AssignmentsKanban";
import AssignmentTable from "./_components/AssignmentTable";
import CreateAssignmentDialog from "./_components/CreateAssignmentDialog";


const CalendarPage = async () => {
	const courses = await getAllCourses();
	const assignments = await getAllAssignments();

	return (
		<div>
			<div className="flex items-center gap-4">
				<h1 className="text-xl font-bold">Your Assignments</h1>
				<Suspense fallback={<Skeleton className="w-10 h-5" />}>
					<CreateAssignmentDialog courses={courses} />
				</Suspense>
			</div>
			<Tabs className="mt-10" defaultValue="table">
				<TabsList>
					<TabsTrigger value={"table"}>
						<Table />
						Table
					</TabsTrigger>
					<TabsTrigger value={"kanban"}>
						<Kanban />
						Kanban
					</TabsTrigger>
				</TabsList>

				<Suspense fallback="Loading Assignments...">
					<TabsContent value={"table"}>
						<AssignmentTable assignments={assignments} />
					</TabsContent>
					<TabsContent value="kanban">
						<AssignmentsKanban assignments={assignments} />
					</TabsContent>
				</Suspense>
			</Tabs>
		</div>
	);
};

export default CalendarPage;
