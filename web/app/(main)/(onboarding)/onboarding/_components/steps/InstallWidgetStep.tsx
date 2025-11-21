"use client";

import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	generateWidgetScriptFormatted,
	generateWidgetScriptMinified,
} from "@/lib/utils";
import VerifyInstallation from "../VerifyInstallation";

interface InstallWidgetStepProps {
	onNext: () => void;
	onBack: () => void;
	projectId: string;
}

export function InstallWidgetStep({
	onNext,
	onBack,
	projectId,
}: InstallWidgetStepProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(
				generateWidgetScriptMinified(projectId),
			);
			setCopied(true);
			toast.success("Copied to clipboard!");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Failed to copy. Please try again.");
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="space-y-6 py-4"
		>
			<div className="space-y-1 text-center">
				<h2 className="font-bold font-caudex text-2xl sm:text-3xl">
					Install the widget
				</h2>
				<p className="font-inter text-base text-muted-foreground">
					Add this code snippet before the closing &lt;/head&gt; tag
				</p>
			</div>

			<div className="mx-auto max-w-2xl space-y-4">
				<div className="relative">
					<div className="overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-sm sm:text-base">
						<pre className="text-foreground">
							<code>
								{/* <span className="text-purple-400">{`<link`}</span>{" "}
								<span className="text-blue-400">rel</span>
								<span className="text-slate-400">=</span>
								<span className="text-green-400">"stylesheet"</span>{" "}
								<span className="text-blue-400">href</span>
								<span className="text-slate-400">=</span>
								<span className="text-green-400">
									"https://reviseo.app/cdn/reviseo.css"
								</span>
								<span className="text-purple-400">{`>`}</span>
								{"\n"}
								<span className="text-purple-400">{`<script`}</span>
								{"\n  "}
								<span className="text-blue-400">src</span>
								<span className="text-slate-400">=</span>
								<span className="text-green-400">
									"https://reviseo.app/cdn/reviseo.js"
								</span>
								{"\n  "}
								<span className="text-blue-400">data-project-id</span>
								<span className="text-slate-400">=</span>
								<span className="text-green-400">"{projectId}"</span>
								{"\n"}
								<span className="text-purple-400">{`></script>`}</span> */}
								{generateWidgetScriptFormatted(projectId)}
							</code>
						</pre>
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={handleCopy}
						className="absolute top-2 right-2 border-border bg-card font-inter text-sm hover:bg-muted"
					>
						{copied ? (
							<>
								<Check className="mr-1 h-3 w-3" />
								Copied
							</>
						) : (
							<>
								<Copy className="mr-1 h-3 w-3" />
								Copy
							</>
						)}
					</Button>
				</div>
				<div className="rounded-lg border border-border bg-accent/30 p-3">
					<p className="font-inter text-muted-foreground text-sm">
						<span className="font-inter font-medium text-foreground">Tip:</span>{" "}
						To learn how to import for your platform,{" "}
						<Link
							target="_blank"
							href="/docs"
							className="font-inter text-primary"
						>
							check our guides
						</Link>
						.
					</p>
				</div>

				<div className="rounded-lg border border-border bg-accent/20 p-4">
					<div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
						<div className="text-center sm:text-left">
							<p className="mb-1 font-inter font-medium text-foreground">
								Ready to verify?
							</p>
							<p className="font-inter text-muted-foreground text-sm">
								Make sure you've added the widget to your website
							</p>
						</div>
						<VerifyInstallation projectId={projectId} />
					</div>
				</div>
			</div>

			<div className="mx-auto flex max-w-2xl justify-between pt-2">
				<Button variant="outline" onClick={onBack} className="font-inter">
					<ChevronLeft /> Edit Website
				</Button>
				<div className="flex gap-2">
					<Button
						variant="ghost"
						onClick={onNext}
						className="font-inter text-base"
					>
						Skip
					</Button>
					<Button onClick={onNext} className="font-inter">
						Continue <ChevronRight />
					</Button>
				</div>
			</div>
		</motion.div>
	);
}
