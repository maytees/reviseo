"use client";

import { GithubIcon, Loader, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
	const router = useRouter();
	const emailId = useId();
	const [githubPending, startGithubTransition] = useTransition();
	const [emailPending, startEmailTransition] = useTransition();
	const [email, setEmail] = useState("");
	const [isClientInvite, setClientInvite] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	useEffect(() => {
		if (localStorage.getItem("token")) {
			setClientInvite(true);
			return;
		}

		setClientInvite(false);
	}, []);

	async function signInWithGithub() {
		startGithubTransition(async () => {
			await authClient.signIn.social({
				provider: "github",
				callbackURL: !isClientInvite ? "/dashboard" : "/invite",
				fetchOptions: {
					onSuccess: () => {
						toast.success("Signed in with Github, you will be redirected...");
						setIsSuccess(true);
					},
					onError: () => {
						toast.error("Internal Server Error");
					},
				},
			});
		});
	}

	function signInWithEmail() {
		startEmailTransition(async () => {
			await authClient.emailOtp.sendVerificationOtp({
				email: email,
				type: "sign-in",
				fetchOptions: {
					onSuccess: () => {
						toast.success("Email sent");
						setIsSuccess(true);
						router.push(
							`/verify-request?email=${email}${isClientInvite ? "&ci=true" : ""}`,
						);
					},
					onError: () => {
						toast.error("Error sending email");
					},
				},
			});
		});
	}
	return (
		<Card className="border-border bg-linear-to-br from-card to-card/50 px-3 py-7 shadow-xl backdrop-blur-sm">
			<CardHeader className="space-y-1 py-2">
				<CardTitle className="text-center font-bold font-caudex text-2xl sm:text-3xl">
					Welcome Back!
				</CardTitle>
				<CardDescription className="text-center font-inter text-base sm:text-lg">
					Sign in to access your dashboard
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col gap-5">
				<Button
					disabled={githubPending || isSuccess}
					onClick={signInWithGithub}
					className="h-11 w-full font-inter"
					variant="outline"
					size="lg"
				>
					{githubPending ? (
						<>
							<Loader className="size-4 animate-spin" />
							<span>Loading...</span>
						</>
					) : (
						<>
							<GithubIcon className="size-4" />
							Sign in with GitHub
						</>
					)}
				</Button>

				<div className="flex flex-col gap-4">
					<div className="grid gap-2.5">
						<Label
							htmlFor={emailId}
							className="font-inter font-medium text-base"
						>
							Email
						</Label>
						<Input
							id={emailId}
							value={email}
							disabled={emailPending || isSuccess}
							onChange={(e) => setEmail(e.target.value)}
							type="email"
							placeholder="you@example.com"
							className="h-11 font-inter"
							required
						/>
					</div>

					<Button
						onClick={signInWithEmail}
						disabled={emailPending || isSuccess}
						className="h-11 font-inter"
						size="lg"
					>
						{emailPending ? (
							<>
								<Loader2 className="size-4 animate-spin" />
								<span>Sending...</span>
							</>
						) : (
							<>
								<Send className="size-4" />
								<span>Continue with Email</span>
							</>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
