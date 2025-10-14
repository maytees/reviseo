"use client";

import { AnimatePresence } from "framer-motion";
import { useState, useTransition } from "react";
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

	// Pending states per-submit step
	const [isWebsitePending, startWebsiteTransition] = useTransition();
	const [isClientPending, startClientTransition] = useTransition();
	const [, startCompleteTransition] = useTransition();

	const handleWebsiteSubmit = (data: WebsiteFormData) => {
		startWebsiteTransition(() => {
			const projectId = generateProjectId();
			setFormData((prev) => ({ ...prev, ...data, projectId }));
			setCurrentStep(2);
		});
	};

	const handleClientSubmit = async (data: ClientFormData) => {
		startClientTransition(() => {
			setFormData((prev) => ({ ...prev, ...data }));
			setShowSuccess(true);
			// TODO: Save website and client data to your database
			console.log("Final form data:", { ...formData, ...data });
		});
	};

	const handleComplete = async () => {
		// Mark onboarding as complete and redirect to dashboard
		startCompleteTransition(() => {
			void completeOnboarding();
		});
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
								clientEmail={formData.clientEmail}
								onComplete={handleComplete}
							/>
						) : (
							<>
								{currentStep === 0 && (
									<WelcomeStep
										onNext={() => setCurrentStep(1)}
										userName={user.name || user.email.split("@")[0]}
									/>
								)}
								{currentStep === 1 && (
									<CreateWebsiteStep
										onNext={handleWebsiteSubmit}
										onBack={() => setCurrentStep(0)}
										isPending={isWebsitePending}
										defaultValues={{
											websiteName: formData.websiteName,
											websiteUrl: formData.websiteUrl,
										}}
									/>
								)}
								{currentStep === 2 && (
									<InstallWidgetStep
										onNext={() => setCurrentStep(3)}
										onBack={() => setCurrentStep(1)}
										projectId={formData.projectId}
									/>
								)}
								{currentStep === 3 && (
									<InviteClientStep
										onSubmit={handleClientSubmit}
										onBack={() => setCurrentStep(2)}
										isPending={isClientPending}
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
