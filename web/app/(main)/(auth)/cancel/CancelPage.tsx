"use client";
import {
	XCircle,
	Home,
	Mail,
	Clock,
	HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/old-card";
import { authClient } from "@/lib/auth-client";

export const CancelPage = () => {
	const { data: session, isPending } = authClient.useSession();

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="flex flex-col items-center gap-2 text-center">
				<div className="flex items-center justify-center text-red-600 bg-red-100 rounded-full size-12 dark:bg-red-900/30 dark:text-red-400">
					<XCircle className="size-6" />
				</div>
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						Subscription Cancelled
					</h1>
					<p className="text-muted-foreground">
						We're sorry to see you go. Your subscription has been successfully cancelled.
					</p>
				</div>
			</CardHeader>

			<CardContent className="grid gap-6">
				<div className="space-y-4 text-sm">
					<div className="flex items-start gap-3">
						<Clock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
						<p className="text-muted-foreground">
							You will continue to have access to your plan features until the end of your current billing period.
						</p>
					</div>
					<div className="flex items-start gap-3">
						<Mail className="text-muted-foreground mt-0.5 size-4 shrink-0" />
						{isPending ? (
							<p className="text-muted-foreground">
								A confirmation email has been sent.
							</p>
						) : (
							<p className="text-muted-foreground">
								A confirmation email has been sent to{" "}
								<span className="font-medium text-foreground">
									{session?.user.email}
								</span>
								.
							</p>
						)}
					</div>
				</div>
			</CardContent>

			<CardFooter className="flex flex-col gap-2">
				<Button className="w-full" asChild>
					<Link href={"/"}>
						<Home />
						Return to Home
					</Link>
				</Button>
				<div className="mt-2 text-xs text-center">
					<Link
						href="/#contact"
						className="inline-flex items-center gap-1 underline text-muted-foreground hover:text-foreground underline-offset-4"
					>
						<HelpCircle className="size-3" />
						Need help? Contact Support
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
};
