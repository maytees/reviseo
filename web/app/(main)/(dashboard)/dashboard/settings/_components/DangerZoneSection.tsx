import { AlertTriangle } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import DeleteAccountDialog from "./DeleteAccountDialog";

export default function DangerZoneSection() {
	return (
		<Card className="border-destructive/50">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-destructive">
					<AlertTriangle className="size-5" />
					Danger Zone
				</CardTitle>
				<CardDescription>
					Irreversible actions that will permanently affect your account.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-start justify-between gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
					<div className="flex-1">
						<p className="font-medium text-sm">Delete Account</p>
						<p className="mt-1 text-muted-foreground text-sm">
							Permanently delete your account, all websites, and all feedback.
							This action cannot be undone.
						</p>
					</div>
					<DeleteAccountDialog />
				</div>
			</CardContent>
		</Card>
	);
}
