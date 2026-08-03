"use client";

import {
	SiHtml5,
	SiNextdotjs,
	SiNuxt,
	SiReact,
	SiShopify,
	SiVuedotjs,
	SiWordpress,
} from "@icons-pack/react-simple-icons";
import { toast } from "sonner";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	CodeBlock,
	CodeBlockBody,
	CodeBlockContent,
	CodeBlockCopyButton,
	CodeBlockFilename,
	CodeBlockHeader,
	CodeBlockItem,
} from "@/components/ui/shadcn-io/code-block";
import {
	buildWidgetGuides,
	type WidgetConfig,
	type WidgetGuideIcon,
} from "@/lib/widget-guides";

const GUIDE_ICONS: Record<
	WidgetGuideIcon,
	{ Icon: typeof SiHtml5; color: string }
> = {
	html: { Icon: SiHtml5, color: "#E34F26" },
	nextjs: { Icon: SiNextdotjs, color: "#ffffff" },
	react: { Icon: SiReact, color: "#61DAFB" },
	vue: { Icon: SiVuedotjs, color: "#4FC08D" },
	nuxt: { Icon: SiNuxt, color: "#00DC82" },
	wordpress: { Icon: SiWordpress, color: "#21759B" },
	shopify: { Icon: SiShopify, color: "#7AB55C" },
};

/** Accordion of per-platform widget install guides. Used on each website's
 *  Widget tab (real projectId) — /docs renders the same data as tabs. */
export default function WidgetInstallGuides({
	projectId,
	config,
}: {
	projectId: string;
	config?: WidgetConfig;
}) {
	const guides = buildWidgetGuides(projectId, config);

	return (
		<Accordion type="single" collapsible className="w-full">
			{guides.map((guide) => {
				const { Icon, color } = GUIDE_ICONS[guide.icon];
				return (
					<AccordionItem key={guide.value} value={guide.value}>
						<AccordionTrigger>
							<div className="flex items-center gap-2">
								<Icon className="size-4" style={{ color }} />
								<span>{guide.label}</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className="space-y-3">
							<ol className="flex list-decimal flex-col gap-1 pl-5 text-muted-foreground text-sm">
								{guide.instructions.map((line) => (
									<li key={line}>{line}</li>
								))}
							</ol>
							<CodeBlock
								data={[
									{
										language: guide.language,
										code: guide.code,
										filename: guide.filename,
									},
								]}
								defaultValue={guide.language}
							>
								<CodeBlockHeader>
									<CodeBlockFilename value={guide.language}>
										{guide.filename}
									</CodeBlockFilename>
									<CodeBlockCopyButton
										onCopy={() => toast.success("Copied to clipboard!")}
										onError={() => toast.error("Failed to copy")}
									/>
								</CodeBlockHeader>
								<CodeBlockBody>
									{(item) => (
										<CodeBlockItem
											key={item.language}
											value={item.language}
											lineNumbers={false}
										>
											<CodeBlockContent language={guide.language}>
												{item.code}
											</CodeBlockContent>
										</CodeBlockItem>
									)}
								</CodeBlockBody>
							</CodeBlock>
						</AccordionContent>
					</AccordionItem>
				);
			})}
		</Accordion>
	);
}
