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
import type { Website } from "@/prisma/generated/client";
import EditWebsiteDetailsDialog from "../[id]/_components/EditWebsiteDetailsDialog";
import DeleteWebsiteDialog from "./DeleteWebsiteDialog";

const snippet = (projectId: string) => {
	return `<script
  src="https://reviseo.app/cdn/reviseo.js"
  data-project-id="${projectId}"
></script>`;
};

const WebsiteDropdownMenu = ({
	website,
	open = false,
}: {
	open?: boolean;
	website: Website;
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
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button mode={"icon"} variant="outline" size="sm">
						<EllipsisVertical />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{open && (
						<DropdownMenuItem asChild>
							<Link href={`/dashboard/websites/${website.id}`}>
								<LinkIcon />
								Open
							</Link>
						</DropdownMenuItem>
					)}
					<EditWebsiteDetailsDialog website={website}>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							<Pencil />
							Edit
						</DropdownMenuItem>
					</EditWebsiteDetailsDialog>
					<DropdownMenuItem onClick={handleCopy(snippet(website.projectId))}>
						<Code />
						Copy Snippet
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleCopy(website.projectId)}>
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
				websiteId={website.id}
				websiteName={website.name}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			/>
		</>
	);
};

export default WebsiteDropdownMenu;
