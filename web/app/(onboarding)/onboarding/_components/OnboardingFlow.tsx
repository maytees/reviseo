"use client";

import { AnimatePresence } from "framer-motion";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { UserOnboardingDataType } from "@/app/data/user/get-user-onboarding-data";
import { tryCatch } from "@/lib/try-catch";
import type { ClientFormData, WebsiteFormData } from "@/lib/validations";
import { completeOnboarding } from "../actions";
import { createWebsiteOnboarding } from "./actions";
import { OnboardingStepper } from "./OnboardingStepper";
import { CreateWebsiteStep } from "./steps/CreateWebsiteStep";
import { InstallWidgetStep } from "./steps/InstallWidgetStep";
import { InviteClientStep } from "./steps/InviteClientStep";
import { SuccessStep } from "./steps/SuccessStep";
import { WelcomeStep } from "./steps/WelcomeStep";

const STEPS = [
  { label: "Welcome" },
  { label: "Website" },
  { label: "Widget" },
  { label: "Invite" },
];

export function OnboardingFlow(props: { userData: UserOnboardingDataType }) {
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

  const handleWebsiteSubmit = ({
    websiteName,
    websiteUrl,
    existingWebsiteId,
  }: WebsiteFormData & { existingWebsiteId?: string }) => {
    startWebsiteTransition(async () => {
      // If selecting an existing website, skip creation
      if (existingWebsiteId) {
        const existingWebsite = props.userData?.developerWebsites.find(
          (w) => w.id === existingWebsiteId,
        );
        if (existingWebsite) {
          setFormData((prev) => ({
            ...prev,
            websiteName: existingWebsite.name,
            websiteUrl: existingWebsite.url,
            projectId: existingWebsite.projectId,
          }));
          setCurrentStep(2);
          return;
        }
      }

      // Create new website
      const { data: result, error } = await tryCatch(
        createWebsiteOnboarding({ websiteName, websiteUrl }),
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        const projectId = result.message;

        setFormData((prev) => ({
          ...prev,
          websiteName,
          websiteUrl,
          projectId,
        }));
        setCurrentStep(2);
        return;
      }

      // Error
      toast.error(result.message);
    });
  };

  const handleClientSubmit = async (data: ClientFormData) => {
    startClientTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFormData((prev) => ({ ...prev, ...data }));
      setShowSuccess(true);
      // TODO: Save website and client data to your database
      console.log("Final form data:", { ...formData, ...data });
    });
  };

  const handleComplete = async () => {
    // Mark onboarding as complete and redirect to dashboard
    startCompleteTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
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
                    userName={
                      props.userData?.name ||
                      props.userData?.email.split("@")[0] ||
                      undefined
                    }
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
                    userData={props.userData}
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
