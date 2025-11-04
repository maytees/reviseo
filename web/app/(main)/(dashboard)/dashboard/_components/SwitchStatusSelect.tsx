"use client";
import { Circle } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { FeedbackStatus } from "@/prisma/generated/client";

const SwitchStatusSelect = ({ status }: { status: FeedbackStatus }) => {
	return (
		<Select defaultValue={status}>
			<SelectTrigger size={"sm"} className="w-[120px]">
				<SelectValue placeholder="Status" />
			</SelectTrigger>
			<SelectContent defaultValue={status}>
				<SelectItem value="NEW">
					<span className="flex items-center gap-2">
						<Circle className="size-4 opacity-60" />
						<span>New</span>
					</span>
				</SelectItem>
				<SelectItem value="IN_PROGRESS">In Progress</SelectItem>
				<SelectItem value="RESOLVED">Resolved</SelectItem>
			</SelectContent>
		</Select>
	);
};

export default SwitchStatusSelect;
