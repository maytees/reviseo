"use client";

import moment from "moment";
import { useId, useState } from "react";
import { toast } from "sonner";
import VerifyInstallation from "@/app/(main)/(landing)/(onboarding)/onboarding/_components/VerifyInstallation";
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
import WidgetInstallGuides from "@/components/widget-install-guides";
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
								<span className="font-medium text-sm">Installation Status</span>
								<Badge variant={widgetInstalled ? "success" : "secondary"}>
									{widgetInstalled ? "Installed" : "Not Installed"}
								</Badge>
							</div>
							{verifiedAt && (
								<p className="text-muted-foreground text-xs">
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
						Platform-specific instructions — every snippet below already
						includes this website's project ID
					</CardDescription>
				</CardHeader>
				<CardContent>
					<WidgetInstallGuides
						projectId={projectId}
						config={{ position, theme }}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
