import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isClient, isDeveloper } from "@/lib/utils";
import { LoginForm } from "./_components/LoginForm";

export const metadata: Metadata = {
	title: "Login",
};

export default async function LoginPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		// Check if user has completed onboarding
		console.log(await isDeveloper(session.user.id), "is developer");
		console.log(await isClient(session.user.id), "is client");
		if (
			!session.user.hasCompletedOnboarding &&
			(await isDeveloper(session.user.id))
		) {
			return redirect("/onboarding");
		}
		return redirect("/dashboard");
	}
	return (
		<div>
			<LoginForm />

			<div className="text-sm text-center text-balance text-muted-foreground font-inter">
				By clicking continue, you agree to our{" "}
				<Link
					href="/terms"
					className="font-semibold hover:text-primary hover:underline hover:cursor-pointer"
				>
					Terms of service
				</Link>{" "}
				and{" "}
				<Link
					href="/privacy"
					className="font-semibold hover:text-primary hover:underline hover:cursor-pointer"
				>
					Privacy Policy
				</Link>
				.
			</div>
		</div>
	);
}
