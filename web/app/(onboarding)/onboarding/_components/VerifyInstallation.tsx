"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRightCircle,
  Loader2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface VerifyInstallationProps {
  projectId: string;
}

type VerificationState = "idle" | "loading" | "success" | "error";

const VerifyInstallation = ({ projectId }: VerifyInstallationProps) => {
  const [state, setState] = useState<VerificationState>("idle");

  useEffect(() => {
    if (state === "error") {
      const timer = setTimeout(() => {
        setState("idle");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const handleVerify = async () => {
    setState("loading");

    try {
      const response = await fetch(`/api/websites/verify/${projectId}`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok && data.installed) {
        setState("success");
        toast.success("Widget installed successfully!");
      } else {
        setState("error");
        toast.error(data.error || "Widget not found on your website");
      }
    } catch (error) {
      setState("error");
      toast.error("Failed to verify installation");
    }
  };

  const getButtonVariant = () => {
    if (state === "success") return "success";
    if (state === "error") return "destructive";
    return "primary";
  };

  const getButtonContent = () => {
    switch (state) {
      case "loading":
        return (
          <>
            Verifying...
            <Loader2 className="animate-spin" />
          </>
        );
      case "success":
        return (
          <>
            Widget Installed!
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <CheckCircle2 />
            </motion.div>
          </>
        );
      case "error":
        return (
          <>
            Could not verify
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <XCircle />
            </motion.div>
          </>
        );
      default:
        return (
          <>
            Verify Widget
            <ChevronRightCircle className="group-hover:translate-x-0.5 transition-all duration-300 ease-in-out" />
          </>
        );
    }
  };

  return (
    <div className="bg-accent/20 border border-border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <p className="font-medium text-foreground font-alegreya mb-1">
            Ready to verify?
          </p>
          <p className="text-sm text-muted-foreground font-alegreya">
            Make sure you've added the widget to your website
          </p>
        </div>
        <motion.div
          animate={
            state === "success"
              ? {
                scale: [1, 1.05, 1],
              }
              : state === "error"
                ? {
                  x: [0, -10, 10, -10, 10, 0],
                }
                : {}
          }
          transition={{
            duration: state === "success" ? 0.5 : 0.4,
          }}
        >
          <Button
            size="lg"
            variant={getButtonVariant()}
            className="group font-alegreya w-full sm:w-auto"
            onClick={handleVerify}
            disabled={state === "loading"}
          >
            {getButtonContent()}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyInstallation;
