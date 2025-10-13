"use client";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { CircleIcon, FlagIcon, FlameIcon, MinusCircleIcon } from "lucide-react";
import { useState } from "react";
import type { AssignmentsType } from "@/app/data/user/get-all-assignments";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { assignmentColumns } from "./columns";

export const priorityIconMap = {
	low: <MinusCircleIcon className="text-violet-500" />, // Violet-500
	medium: <CircleIcon className="text-cyan-500" />, // Blue-500
	high: <FlagIcon className="text-yellow-500" />, // Yellow-500
	urgent: <FlameIcon className="text-destructive" />, // text-destructive
};

const AssignmentTable = ({
	assignments,
}: {
	assignments: AssignmentsType[];
}) => {
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data: assignments,
		columns: assignmentColumns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	return (
		<Table className="mt-5">
			<TableCaption>A list of your active and past assignments.</TableCaption>
			<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							return (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</TableHead>
							);
						})}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => (
						<TableRow
							key={row.id}
							data-state={row.getIsSelected() && "selected"}
							className="w-full"
						>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell
							colSpan={assignmentColumns.length}
							className="h-24 text-center text-muted-foreground"
						>
							No results.
						</TableCell>
					</TableRow>
				)}
			</TableBody>

			<TableFooter>
				<TableRow>
					<TableCell colSpan={assignmentColumns.length - 1}>
						Total Assignments
					</TableCell>
					<TableCell className="text-right">{assignments.length}</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
};

export default AssignmentTable;
