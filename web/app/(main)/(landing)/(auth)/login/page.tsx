import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DASHBOARD_CHOOSER_PATH, safeNextPath } from "@/lib/auth-redirect";
import { LoginForm } from "./_components/LoginForm";

export const metadata: Metadata = {
	title: "Login",
};

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ next?: string | string[] }>;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		const { next } = await searchParams;
		return redirect(
			safeNextPath(typeof next === "string" ? next : null) ??
				DASHBOARD_CHOOSER_PATH,
		);
	}
	return (
		<div>
			<LoginForm />

			<div className="mt-2 text-balance text-center font-inter text-muted-foreground text-sm">
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
