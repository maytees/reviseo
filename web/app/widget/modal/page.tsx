"use client";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";

const ReviseoModal = () => {
	const [open, setOpen] = useState(true);

	useEffect(() => {
		if (!open) {
			window.parent.postMessage({ type: "CLOSE_FORM" }, "*");
		}
	}, [open]);

	return (
		<Dialog open={true} onOpenChange={setOpen}>
			<DialogContent variant={"fullscreen"}>
				<DialogTitle>Test</DialogTitle>
				<DialogDescription>Fill out the form to complete</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};

export default ReviseoModal;
