import { CalendarDays, IdCard } from "lucide-react";
import type { getUserData } from "@/app/data/user/get-user-data";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";

interface AccountInfoSectionProps {
	user: NonNullable<Awaited<ReturnType<typeof getUserData>>>;
}

export default function AccountInfoSection({ user }: AccountInfoSectionProps) {
	const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Account Information</CardTitle>
				<CardDescription>
					View your account details and membership information.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center gap-3">
					<div className="rounded-md bg-muted p-2">
						<CalendarDays className="size-4 text-muted-foreground" />
					</div>
					<div>
						<p className="font-medium text-sm">Member Since</p>
						<p className="text-muted-foreground text-sm">{memberSince}</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="rounded-md bg-muted p-2">
						<IdCard className="size-4 text-muted-foreground" />
					</div>
					<div className="flex-1">
						<p className="font-medium text-sm">Account ID</p>
						<p className="break-all font-mono text-muted-foreground text-xs">
							{user.id}
						</p>
						<p className="mt-1 text-muted-foreground text-xs">
							Use this ID when contacting support
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
