"use client";

import { CheckCircle, Inbox, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { tryCatch } from "@/lib/try-catch";
import type { FeedbackSelectAllPayload } from "@/lib/types";
import type { FeedbackStatus } from "@/prisma/generated/client";
import { updateFeedbackStatus } from "./actions";

const SelectStatus = ({ feedback }: { feedback: FeedbackSelectAllPayload }) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const onChange = (value: FeedbackStatus) => {
		startTransition(async () => {
			// TODO: rename all those stupid actions from onboarding
			const { data: result, error } = await tryCatch(
				updateFeedbackStatus(feedback.id, feedback.websiteId, value),
			);

			if (error) {
				toast.error("An unexpected error occurred. Please try again.");
				return;
			}

			if (result.status === "success") {
				router.refresh();
				toast.success(result.message);
			} else if (result.status === "error") {
				toast.error(result.message);
			}
		});
	};

	return (
		<Select
			defaultValue={feedback.status}
			onValueChange={(val) => onChange(val as FeedbackStatus)}
			indicatorPosition="right"
			disabled={isPending}
		>
			<SelectTrigger className="w-fit">
				<SelectValue placeholder="Priority" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="NEW">
					<span className="flex items-center gap-2 text-blue-300">
						<Inbox className="size-4" />
						<span>New</span>
					</span>
				</SelectItem>
				<SelectItem value="IN_PROGRESS">
					<span className="flex items-center gap-2 text-amber-300">
						<Play className="size-4" />
						<span>In Progress</span>
					</span>
				</SelectItem>
				<SelectItem value="RESOLVED">
					<span className="flex items-center gap-2 text-emerald-300">
						<CheckCircle className="size-4" />
						<span>Resolved</span>
					</span>
				</SelectItem>
			</SelectContent>
		</Select>
	);
};

export default SelectStatus;
