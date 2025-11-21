import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LoginForm } from "./_components/LoginForm";

export const metadata: Metadata = {
	title: "Login",
};

async function isDeveloper(userId: string): Promise<boolean> {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { role: true },
	});

	if (!user) {
		throw new Error("Invalid User ID");
	}

	return user.role === "developer";
}

export default async function LoginPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		// Check if user has completed onboarding
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

			<div className="text-balance text-center font-inter text-muted-foreground text-sm">
				By clicking continue, you agree to our{" "}
				<Link
					href="/terms"
					className="font-semibold hover:cursor-pointer hover:text-primary hover:underline"
				>
					Terms of service
				</Link>{" "}
				and{" "}
				<Link
					href="/privacy"
					className="font-semibold hover:cursor-pointer hover:text-primary hover:underline"
				>
					Privacy Policy
				</Link>
				.
			</div>
		</div>
	);
}
