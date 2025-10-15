import { redirect } from "next/navigation";
import { Suspense } from "react";
import { requireUser } from "@/app/data/require-user";
import { getUserOnboardingData } from "@/app/data/user/get-user-onboarding-data";
import { OnboardingFlow } from "./_components/OnboardingFlow";

export default async function OnboardingPage() {
	const user = await requireUser();

	// If already completed onboarding, go to dashboard
	if (user.hasCompletedOnboarding) {
		return redirect("/dashboard");
	}

	const userData = await getUserOnboardingData();

	return (
		<Suspense>
			<OnboardingFlow userData={userData} />
		</Suspense>
	);
}
