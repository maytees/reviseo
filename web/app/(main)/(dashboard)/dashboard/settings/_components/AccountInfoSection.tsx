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
					<div className="p-2 rounded-md bg-muted">
						<CalendarDays className="size-4 text-muted-foreground" />
					</div>
					<div>
						<p className="text-sm font-medium">Member Since</p>
						<p className="text-sm text-muted-foreground">{memberSince}</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="p-2 rounded-md bg-muted">
						<IdCard className="size-4 text-muted-foreground" />
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium">Account ID</p>
						<p className="text-xs text-muted-foreground font-mono break-all">
							{user.id}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							Use this ID when contacting support
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
