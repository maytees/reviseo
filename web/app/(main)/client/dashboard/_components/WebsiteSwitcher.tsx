"use client";

import { GlobeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

/** Page-level site scope: the whole dashboard shows one website at a time. */
export default function WebsiteSwitcher({
	websites,
	selectedId,
}: {
	websites: { id: string; name: string }[];
	selectedId: string;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	return (
		<Select
			value={selectedId}
			disabled={isPending}
			onValueChange={(value) =>
				startTransition(() => {
					router.push(`/client/dashboard?site=${value}`);
				})
			}
		>
			<SelectTrigger className="w-64">
				<span className="flex min-w-0 items-center gap-2">
					<GlobeIcon className="size-4 shrink-0 text-primary" />
					<SelectValue />
				</span>
			</SelectTrigger>
			<SelectContent>
				{websites.map((website) => (
					<SelectItem key={website.id} value={website.id}>
						{website.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
