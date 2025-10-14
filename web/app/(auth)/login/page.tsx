import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./_components/LoginForm";

export default async function LoginPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		// Check if user has completed onboarding
		if (!session.user.hasCompletedOnboarding) {
			return redirect("/onboarding");
		}
		return redirect("/dashboard");
	}
	return <LoginForm />;
}
