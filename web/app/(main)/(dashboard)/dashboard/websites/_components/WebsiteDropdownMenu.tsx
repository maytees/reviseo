"use client";
import {
	Code,
	Copy,
	EllipsisVertical,
	LinkIcon,
	Pencil,
	Trash,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";
import DeleteWebsiteDialog from "./DeleteWebsiteDialog";

const snippet = (projectId: string) => {
	return `<script
  src="https://reviseo.app/cdn/reviseo.js"
  data-project-id="${projectId}"
></script>`;
};

const WebsiteDropdownMenu = ({
	websiteId,
	projectId,
	websiteName,
}: {
	websiteId: string;
	projectId: string;
	websiteName: string;
}) => {
	const [isMounted, setIsMounted] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [_, copy] = useCopyToClipboard();

	const handleCopy = (text: string) => () => {
		copy(text)
			.then(() => {
				toast.success("Copied!", {
					description: text,
				});
			})
			.catch((error) => {
				toast.error("Failed to copy!", { description: error });
			});
	};

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button mode={"icon"} variant="outline" size="sm">
						<EllipsisVertical />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem asChild>
						<Link href={`/dashboard/websites/${websiteId}`}>
							<LinkIcon />
							Open
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={`/dashboard/websites/${websiteId}`}>
							<Pencil />
							Edit
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleCopy(snippet(projectId))}>
						<Code />
						Copy Snippet
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleCopy(projectId)}>
						<Copy />
						Project Id
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						onClick={() => setDeleteDialogOpen(true)}
					>
						<Trash />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<DeleteWebsiteDialog
				websiteId={websiteId}
				websiteName={websiteName}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			/>
		</>
	);
};

export default WebsiteDropdownMenu;
