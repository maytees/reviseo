"use client";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";
import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";

const CopyEmail = ({ email }: { email: string }) => {
	const [_, copy] = useCopyToClipboard();
	const isMounted = useIsMounted();

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

	if (!isMounted) return null;

	return (
		<Button
			className="hidden md:flex"
			onClick={handleCopy(email)}
			variant={"ghost"}
			size={"sm"}
		>
			<Copy />
			Copy Email
		</Button>
	);
};

export default CopyEmail;
