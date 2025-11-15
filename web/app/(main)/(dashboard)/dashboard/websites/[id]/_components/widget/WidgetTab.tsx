"use client";

import {
	SiHtml5,
	SiShopify,
	SiVite,
	SiWordpress,
} from "@icons-pack/react-simple-icons";
import moment from "moment";
import { useId, useState } from "react";
import { toast } from "sonner";
import VerifyInstallation from "@/app/(main)/(onboarding)/onboarding/_components/VerifyInstallation";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	CodeBlock,
	CodeBlockBody,
	CodeBlockContent,
	CodeBlockCopyButton,
	CodeBlockFilename,
	CodeBlockHeader,
	CodeBlockItem,
} from "@/components/ui/shadcn-io/code-block";
import type { WidgetPosition, WidgetTheme } from "@/lib/types";
import { generateWidgetScriptFormatted } from "@/lib/utils";

interface WidgetTabProps {
	projectId: string;
	widgetInstalled: boolean;
	verifiedAt: Date | null;
}

export default function WidgetTab({
	projectId,
	widgetInstalled,
	verifiedAt,
}: WidgetTabProps) {
	const [position, setPosition] = useState<WidgetPosition | undefined>(
		undefined,
	);
	const [theme, setTheme] = useState<WidgetTheme | undefined>(undefined);

	const positionId = useId();
	const themeId = useId();

	const widgetScript = generateWidgetScriptFormatted(projectId, {
		position,
		theme,
	});

	const handleCopy = () => {
		toast.success("Copied to clipboard!");
	};

	const handleCopyError = () => {
		toast.error("Failed to copy. Please try again.");
	};

	return (
		<div className="space-y-4">
			{/* Widget Status */}
			<Card>
				<CardHeader>
					<CardTitle>Widget Status</CardTitle>
					<CardDescription>
						Monitor your widget installation status
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium">Installation Status</span>
								<Badge variant={widgetInstalled ? "success" : "secondary"}>
									{widgetInstalled ? "Installed" : "Not Installed"}
								</Badge>
							</div>
							{verifiedAt && (
								<p className="text-xs text-muted-foreground">
									Last verified {moment(verifiedAt).fromNow()}
								</p>
							)}
						</div>
						<VerifyInstallation projectId={projectId} size="sm" reset={false} />
					</div>
				</CardContent>
			</Card>

			{/* Widget Settings */}
			<Card>
				<CardHeader>
					<CardTitle>Widget Settings</CardTitle>
					<CardDescription>
						Customize your widget appearance and behavior
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor={positionId}>Position</Label>
							<Select
								value={position || "default"}
								onValueChange={(value) =>
									setPosition(
										value === "default" ? undefined : (value as WidgetPosition),
									)
								}
							>
								<SelectTrigger id={positionId}>
									<SelectValue placeholder="Default (Bottom Right)" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="default">
										Default (Bottom Right)
									</SelectItem>
									<SelectItem value="bottom-right">Bottom Right</SelectItem>
									<SelectItem value="bottom-left">Bottom Left</SelectItem>
									<SelectItem value="top-right">Top Right</SelectItem>
									<SelectItem value="top-left">Top Left</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor={themeId}>Theme</Label>
							<Select
								value={theme || "default"}
								onValueChange={(value) =>
									setTheme(
										value === "default" ? undefined : (value as WidgetTheme),
									)
								}
							>
								<SelectTrigger id={themeId}>
									<SelectValue placeholder="Default (Auto)" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="default">Default (Auto)</SelectItem>
									<SelectItem value="auto">Auto</SelectItem>
									<SelectItem value="light">Light</SelectItem>
									<SelectItem value="dark">Dark</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Installation Code */}
			<Card>
				<CardHeader>
					<CardTitle>Installation Code</CardTitle>
					<CardDescription>
						Copy and paste this code snippet into your website
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CodeBlock
						data={[
							{ language: "html", code: widgetScript, filename: "x.html" },
						]}
						defaultValue="html"
					>
						<CodeBlockHeader>
							<CodeBlockFilename value="html">index.html</CodeBlockFilename>
							<CodeBlockCopyButton
								onCopy={handleCopy}
								onError={handleCopyError}
							/>
						</CodeBlockHeader>
						<CodeBlockBody>
							{(item) => (
								<CodeBlockItem key={item.language} value={item.language}>
									<CodeBlockContent language="html">
										{item.code}
									</CodeBlockContent>
								</CodeBlockItem>
							)}
						</CodeBlockBody>
					</CodeBlock>
				</CardContent>
			</Card>

			{/* Installation Guides */}
			<Card>
				<CardHeader>
					<CardTitle>Installation Guides</CardTitle>
					<CardDescription>
						Platform-specific instructions for installing the widget
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Accordion type="single" collapsible className="w-full">
						{/* Vanilla HTML */}
						<AccordionItem value="vanilla">
							<AccordionTrigger>
								<div className="flex items-center gap-2">
									<SiHtml5 className="text-[#E34F26] size-4" />
									<span>Vanilla HTML</span>
								</div>
							</AccordionTrigger>
							<AccordionContent className="space-y-3">
								<p className="text-sm text-muted-foreground">
									Add the widget script to the bottom of the{" "}
									<code className="px-1.5 py-0.5 rounded bg-background text-xs">
										&lt;head&gt;
									</code>{" "}
									tag in every page, or in your global header component if you
									have one.
								</p>
								<CodeBlock
									data={[
										{
											language: "html",
											filename: "index.html",
											code: `<!DOCTYPE html>
<html>
  <head>
    <title>Your Website</title>
    <!-- Other head elements -->

    <!-- Reviseo Widget -->
    ${widgetScript}
  </head>
  <body>
    <!-- Your content -->
  </body>
</html>`,
										},
									]}
									defaultValue="html"
								>
									<CodeBlockHeader>
										<CodeBlockFilename value="html">
											index.html
										</CodeBlockFilename>
										<CodeBlockCopyButton
											onCopy={handleCopy}
											onError={handleCopyError}
										/>
									</CodeBlockHeader>
									<CodeBlockBody>
										{(item) => (
											<CodeBlockItem
												key={item.language}
												value={item.language}
												lineNumbers={false}
											>
												<CodeBlockContent language="html">
													{item.code}
												</CodeBlockContent>
											</CodeBlockItem>
										)}
									</CodeBlockBody>
								</CodeBlock>
							</AccordionContent>
						</AccordionItem>

						{/* Vite */}
						<AccordionItem value="vite">
							<AccordionTrigger>
								<div className="flex items-center gap-2">
									<SiVite className="text-[#646CFF] size-4" />
									<span>Vite</span>
								</div>
							</AccordionTrigger>
							<AccordionContent className="space-y-3">
								<p className="text-sm text-muted-foreground">
									Add the widget script to your{" "}
									<code className="px-1.5 py-0.5 rounded bg-background text-xs">
										index.html
									</code>{" "}
									file in the{" "}
									<code className="px-1.5 py-0.5 rounded bg-background text-xs">
										&lt;head&gt;
									</code>{" "}
									section, similar to the Vanilla HTML approach.
								</p>
								<CodeBlock
									data={[
										{
											language: "html",
											filename: "index.html",
											code: widgetScript,
										},
									]}
									defaultValue="html"
								>
									<CodeBlockHeader>
										<CodeBlockFilename value="html">
											index.html
										</CodeBlockFilename>
										<CodeBlockCopyButton
											onCopy={handleCopy}
											onError={handleCopyError}
										/>
									</CodeBlockHeader>
									<CodeBlockBody>
										{(item) => (
											<CodeBlockItem
												key={item.language}
												value={item.language}
												lineNumbers={false}
											>
												<CodeBlockContent language="html">
													{item.code}
												</CodeBlockContent>
											</CodeBlockItem>
										)}
									</CodeBlockBody>
								</CodeBlock>
							</AccordionContent>
						</AccordionItem>

						{/* React */}
						{/* <AccordionItem value="react">
							<AccordionTrigger>
								<div className="flex items-center gap-2">
									<SiReact className="text-[#61DAFB] size-4" />
									<span>React</span>
								</div>
							</AccordionTrigger>
							<AccordionContent className="space-y-3">
								<div className="flex items-center gap-2 p-3 border rounded-lg bg-amber-500/10 border-amber-500/20">
									<Badge variant="warning" size="sm">
										Coming Soon
									</Badge>
									<p className="text-sm text-muted-foreground">
										React component guide is under development
									</p>
								</div>
							</AccordionContent>
						</AccordionItem> */}

						{/* WordPress */}
						<AccordionItem value="wordpress">
							<AccordionTrigger>
								<div className="flex items-center gap-2">
									<SiWordpress className="text-[#21759B] size-4" />
									<span>WordPress</span>
								</div>
							</AccordionTrigger>
							<AccordionContent className="space-y-3">
								<p className="text-sm text-muted-foreground">
									Use a JavaScript insertion plugin to add the widget script to
									your WordPress site. Popular options include "Insert Headers
									and Footers" or "WPCode".
								</p>
								<div className="flex items-center gap-2 p-3 border rounded-lg bg-blue-500/10 border-blue-500/20">
									<Badge variant="info" size="sm">
										Tutorial Coming Soon
									</Badge>
									<p className="text-sm text-muted-foreground">
										Detailed WordPress tutorial is in progress
									</p>
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* Shopify */}
						<AccordionItem value="shopify">
							<AccordionTrigger>
								<div className="flex items-center gap-2">
									<SiShopify className="text-[#7AB55C] size-4" />
									<span>Shopify</span>
								</div>
							</AccordionTrigger>
							<AccordionContent className="space-y-3">
								<div className="flex items-center gap-2 p-3 border rounded-lg bg-amber-500/10 border-amber-500/20">
									<Badge variant="warning" size="sm">
										Coming Soon
									</Badge>
									<p className="text-sm text-muted-foreground">
										Shopify installation guide is under development
									</p>
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* Vue */}
						{/* <AccordionItem value="vue">
							<AccordionTrigger>
								<div className="flex items-center gap-2">
									<SiVuedotjs className="text-[#4FC08D] size-4" />
									<span>Vue</span>
								</div>
							</AccordionTrigger>
							<AccordionContent className="space-y-3">
								<div className="flex items-center gap-2 p-3 border rounded-lg bg-amber-500/10 border-amber-500/20">
									<Badge variant="warning" size="sm">
										Coming Soon
									</Badge>
									<p className="text-sm text-muted-foreground">
										Vue component guide is under development
									</p>
								</div>
							</AccordionContent>
						</AccordionItem> */}

						{/* Svelte */}
						{/* <AccordionItem value="svelte">
							<AccordionTrigger>
								<div className="flex items-center gap-2">
									<SiSvelte className="text-[#FF3E00] size-4" />
									<span>Svelte</span>
								</div>
							</AccordionTrigger>
							<AccordionContent className="space-y-3">
								<div className="flex items-center gap-2 p-3 border rounded-lg bg-amber-500/10 border-amber-500/20">
									<Badge variant="warning" size="sm">
										Coming Soon
									</Badge>
									<p className="text-sm text-muted-foreground">
										Svelte component guide is under development
									</p>
								</div>
							</AccordionContent>
						</AccordionItem> */}
					</Accordion>
				</CardContent>
			</Card>
		</div>
	);
}
