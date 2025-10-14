import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { OnboardingFlow } from "./_components/OnboardingFlow";

export default async function OnboardingPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return redirect("/login");
	}

	// If already completed onboarding, go to dashboard
	if (session.user.hasCompletedOnboarding) {
		return redirect("/dashboard");
	}

	return <OnboardingFlow user={session.user} />;
}
