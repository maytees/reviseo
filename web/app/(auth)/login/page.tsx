import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isClient, isDeveloper } from "@/lib/utils";
import { LoginForm } from "./_components/LoginForm";

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
	return <LoginForm />;
}
