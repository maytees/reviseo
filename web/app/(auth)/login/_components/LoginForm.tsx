"use client";

import { GithubIcon, Loader, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
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

	async function signInWithGithub() {
		startGithubTransition(async () => {
			await authClient.signIn.social({
				provider: "github",
				callbackURL: "/dashboard",
				fetchOptions: {
					onSuccess: () => {
						toast.success("Signed in with Github, you will be redirected...");
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
						router.push(`/verify-request?email=${email}`);
					},
					onError: () => {
						toast.error("Error sending email");
					},
				},
			});
		});
	}
	return (
		<Card className="border-border py-7 px-3 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-xl">
			<CardHeader className="space-y-1 py-2">
				<CardTitle className="text-2xl sm:text-3xl font-bold font-caudex text-center">
					Welcome Back!
				</CardTitle>
				<CardDescription className="text-base sm:text-lg text-center font-alegreya">
					Sign in to access your dashboard
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col gap-5">
				<Button
					disabled={githubPending}
					onClick={signInWithGithub}
					className="w-full h-11 font-alegreya"
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
							className="text-base font-alegreya font-medium"
						>
							Email
						</Label>
						<Input
							id={emailId}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							type="email"
							placeholder="you@example.com"
							className="h-11 font-alegreya"
							required
						/>
					</div>

					<Button
						onClick={signInWithEmail}
						disabled={emailPending}
						className="h-11 font-alegreya"
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
