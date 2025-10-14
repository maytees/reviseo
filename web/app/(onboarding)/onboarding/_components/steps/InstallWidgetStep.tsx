"use client";

import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

	const codeSnippet = `<script
  src="https://cdn.reviseo.com/widget.js"
  data-project-id="${projectId}"
></script>`;

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(codeSnippet);
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
				<h2 className="text-xl sm:text-2xl font-bold font-caudex">
					Install the widget
				</h2>
				<p className="text-sm text-muted-foreground font-alegreya">
					Add this code snippet before the closing &lt;/body&gt; tag
				</p>
			</div>

			<div className="max-w-2xl mx-auto space-y-4">
				<div className="relative">
					<div className="bg-background rounded-lg p-4 font-mono text-xs sm:text-sm overflow-x-auto border border-border">
						<pre className="text-foreground">
							<code>
								<span className="text-purple-400">{`<script`}</span>
								{"\n  "}
								<span className="text-blue-400">src</span>
								<span className="text-slate-400">=</span>
								<span className="text-green-400">
									"https://cdn.reviseo.com/widget.js"
								</span>
								{"\n  "}
								<span className="text-blue-400">data-project-id</span>
								<span className="text-slate-400">=</span>
								<span className="text-green-400">"{projectId}"</span>
								{"\n"}
								<span className="text-purple-400">{`></script>`}</span>
							</code>
						</pre>
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={handleCopy}
						className="absolute top-2 right-2 bg-card border-border hover:bg-muted font-alegreya text-xs"
					>
						{copied ? (
							<>
								<Check className="w-3 h-3 mr-1" />
								Copied
							</>
						) : (
							<>
								<Copy className="w-3 h-3 mr-1" />
								Copy
							</>
						)}
					</Button>
				</div>

				<div className="bg-accent/30 border border-border rounded-lg p-3">
					<p className="text-xs text-muted-foreground font-alegreya">
						<span className="font-medium text-foreground font-caudex">
							Tip:
						</span>{" "}
						For React, Next.js, or WordPress,{" "}
						<a href="/docs" className="text-primary hover:underline">
							check our guides
						</a>
						.
					</p>
				</div>
			</div>

			<div className="flex justify-between pt-2 max-w-2xl mx-auto">
				<Button variant="outline" onClick={onBack} className="font-alegreya">
					← Back
				</Button>
				<div className="flex gap-2">
					<Button
						variant="ghost"
						onClick={onNext}
						className="font-alegreya text-sm"
					>
						Skip
					</Button>
					<Button onClick={onNext} className="font-alegreya">
						Continue →
					</Button>
				</div>
			</div>
		</motion.div>
	);
}
