"use client";

import { Bell } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import type { getUserData } from "@/app/data/user/get-user-data";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import { Switch } from "@/components/ui/switch";
import { tryCatch } from "@/lib/try-catch";
import { toggleEmailNotifications } from "../actions";

interface NotificationsSectionProps {
	user: NonNullable<Awaited<ReturnType<typeof getUserData>>>;
}

export default function NotificationsSection({
	user,
}: NotificationsSectionProps) {
	const [isPending, startTransition] = useTransition();

	const handleToggle = (enabled: boolean) => {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				toggleEmailNotifications(enabled),
			);

			if (error) {
				toast.error("An unexpected error occurred. Please try again.");
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Notifications</CardTitle>
				<CardDescription>
					Manage how you receive notifications from Reviseo.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-md bg-muted">
							<Bell className="size-4 text-muted-foreground" />
						</div>
						<div>
							<p className="text-sm font-medium">Email Notifications</p>
							<p className="text-sm text-muted-foreground">
								Receive emails when new feedback is submitted
							</p>
						</div>
					</div>
					<Switch
						checked={user.emailNotifications ?? true}
						onCheckedChange={handleToggle}
						disabled={isPending}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
