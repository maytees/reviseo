"use client";

import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import { authClient } from "@/lib/auth-client";
import { tryCatch } from "@/lib/try-catch";
import { finalizeClientToken } from "./actions";

type InviteState =
	| "checking_auth"
	| "processing"
	| "success"
	| "error"
	| "no_token";

interface ErrorState {
	title: string;
	message: string;
	action?: {
		label: string;
		onClick: () => void;
	};
}

const InvitePage = ({
	searchParams,
}: {
	searchParams: Promise<{ token?: string; clientName?: string }>;
}) => {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();
	const search = use(searchParams);
	const token = search.token ?? null;
	const clientName = search.clientName ?? null;

	const [state, setState] = useState<InviteState>("checking_auth");
	const [error, setError] = useState<ErrorState | null>(null);
	const [successMessage, setSuccessMessage] = useState<string>("");

	useEffect(() => {
		if (isPending) {
			setState("checking_auth");
			return;
		}

		// If query param present, persist it for the login page to use
		if (token) {
			localStorage.setItem("token", token);
		}

		const storageToken = localStorage.getItem("token");

		// If user not logged in, redirect to login
		if (!session?.user) {
			router.push("/login");
			return;
		}

		// If logged in but no token anywhere, nothing to finalize
		if (!storageToken) {
			setState("no_token");
			setError({
				title: "No Invitation Found",
				message:
					"We couldn't find an invitation token. Please check your email for the invitation link.",
				action: {
					label: "Go to Dashboard",
					onClick: () => router.push("/client/dashboard"),
				},
			});
			return;
		}

		// Finalize token
		const finalize = async () => {
			setState("processing");
			setError(null);

			try {
				const { data: result, error: networkError } = await tryCatch(
					finalizeClientToken(storageToken, clientName),
				);

				if (networkError) {
					setState("error");
					setError({
						title: "Connection Error",
						message:
							"We couldn't connect to the server. Please check your internet connection and try again.",
						action: {
							label: "Retry",
							onClick: () => {
								setState("checking_auth");
								finalize();
							},
						},
					});
					return;
				}

				if (result?.status === "error") {
					// Remove invalid token
					localStorage.removeItem("token");
					setState("error");

					// Provide specific error messages based on the error
					if (result.message.includes("expired")) {
						setError({
							title: "Invitation Expired",
							message:
								"This invitation has expired. Please contact the developer to send you a new invitation.",
							action: {
								label: "Go to Dashboard",
								onClick: () => router.push("/client/dashboard"),
							},
						});
					} else if (result.message.includes("revoked")) {
						setError({
							title: "Invitation Revoked",
							message:
								"This invitation has been revoked by the developer. Please contact them for more information.",
							action: {
								label: "Go to Dashboard",
								onClick: () => router.push("/client/dashboard"),
							},
						});
					} else if (result.message.includes("not the same")) {
						setError({
							title: "Email Mismatch",
							message:
								"You're logged in with a different email than the one that received the invitation. Please log out and sign in with the correct email.",
							action: {
								label: "Log Out",
								onClick: async () => {
									await authClient.signOut();
									router.push("/login");
								},
							},
						});
					} else if (result.message.includes("yourself")) {
						setError({
							title: "Cannot Accept Own Invitation",
							message:
								"You cannot accept an invitation to your own project. Please use a client account.",
							action: {
								label: "Go to Dashboard",
								onClick: () => router.push("/dashboard"),
							},
						});
					} else {
						setError({
							title: "Invalid Invitation",
							message: result.message,
							action: {
								label: "Go to Dashboard",
								onClick: () => router.push("/client/dashboard"),
							},
						});
					}
					return;
				}

				// Success
				localStorage.removeItem("token");
				setState("success");
				setSuccessMessage(
					result?.message || "Successfully accepted invitation!",
				);

				// Redirect to client dashboard after a brief delay
				setTimeout(() => {
					router.push("/client/dashboard");
				}, 10000);
			} catch (err) {
				console.error("Unexpected finalize error", err);
				setState("error");
				setError({
					title: "Unexpected Error",
					message:
						"An unexpected error occurred while processing your invitation. Please try again.",
					action: {
						label: "Retry",
						onClick: () => {
							setState("checking_auth");
							finalize();
						},
					},
				});
			}
		};

		finalize();
	}, [token, session?.user, isPending, router, clientName]);

	// Checking authentication
	if (state === "checking_auth") {
		return (
			<Card className="mx-auto w-full">
				<CardHeader>
					<CardTitle className="text-xl">Verifying Authentication</CardTitle>
					<CardDescription>
						Please wait while we verify your session...
					</CardDescription>
				</CardHeader>
				<CardContent className="flex items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<Loader2 className="size-12 animate-spin text-primary" />
						<p className="text-muted-foreground text-sm">
							Checking your authentication status...
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Processing invitation
	if (state === "processing") {
		return (
			<Card className="mx-auto w-full">
				<CardHeader>
					<CardTitle className="text-xl">Processing Invitation</CardTitle>
					<CardDescription>
						Please wait while we process your invitation...
					</CardDescription>
				</CardHeader>
				<CardContent className="flex items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<Loader2 className="size-12 animate-spin text-primary" />
						<p className="text-muted-foreground text-sm">
							Accepting your invitation...
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Success state
	if (state === "success") {
		return (
			<Card className="mx-auto w-full">
				<CardContent className="space-y-6">
					<div className="flex flex-col items-center gap-4">
						<div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
							<CheckCircle className="size-8 text-emerald-500" />
						</div>
						<div className="text-center">
							<p className="font-medium text-lg">{successMessage}</p>
						</div>
					</div>
					<Alert variant="success" appearance="light">
						<CheckCircle />
						<AlertDescription>
							You can now provide feedback on the project using the Reviseo
							widget. Make sure you're logged in when visiting the website.
						</AlertDescription>
					</Alert>
					<Button
						onClick={() => router.push("/client/dashboard")}
						className="w-full"
					>
						Go to Dashboard
					</Button>
				</CardContent>
			</Card>
		);
	}

	// Error states
	if (state === "error" || state === "no_token") {
		return (
			<Card className="mx-auto w-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl">
						<XCircle className="size-5 text-destructive" />
						{error?.title || "Error"}
					</CardTitle>
					<CardDescription>
						We encountered a problem processing your invitation
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<Alert variant="destructive" appearance="light">
						<AlertCircle className="size-5" />
						<AlertDescription>{error?.message}</AlertDescription>
					</Alert>

					{error?.action && (
						<Button onClick={error.action.onClick} className="w-full">
							{error.action.label}
						</Button>
					)}
				</CardContent>
			</Card>
		);
	}

	// Fallback
	return (
		<Card className="mx-auto w-full">
			<CardHeader>
				<CardTitle className="text-xl">Processing...</CardTitle>
				<CardDescription>Please wait</CardDescription>
			</CardHeader>
			<CardContent className="flex items-center justify-center">
				<Loader2 className="size-12 animate-spin text-primary" />
			</CardContent>
		</Card>
	);
};

export default InvitePage;
