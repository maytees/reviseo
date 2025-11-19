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
				<CardTitle className="text-destructive flex items-center gap-2">
					<AlertTriangle className="size-5" />
					Danger Zone
				</CardTitle>
				<CardDescription>
					Irreversible actions that will permanently affect your account.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-destructive/20 bg-destructive/5">
					<div className="flex-1">
						<p className="text-sm font-medium">Delete Account</p>
						<p className="text-sm text-muted-foreground mt-1">
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
