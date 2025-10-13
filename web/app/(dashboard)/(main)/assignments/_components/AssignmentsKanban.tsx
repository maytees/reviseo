"use client";
import { CircleIcon, FlagIcon, FlameIcon, MinusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { AssignmentsType } from "@/app/data/user/get-all-assignments";
import { Badge } from "@/components/ui/badge";
import {
	Kanban,
	KanbanBoard,
	KanbanColumn,
	KanbanColumnContent,
	KanbanItem,
	KanbanItemHandle,
	KanbanOverlay,
} from "@/components/ui/kanban";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { tryCatch } from "@/lib/try-catch";
import { updateAssignmentStatus } from "../actions";
import AssignmentDropdown from "./AssignmentDropdown";

function groupAssignmentsByStatus(assignments: AssignmentsType[]) {
	return assignments.reduce<Record<string, AssignmentsType[]>>(
		(acc, assignment) => {
			acc[assignment.status].push(assignment);
			return acc;
		},
		{ todo: [], in_progress: [], completed: [] },
	);
}

const COLUMN_TITLES: Record<string, string> = {
	todo: "Todo",
	in_progress: "In Progress",
	completed: "Completed",
};

const priorityIconMap = {
	low: <MinusCircleIcon className="text-violet-500 size-3" />,
	medium: <CircleIcon className="text-cyan-500 size-3" />,
	high: <FlagIcon className="text-yellow-500 size-3" />,
	urgent: <FlameIcon className="text-destructive size-3" />,
};

interface AssignmentColumnProps
	extends Omit<React.ComponentProps<typeof KanbanColumn>, "children"> {
	assignments: AssignmentsType[];
	isOverlay?: boolean;
}

interface AssignmentCardProps
	extends Omit<React.ComponentProps<typeof KanbanItem>, "value" | "children"> {
	assignment: AssignmentsType;
	asHandle?: boolean;
}

function AssignmentCard({
	assignment,
	asHandle,
	...props
}: AssignmentCardProps) {
	const cardContent = (
		<div className="rounded-md border bg-card p-3 shadow-xs hover:shadow-sm transition-shadow">
			<div className="flex flex-col gap-3">
				<div className="flex items-start justify-between gap-2">
					<h3 className="line-clamp-2 font-medium text-base leading-tight">
						{assignment.title}
					</h3>
					<div className="flex items-center gap-1 shrink-0">
						{
							priorityIconMap[
								assignment.priority as keyof typeof priorityIconMap
							]
						}
						<AssignmentDropdown assignment={assignment} />
					</div>
				</div>

				{assignment.description && (
					<p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
						{assignment.description}
					</p>
				)}

				<div className="flex items-center justify-between gap-2">
					<Badge
						variant={
							assignment.priority === "urgent"
								? "destructive"
								: assignment.priority === "high"
									? "warning"
									: assignment.priority === "medium"
										? "primary"
										: "secondary"
						}
						appearance="outline"
						className="h-6 rounded-sm px-2 text-xs capitalize shrink-0"
					>
						{assignment.priority}
					</Badge>

					{assignment.dueDate && (
						<time className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
							Due{" "}
							{assignment.dueDate.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
							})}
						</time>
					)}
				</div>

				{assignment.course.name && (
					<div className="pt-1 border-t">
						<span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
							{assignment.course.name}
						</span>
					</div>
				)}
			</div>
		</div>
	);

	return (
		<KanbanItem value={assignment.id} {...props}>
			{asHandle ? (
				<KanbanItemHandle>{cardContent}</KanbanItemHandle>
			) : (
				cardContent
			)}
		</KanbanItem>
	);
}

function AssignmentsColumn({
	value,
	assignments,
	isOverlay,
	...props
}: AssignmentColumnProps) {
	return (
		<KanbanColumn
			value={value}
			{...props}
			className="rounded-md border bg-card p-2.5 shadow-xs"
		>
			<div className="flex items-center justify-between ">
				<div className="flex items-center gap-2.5">
					<span className="font-semibold">{COLUMN_TITLES[value]}</span>
					<Badge variant="secondary">{assignments.length}</Badge>
				</div>
			</div>
			<Separator className="my-3" />
			<KanbanColumnContent
				value={value}
				className="flex flex-col gap-2.5 p-0.5"
			>
				{assignments.map((a) => (
					<AssignmentCard key={a.id} assignment={a} asHandle={!isOverlay} />
				))}
			</KanbanColumnContent>
		</KanbanColumn>
	);
}
const AssignmentsKanban = ({
	assignments,
}: {
	assignments: AssignmentsType[];
}) => {
	const [columns, setColumns] = useState(groupAssignmentsByStatus(assignments));
	const [pending, startTransition] = useTransition();
	const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "course">(
		"dueDate",
	);
	const router = useRouter();

	const sortAssignments = (assignments: AssignmentsType[]) => {
		return [...assignments].sort((a, b) => {
			if (sortBy === "dueDate") {
				return (a.dueDate?.getTime() ?? 0) - (b.dueDate?.getTime() ?? 0);
			} else if (sortBy === "priority") {
				const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
				return priorityOrder[a.priority] - priorityOrder[b.priority];
			} else if (sortBy === "course") {
				return a.course.name.localeCompare(b.course.name);
			}
			return 0;
		});
	};

	return (
		<div className="mt-5">
			<div className="flex items-center justify-start mb-4">
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">Sort by:</span>
					<Select
						value={sortBy}
						onValueChange={(value) =>
							setSortBy(value as "dueDate" | "priority" | "course")
						}
						disabled={pending}
					>
						<SelectTrigger size="sm">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="dueDate">Due Date</SelectItem>
							<SelectItem value="priority">Priority</SelectItem>
							<SelectItem value="course">Course</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<Kanban
				value={columns}
				onValueChange={setColumns}
				getItemValue={(item) => item.id}
				className="mt-5"
				onDragEnd={({ event, activeContainer, overContainer }) => {
					if (!overContainer || !activeContainer) return;

					// Find the moved assignment directly from its id
					const activeId = event.active.id;
					const movedAssignment = columns[activeContainer].find(
						(item) => item.id === activeId,
					);
					if (!movedAssignment) return;

					const newStatus = overContainer as
						| "todo"
						| "in_progress"
						| "completed";

					startTransition(async () => {
						const { data: result, error } = await tryCatch(
							updateAssignmentStatus(movedAssignment.id, newStatus),
						);

						if (error) {
							toast.error("An unexpected error occurred. Please try again.");
							return;
						}
						if (result.status === "success") {
							toast.success(result.message);
							router.refresh();
						} else {
							toast.error(result.message);
						}
					});
				}}
			>
				<KanbanBoard className="grid auto-rows-fr grid-cols-3 gap-4">
					{Object.entries(columns).map(([columnValue, a]) => (
						<AssignmentsColumn
							key={columnValue}
							value={columnValue}
							assignments={sortAssignments(a)}
						/>
					))}
				</KanbanBoard>
				<KanbanOverlay>
					<div className="rounded-md bg-muted/60 size-full" />
				</KanbanOverlay>
			</Kanban>
		</div>
	);
};

export default AssignmentsKanban;
