"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { ClientFormData, WebsiteFormData } from "@/lib/validations";
import { completeOnboarding } from "../actions";
import { OnboardingStepper } from "./OnboardingStepper";
import { CreateWebsiteStep } from "./steps/CreateWebsiteStep";
import { InstallWidgetStep } from "./steps/InstallWidgetStep";
import { InviteClientStep } from "./steps/InviteClientStep";
import { SuccessStep } from "./steps/SuccessStep";
import { WelcomeStep } from "./steps/WelcomeStep";

const STEPS = [
	{ label: "Welcome" },
	{ label: "Create Website" },
	{ label: "Install Widget" },
	{ label: "Invite Client" },
];

function generateProjectId(): string {
	return `proj_${Math.random().toString(36).substring(2, 15)}`;
}

interface OnboardingFlowProps {
	user: {
		name: string | null;
		email: string;
	};
}

export function OnboardingFlow({ user }: OnboardingFlowProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({
		websiteName: "",
		websiteUrl: "",
		clientName: "",
		clientEmail: "",
		projectId: "",
	});
	const [showSuccess, setShowSuccess] = useState(false);

	const handleWebsiteSubmit = (data: WebsiteFormData) => {
		const projectId = generateProjectId();
		setFormData((prev) => ({ ...prev, ...data, projectId }));
		setCurrentStep(2);
	};

	const handleClientSubmit = async (data: ClientFormData) => {
		setFormData((prev) => ({ ...prev, ...data }));
		setShowSuccess(true);

		// TODO: Save website and client data to your database
		console.log("Final form data:", { ...formData, ...data });
	};

	const handleComplete = async () => {
		// Mark onboarding as complete and redirect to dashboard
		await completeOnboarding();
	};

	return (
		<div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center px-4 sm:px-6 py-8">
			<div className="w-full flex flex-col items-center max-w-4xl">
				{!showSuccess && (
					<div className="mb-8 w-full">
						<OnboardingStepper steps={STEPS} currentStep={currentStep} />
					</div>
				)}

				<div className="w-full">
					<AnimatePresence mode="wait">
						{showSuccess ? (
							<SuccessStep
								key="success"
								clientEmail={formData.clientEmail}
								onComplete={handleComplete}
							/>
						) : (
							<>
								{currentStep === 0 && (
									<WelcomeStep
										key="welcome"
										onNext={() => setCurrentStep(1)}
										userName={user.name || user.email.split("@")[0]}
									/>
								)}
								{currentStep === 1 && (
									<CreateWebsiteStep
										key="create-website"
										onNext={handleWebsiteSubmit}
										onBack={() => setCurrentStep(0)}
										defaultValues={{
											websiteName: formData.websiteName,
											websiteUrl: formData.websiteUrl,
										}}
									/>
								)}
								{currentStep === 2 && (
									<InstallWidgetStep
										key="install-widget"
										onNext={() => setCurrentStep(3)}
										onBack={() => setCurrentStep(1)}
										projectId={formData.projectId}
									/>
								)}
								{currentStep === 3 && (
									<InviteClientStep
										key="invite-client"
										onSubmit={handleClientSubmit}
										onBack={() => setCurrentStep(2)}
										defaultValues={{
											clientName: formData.clientName,
											clientEmail: formData.clientEmail,
										}}
									/>
								)}
							</>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
