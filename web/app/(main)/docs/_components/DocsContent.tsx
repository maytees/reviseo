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
import {
	CheckCircle2,
	ChevronLeft,
	Code2,
	Eye,
	KeyRound,
	ShieldCheck,
	Users,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import {
	CodeBlock,
	CodeBlockBody,
	CodeBlockContent,
	CodeBlockCopyButton,
	CodeBlockFilename,
	CodeBlockHeader,
	CodeBlockItem,
} from "@/components/ui/shadcn-io/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildWidgetGuides, type WidgetGuideIcon } from "@/lib/widget-guides";

const GUIDE_ICONS: Record<WidgetGuideIcon, typeof SiHtml5> = {
	html: SiHtml5,
	nextjs: SiNextdotjs,
	react: SiReact,
	vue: SiVuedotjs,
	nuxt: SiNuxt,
	wordpress: SiWordpress,
	shopify: SiShopify,
};

// Same guide content as each website's Widget tab — placeholder project ID here.
const GUIDES = buildWidgetGuides("YOUR_PROJECT_ID").map((guide) => ({
	...guide,
	icon: GUIDE_ICONS[guide.icon],
}));

const STEPS = [
	{
		icon: KeyRound,
		title: "Grab your project ID",
		body: "Every website in your dashboard has a unique project ID — find it on the website's Widget tab, or copy the full pre-filled snippet from there.",
	},
	{
		icon: Code2,
		title: "Add the snippet",
		body: "Paste the install snippet into your site so it loads on every page you want feedback on. Pick your platform below for exact steps.",
	},
	{
		icon: CheckCircle2,
		title: "Verify the install",
		body: "Back in the dashboard, hit Verify Widget on the website's Widget tab. Reviseo fetches your site and confirms the snippet is live.",
	},
];

export default function DocsContent() {
	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 py-16 sm:px-6">
			{/* Header */}
			<div className="flex flex-col gap-4">
				<Button
					asChild
					variant="ghost"
					size="sm"
					className="w-fit text-muted-foreground"
				>
					<Link href="/dashboard">
						<ChevronLeft className="size-4" />
						Back to dashboard
					</Link>
				</Button>
				<h1 className="font-bold font-caudex text-4xl sm:text-5xl">
					Install the widget
				</h1>
				<p className="max-w-2xl text-lg text-muted-foreground">
					One small script tag puts the Reviseo feedback button on your site. It
					stays invisible to normal visitors — only signed-in workspace members
					and invited clients ever see it.
				</p>
			</div>

			{/* Steps */}
			<div className="grid gap-4 sm:grid-cols-3">
				{STEPS.map((step, i) => (
					<Card key={step.title}>
						<CardHeader>
							<div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10">
								<step.icon className="size-4.5 text-primary" />
							</div>
							<CardTitle className="text-base">
								{i + 1}. {step.title}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground text-sm">{step.body}</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Platform guides */}
			<div className="flex flex-col gap-4">
				<h2 className="font-bold font-caudex text-2xl">
					Platform-specific guides
				</h2>
				<Tabs defaultValue="html" className="w-full">
					<TabsList className="h-auto flex-wrap justify-start">
						{GUIDES.map((guide) => (
							<TabsTrigger
								key={guide.value}
								value={guide.value}
								className="gap-1.5"
							>
								<guide.icon className="size-3.5" />
								{guide.label}
							</TabsTrigger>
						))}
					</TabsList>
					{GUIDES.map((guide) => (
						<TabsContent
							key={guide.value}
							value={guide.value}
							className="mt-4 flex flex-col gap-4"
						>
							<ol className="flex list-decimal flex-col gap-1.5 pl-5 text-muted-foreground text-sm">
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
										<CodeBlockItem key={item.language} value={item.language}>
											<CodeBlockContent language={guide.language}>
												{item.code}
											</CodeBlockContent>
										</CodeBlockItem>
									)}
								</CodeBlockBody>
							</CodeBlock>
						</TabsContent>
					))}
				</Tabs>
			</div>

			{/* How visibility works */}
			<div className="flex flex-col gap-4">
				<h2 className="font-bold font-caudex text-2xl">Who sees the widget?</h2>
				<div className="grid gap-4 sm:grid-cols-3">
					<Card>
						<CardHeader>
							<Eye className="mb-1 size-5 text-muted-foreground" />
							<CardTitle className="text-base">Regular visitors</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground text-sm">
								Never see it. The trigger only renders after a successful
								sign-in and permission check.
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<Users className="mb-1 size-5 text-muted-foreground" />
							<CardTitle className="text-base">Invited clients</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground text-sm">
								Clients you invite to a website can open the widget and submit
								annotated feedback on that site.
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<ShieldCheck className="mb-1 size-5 text-muted-foreground" />
							<CardTitle className="text-base">Your team</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground text-sm">
								Every member of the workspace that owns the website can use the
								widget too — handy for internal QA.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Troubleshooting */}
			<Card>
				<CardHeader>
					<CardTitle>Widget not showing up?</CardTitle>
					<CardDescription>The three usual suspects</CardDescription>
				</CardHeader>
				<CardContent>
					<ul className="flex list-disc flex-col gap-1.5 pl-5 text-muted-foreground text-sm">
						<li>
							<span className="text-foreground">Not signed in</span> — open{" "}
							<Link className="text-primary hover:underline" href="/login">
								reviseo.app/login
							</Link>{" "}
							in the same browser, then reload your site.
						</li>
						<li>
							<span className="text-foreground">Wrong project ID</span> — the ID
							in the snippet must match the website entry in your dashboard
							exactly.
						</li>
						<li>
							<span className="text-foreground">No access</span> — you must be a
							member of the workspace that owns the website, or an invited
							client of it.
						</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}
