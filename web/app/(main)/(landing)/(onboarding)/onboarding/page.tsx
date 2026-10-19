import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getUserOnboardingData } from "@/app/data/user/get-user-onboarding-data";
import { DASHBOARD_CHOOSER_PATH } from "@/lib/auth-redirect";
import { OnboardingFlow } from "./_components/OnboardingFlow";

export const metadata: Metadata = {
	title: "Get Started",
};

export default async function OnboardingPage() {
	const userData = await getUserOnboardingData();

	if (!userData) {
		return redirect("/");
	}

	// General entry for returning users: let them choose their destination.
	if (userData.hasCompletedOnboarding) {
		return redirect(DASHBOARD_CHOOSER_PATH);
	}

	// if (userData.subscription?.status !== "active") return redirect("/pricing");

	return (
		<Suspense>
			<OnboardingFlow userData={userData} />
		</Suspense>
	);
}
