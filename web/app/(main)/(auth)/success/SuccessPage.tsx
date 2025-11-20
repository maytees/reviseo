"use client";
import {
	CheckCircle,
	LayoutDashboard,
	Mail,
	ReceiptTextIcon,
	ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/old-card";
import { authClient } from "@/lib/auth-client";
import { useConfetti } from "@/lib/hooks/use-confetti";

export const SuccessPage = () => {
	const { data: session, isPending } = authClient.useSession();
	const { triggerConfetti } = useConfetti();

	// biome-ignore lint/correctness/useExhaustiveDependencies: goon
	useEffect(() => {
		triggerConfetti();
	}, []);

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="flex flex-col items-center gap-2 text-center">
				<div className="flex items-center justify-center text-green-600 bg-green-100 rounded-full size-12 dark:bg-green-900/30 dark:text-green-400">
					<CheckCircle className="size-6" />
				</div>
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						Payment successful
					</h1>
					<p className="text-muted-foreground">
						You're all set! Your subscription is now active. Thank you for using
						Reviseo.
					</p>
				</div>
			</CardHeader>

			<CardContent className="grid gap-6">
				<div className="space-y-4 text-sm">
					<div className="flex items-start gap-3">
						<Mail className="text-muted-foreground mt-0.5 size-4 shrink-0" />
						{isPending ? (
							<p className="text-muted-foreground">
								A receipt has been sent to
							</p>
						) : (
							<p className="text-muted-foreground">
								A receipt has been sent to{" "}
								<span className="font-medium text-foreground">
									{session?.user.email}
								</span>
								.
							</p>
						)}
					</div>
					<div className="flex items-start gap-3">
						<ShieldCheck className="text-muted-foreground mt-0.5 size-4 shrink-0" />
						<p className="text-muted-foreground">
							Payments are processed securely. Your subscription will renew
							automatically.
						</p>
					</div>
				</div>
			</CardContent>

			<CardFooter className="flex flex-col gap-2">
				<Button className="w-full" asChild>
					<Link href={"/dashboard"}>
						<LayoutDashboard />
						Go to Dashboard
					</Link>
				</Button>
				<Button
					variant="outline"
					onClick={async () => await authClient.customer.portal()}
					className="w-full"
				>
					<ReceiptTextIcon />
					Billing Portal
				</Button>
				<div className="mt-2 text-xs text-center">
					<Link
						href="/#contact"
						className="underline text-muted-foreground hover:text-foreground underline-offset-4"
					>
						Need help? Contact Support
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
};
