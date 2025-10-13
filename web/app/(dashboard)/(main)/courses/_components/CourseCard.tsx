"use client";

import { Archive, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteCourseDialog from "./DeleteCourseDialog";

// import { ImageSelectorDialog } from "./image-selector-dialog";

interface CourseCardProps {
	id: string;
	title: string;
	code: string;
	semester: string;
	color: string;
	image: string;
	isArchived?: boolean;
	onArchive?: (id: string) => void;
	onDelete?: (id: string) => void;
	onGoToCourse?: (id: string) => void;
	// onImageChange?: (id: string, image: string) => void;
}

export function CourseCard({
	id,
	title,
	code,
	semester,
	color,
	// image,
	isArchived = false,
	onArchive,
	// onDelete,
	// onGoToCourse,
	// onImageChange,
}: CourseCardProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	return (
		<>
			<Card className="relative overflow-hidden transition-all duration-200 group border-border/50 bg-card/50 backdrop-blur-sm hover:border-border hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5">
				<div className="relative">
					{/* Course Color Bar */}
					<div className={`h-2 w-full ${color}`} />

					{/* Course Image */}
					{/* <div className="relative h-32 overflow-hidden">
						<Image
							src={image || "/placeholder.svg"}
							alt={`${title} course image`}
							fill
							className="object-cover transition-transform duration-200 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
					</div> */}

					{/* Dropdown Menu */}
					<div className="absolute right-2 top-4">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="w-8 h-8 text-white bg-black/20 backdrop-blur-sm hover:bg-black/40"
								>
									<MoreVertical className="w-4 h-4" />
									<span className="sr-only">Course options</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem asChild>
									<Link href={`/courses/${id}`}>
										<ExternalLink className="w-4 h-4 mr-2" />
										Go to Course
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								{/* <DropdownMenuItem onClick={() => setImageDialogOpen(true)}>
									<ImageIcon className="w-4 h-4 mr-2" />
									Change Image
								</DropdownMenuItem> */}
								<DropdownMenuItem onClick={() => onArchive?.(id)}>
									<Archive className="w-4 h-4 mr-2" />
									{isArchived ? "Unarchive" : "Archive"} Course
								</DropdownMenuItem>
								<DropdownMenuItem
									variant="destructive"
									onClick={() => setDeleteDialogOpen(true)}
								>
									<Trash2 className="w-4 h-4 mr-2" />
									Delete Course
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<CardContent className="p-4">
					<div className="space-y-3">
						{/* Course Title and Code */}
						<div>
							<h3 className="font-semibold leading-tight text-card-foreground text-balance">
								{title}
							</h3>
							<p className="font-mono text-sm text-muted-foreground">{code}</p>
						</div>

						{/* Semester and Status */}
						<div className="flex items-center justify-between">
							<Badge variant="secondary" className="text-xs">
								{semester}
							</Badge>
							{isArchived && (
								<Badge
									variant="outline"
									className="text-xs text-muted-foreground"
								>
									Archived
								</Badge>
							)}
						</div>

						{/* Go to Course Button */}
						<Button variant={"mono"} asChild className="w-full mt-3" size="sm">
							<Link href={`/courses/${id}`}>Go to Course</Link>
						</Button>
					</div>
				</CardContent>
			</Card>

			<DeleteCourseDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				title={title}
				id={id}
				setOpen={setDeleteDialogOpen}
			/>
		</>
	);
}
