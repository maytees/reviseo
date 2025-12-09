import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getUserOnboardingData } from "@/app/data/user/get-user-onboarding-data";
import { OnboardingFlow } from "./_components/OnboardingFlow";

export const metadata: Metadata = {
	title: "Get Started",
};

export default async function OnboardingPage() {
	// const user = await requireUser();

	const userData = await getUserOnboardingData();

	if (!userData) {
		return redirect("/");
	}

	// If already completed onboarding, go to dashboard
	if (userData.hasCompletedOnboarding) {
		return redirect("/dashboard");
	}

	// if (userData.subscription?.status !== "active") return redirect("/pricing");

	return (
		<Suspense>
			<OnboardingFlow userData={userData} />
		</Suspense>
	);
}
