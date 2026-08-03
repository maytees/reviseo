"use client";
import type { ErrorContext } from "better-auth/react";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardHeading,
	CardTitle,
} from "@/components/ui/card";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";

export function VerifyRequest() {
	const router = useRouter();
	const [otp, setOtp] = useState("");
	const [emailPending, startTranstion] = useTransition();
	const params = useSearchParams();
	const email = params.get("email") as string;
	const isClientInvite = params.get("ci") as string | null;
	const rawNext = params.get("next");
	// Only same-origin relative paths
	const next =
		rawNext?.startsWith("/") && !rawNext.startsWith("//") ? rawNext : null;
	const isOtpCompleted = otp.length === 6;

	function verifyOtp() {
		startTranstion(async () => {
			await authClient.signIn.emailOtp({
				email,
				otp,
				fetchOptions: {
					onSuccess: () => {
						toast.success("Email verified");
						router.push(
							next ?? `${!isClientInvite ? "/onboarding" : "/invite"}`,
						);
					},
					onError: (error: ErrorContext) => {
						toast.error(error.error.message);
					},
				},
			});
		});
	}
	return (
		<Card className="mx-auto w-full">
			<CardHeading>
				<CardHeader className="py-4">
					<CardTitle className="text-xl">Please check your email</CardTitle>
					<CardDescription>
						We have sent a verification email code to your email address. Please
						open the email and paste the code below.
					</CardDescription>
				</CardHeader>
			</CardHeading>
			<CardContent className="space-y-6">
				<div className="flex flex-col items-center space-y-2">
					<InputOTP
						value={otp}
						onChange={(value) => setOtp(value)}
						maxLength={6}
						className="gap-2"
					>
						<InputOTPGroup>
							<InputOTPSlot index={0} />
							<InputOTPSlot index={1} />
							<InputOTPSlot index={2} />
						</InputOTPGroup>
						<InputOTPGroup>
							<InputOTPSlot index={3} />
							<InputOTPSlot index={4} />
							<InputOTPSlot index={5} />
						</InputOTPGroup>
					</InputOTP>
					<p className="text-muted-foreground text-sm">
						Enter the 6-digit code sent to your email
					</p>
				</div>

				<Button
					onClick={verifyOtp}
					disabled={emailPending || !isOtpCompleted}
					className="w-full"
				>
					{emailPending ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							<span>Loading...</span>
						</>
					) : (
						"Verify Account"
					)}
				</Button>
			</CardContent>
		</Card>
	);
}
