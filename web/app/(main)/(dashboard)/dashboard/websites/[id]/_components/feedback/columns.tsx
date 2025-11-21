"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Trash } from "lucide-react";
import type React from "react";
import { useState } from "react";
import ScreenshotPreview from "@/app/(main)/(dashboard)/dashboard/_components/ScreenshotPreview";
import type { WebsiteDataTypeNonNullable } from "@/app/data/website/get-website-by-id-and-dev-id";
import { Badge, type BadgeVariantsType } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	PRIORITY_BADGE_MAP,
	PRIORITY_CONFIG,
	STATUS_BADGE_MAP,
	STATUS_CONFIG,
	TYPE_BADGE_MAP,
	TYPE_CONFIG,
} from "@/lib/types";
import DeleteFeedbackDialog from "./DeleteFeedbackDialog";

type Feedback = WebsiteDataTypeNonNullable["feedback"][number];

export const columns: ColumnDef<Feedback>[] = [
	{
		accessorKey: "screenshotKey",
		header: "Screenshot",
		cell: ({ row }) => {
			const screenshotKey = row.getValue("screenshotKey") as string;
			return (
				// biome-ignore lint/a11y/noStaticElementInteractions: goon need this
				// biome-ignore lint/a11y/useKeyWithClickEvents: goon need this
				<div onClick={(e) => e.stopPropagation()}>
					<ScreenshotPreview app_url={""} screenshotKey={screenshotKey} />{" "}
				</div>
			);
		},
	},
	{
		accessorKey: "title",
		header: ({ column }) => {
			return (
				<Button
					variant="foreground"
					className="p-0 py-0"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Title
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const title = row.getValue("title") as string;
			return <div className="font-medium">{title}</div>;
		},
	},
	{
		accessorKey: "author",
		header: ({ column }) => {
			return (
				<Button
					className="p-0 py-0"
					variant="foreground"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Author
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const author = row.getValue("author") as Feedback["author"];

			if (!author) {
				return (
					<Button size="sm" variant="outline" disabled>
						Invite Client
					</Button>
				);
			}

			return (
				<div className="flex flex-col">
					<span className="font-medium">{author.name}</span>
					<span className="text-muted-foreground text-xs">{author.email}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<Button
					className="p-0 py-0"
					variant="foreground"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Status
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		// cell: ({ row }) => {
		// 	const status = row.getValue("status") as string;
		// 	return (
		// 		<Badge variant="outline" size="sm">
		// 			{status.replace("_", " ")}
		// 		</Badge>
		// 	);
		// },

		cell: ({ row }) => {
			const status = row.getValue("status") as keyof typeof STATUS_BADGE_MAP;
			const StatusIcon = STATUS_CONFIG[status].icon;

			return (
				<Tooltip>
					<TooltipTrigger>
						<Badge
							variant={STATUS_BADGE_MAP[status]}
							appearance="outline"
							size="sm"
							className="hover:cursor-default"
						>
							<StatusIcon />
							{STATUS_CONFIG[status].label}
						</Badge>
					</TooltipTrigger>
					<TooltipContent>{STATUS_CONFIG[status].label} Status</TooltipContent>
				</Tooltip>
			);
		},
	},
	{
		accessorKey: "type",
		header: ({ column }) => {
			return (
				<Button
					className="p-0 py-0"
					variant="foreground"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Type
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const type = row.getValue("type") as keyof typeof TYPE_BADGE_MAP;
			const TypeIcon = TYPE_CONFIG[type].icon;

			return (
				<Tooltip>
					<TooltipTrigger>
						<Badge
							variant={TYPE_BADGE_MAP[type]}
							appearance="outline"
							size="sm"
							className="hover:cursor-default"
						>
							<TypeIcon />
							{TYPE_CONFIG[type].label}
						</Badge>
					</TooltipTrigger>
					<TooltipContent>{TYPE_CONFIG[type].label}</TooltipContent>
				</Tooltip>
			);
		},
	},
	{
		accessorKey: "priority",
		header: ({ column }) => {
			return (
				<Button
					className="p-0 py-0"
					variant="foreground"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Priority
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const priority = row.getValue(
				"priority",
			) as keyof typeof PRIORITY_BADGE_MAP;
			const PriorityIcon = PRIORITY_CONFIG[priority].icon;

			return (
				<Tooltip>
					<TooltipTrigger>
						<Badge
							variant={PRIORITY_BADGE_MAP[priority] as BadgeVariantsType}
							appearance="outline"
							size="sm"
							className="hover:cursor-default"
						>
							<PriorityIcon />
							{PRIORITY_CONFIG[priority].label}
						</Badge>
					</TooltipTrigger>
					<TooltipContent>
						{PRIORITY_CONFIG[priority].label} Priority
					</TooltipContent>
				</Tooltip>
			);
		},
	},
	// {
	// 	accessorKey: "pageUrl",
	// 	header: "Page URL",
	// 	cell: ({ row }) => {
	// 		const pageUrl = row.getValue("pageUrl") as string;
	// 		return (
	// 			<Tooltip>
	// 				<TooltipTrigger>
	// 					<span className="text-sm text-muted-foreground truncate max-w-[200px] block">
	// 						{pageUrl}
	// 					</span>
	// 				</TooltipTrigger>
	// 				<TooltipContent>
	// 					<Link href={pageUrl} target="_blank" className="hover:underline">
	// 						{pageUrl}
	// 					</Link>
	// 				</TooltipContent>
	// 			</Tooltip>
	// 		);
	// 	},
	// },
	// {
	// 	accessorKey: "createdAt",
	// 	header: ({ column }) => {
	// 		return (
	// 			<Button
	// 				variant="foreground"
	// 				className="p-0 py-0 "
	// 				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
	// 			>
	// 				Created
	// 				<ArrowUpDown className="w-4 h-4 ml-2" />
	// 			</Button>
	// 		);
	// 	},
	// 	cell: ({ row }) => {
	// 		const createdAt = row.getValue("createdAt") as Date;
	// 		return (
	// 			<Badge variant="outline" size="sm">
	// 				{moment(createdAt).fromNow()}
	// 			</Badge>
	// 		);
	// 	},
	// },
	{
		id: "actions",
		cell: ({ row }) => {
			const feedback = row.original;
			const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

			const handleDelete = (_: React.MouseEvent) => {
				setDeleteDialogOpen(true);
			};

			return (
				// biome-ignore lint/a11y/noStaticElementInteractions: goon
				// biome-ignore lint/a11y/useKeyWithClickEvents: goon
				<div onClick={(e) => e.stopPropagation()}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{/* TODO: Add more */}
							{/* <DropdownMenuItem>
								<CopyIcon size={16} className="opacity-60" aria-hidden="true" />
								Open
							</DropdownMenuItem> */}
							<DropdownMenuItem onClick={handleDelete} variant="destructive">
								<Trash size={16} className="opacity-60" aria-hidden="true" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<DeleteFeedbackDialog
						feedbackId={feedback.id}
						open={deleteDialogOpen}
						onOpenChange={setDeleteDialogOpen}
					/>
				</div>
			);
		},
	},
];
