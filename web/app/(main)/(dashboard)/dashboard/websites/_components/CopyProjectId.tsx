"use client";

import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";

const CopyProjectId = ({ projectId }: { projectId: string }) => {
	const [_, copy] = useCopyToClipboard();
	const [isMounted, setIsMounted] = useState(false);

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
		<Button
			onClick={handleCopy(projectId)}
			variant={"outline"}
			size={"sm"}
			mode={"icon"}
		>
			<Copy />
		</Button>
	);
};

export default CopyProjectId;
