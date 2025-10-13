"use client";

import type { AssignmentsType } from "@/app/data/user/get-all-assignments";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { format, isThisYear } from "date-fns";
import { AlarmClock, ArrowUpDown, Check, Loader2 } from "lucide-react";
import AssignmentDropdown from "./AssignmentDropdown";
import { priorityIconMap } from "./AssignmentTable";

const statusMap = {
	in_progress: "In Progress",
	todo: "Todo",
	completed: "Completed",
};

const statusVariantMap = {
	in_progress: "info",
	todo: "warning",
	completed: "success",
};

const priorityMap = {
	low: "info",
	medium: "primary",
	high: "warning",
	urgent: "destructive",
};

const priorityOrder = {
	urgent: 0,
	high: 1,
	medium: 2,
	low: 3,
};

export const assignmentColumns: ColumnDef<AssignmentsType>[] = [
	{
		accessorKey: "title",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Title
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "course",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Course
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const courseName = row.original.course.name;
			const courseColor = row.original.course.color;

			return (
				<div className="flex flex-row items-center gap-2">
					<div className={`${courseColor} size-3 rounded-full `} />
					{courseName}
				</div>
			);
		},
		sortingFn: (rowA, rowB) => {
			const courseNameA = rowA.original.course.name;
			const courseNameB = rowB.original.course.name;
			return courseNameA.localeCompare(courseNameB);
		},
	},
	{
		accessorKey: "dueDate",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Due
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const formatDueDate = (date: Date, neat: boolean = false) => {
				const isToday = (d: Date) => {
					const now = new Date();
					return (
						d.getDate() === now.getDate() &&
						d.getMonth() === now.getMonth() &&
						d.getFullYear() === now.getFullYear()
					);
				};

				const isTomorrow = (d: Date) => {
					const tomorrow = new Date();
					tomorrow.setDate(tomorrow.getDate() + 1);
					return (
						d.getDate() === tomorrow.getDate() &&
						d.getMonth() === tomorrow.getMonth() &&
						d.getFullYear() === tomorrow.getFullYear()
					);
				};

				const formatTimeNaturally = (d: Date) => {
					const hours = d.getHours();
					const minutes = d.getMinutes();

					// Check if within 5 minutes of specific times
					const totalMinutes = hours * 60 + minutes;

					// Midnight (0:00) - check 23:55-00:05
					if (
						(totalMinutes >= 1435 && totalMinutes <= 1439) ||
						(totalMinutes >= 0 && totalMinutes <= 5)
					) {
						return "at midnight";
					}
					// Noon (12:00) - check 11:55-12:05
					if (totalMinutes >= 715 && totalMinutes <= 725) {
						return "at noon";
					}
					// Morning (9:00) - check 8:55-9:05
					if (totalMinutes >= 535 && totalMinutes <= 545) {
						return "in the morning";
					}
					// Evening (6:00 PM / 18:00) - check 17:55-18:05
					if (totalMinutes >= 1075 && totalMinutes <= 1085) {
						return "in the evening";
					}

					return `at ${format(d, "h:mm a")}`;
				};

				if (neat) {
					const now = new Date();
					const diffInMs = date.getTime() - now.getTime();
					const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

					if (diffInDays === 0) return `today ${formatTimeNaturally(date)}`;
					if (diffInDays === 1) return `tomorrow ${formatTimeNaturally(date)}`;
					if (diffInDays === -1) return "yesterday";
					if (diffInDays > 1 && diffInDays <= 7) return `in ${diffInDays} days`;
					if (diffInDays < -1 && diffInDays >= -7)
						return `${Math.abs(diffInDays)} days ago`;
				}

				// Add time for today or tomorrow even when neat is false
				if (isToday(date)) {
					const naturalTime = formatTimeNaturally(date);
					return naturalTime.startsWith("at")
						? naturalTime.substring(3)
						: naturalTime; // Remove "at" prefix for today
				}
				if (isTomorrow(date)) {
					return `tomorrow ${formatTimeNaturally(date)}`;
				}

				if (isThisYear(date)) {
					return format(date, "MMM d"); // "Sep 28"
				}
				return format(date, "MMM d, yyyy"); // "Sep 28, 2025"
			};

			const dueDate = row.original.dueDate;

			return <div>{formatDueDate(dueDate, true)}</div>;
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Status
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<Badge
					appearance={"outline"}
					variant={
						statusVariantMap[
						row.original.status as keyof typeof statusVariantMap
						] as keyof typeof badgeVariants
					}
				>
					{row.original.status === "in_progress" ? (
						<Loader2 />
					) : row.original.status === "todo" ? (
						<AlarmClock />
					) : (
						<Check />
					)}

					{statusMap[row.original.status as keyof typeof statusMap]}
				</Badge>
			);
		},
	},
	{
		accessorKey: "priority",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Priority
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (rowA, rowB) => {
			const priorityA =
				priorityOrder[rowA.original.priority as keyof typeof priorityOrder];
			const priorityB =
				priorityOrder[rowB.original.priority as keyof typeof priorityOrder];
			return priorityA - priorityB;
		},
		cell: ({ row }) => {
			const assignment = row.original;
			return (
				<Badge
					appearance={"outline"}
					variant={
						priorityMap[
						assignment.priority as keyof typeof priorityMap
						] as keyof typeof badgeVariants
					}
				>
					{priorityIconMap[assignment.priority as keyof typeof priorityIconMap]}
					{`${assignment.priority.at(0)?.toUpperCase()}${assignment.priority.substring(1)}`}
				</Badge>
			);
		},
	},
	{
		accessorKey: "type",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Type
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const assignment = row.original;

			return (
				<Badge
					variant={"secondary"}
				>{`${assignment.type?.at(0)?.toUpperCase()}${assignment.type?.substring(1)}`}</Badge>
			);
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const assignment = row.original;

			return <AssignmentDropdown assignment={assignment} />;
		},
	},
];
