"use client";

import { Copy, EllipsisVertical, MailX } from "lucide-react";
import { useState } from "react";
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
import RemoveClientDialog from "./RemoveClient";

interface ClientDropdownMenuProps {
	websiteId: string;
	clientId: string;
	clientEmail: string;
}

const ClientDropdownMenu = ({
	websiteId,
	clientId,
	clientEmail,
}: ClientDropdownMenuProps) => {
	const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
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

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button mode={"icon"} variant="outline" size="sm">
						<EllipsisVertical />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={handleCopy(clientEmail)}>
						<Copy />
						Copy Email
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						onClick={() => setRemoveDialogOpen(true)}
					>
						<MailX />
						Remove Client
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<RemoveClientDialog
				websiteId={websiteId}
				clientId={clientId}
				open={removeDialogOpen}
				onOpenChange={setRemoveDialogOpen}
			/>
		</>
	);
};

export default ClientDropdownMenu;
