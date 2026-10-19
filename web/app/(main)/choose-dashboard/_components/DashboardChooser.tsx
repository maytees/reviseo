import {
	ArrowRight,
	ArrowUpRight,
	BriefcaseBusiness,
	Check,
	Globe2,
	LockKeyhole,
	Repeat2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardChooserProps {
	email: string;
	workspaceCount: number;
	reviewWebsiteCount: number;
	canAccessWorkspace: boolean;
	needsOnboarding: boolean;
}

export function DashboardChooser({
	email,
	workspaceCount,
	reviewWebsiteCount,
	canAccessWorkspace,
	needsOnboarding,
}: DashboardChooserProps) {
	const choices = [
		{
			id: "workspace",
			title: "Workspace dashboard",
			audience: "For freelancers, agencies & project teams",
			description:
				"Turn client feedback into finished work. Manage your projects and keep every change moving.",
			icon: BriefcaseBusiness,
			features: [
				"Manage websites and client feedback",
				"Organize edits and track progress",
				"Collaborate with your project team",
			],
			status: canAccessWorkspace
				? workspaceCount > 0
					? `${workspaceCount} workspace${workspaceCount === 1 ? "" : "s"}`
					: "Get started"
				: "Workspace invitation needed",
			href: needsOnboarding ? "/onboarding" : "/dashboard",
			action: needsOnboarding ? "Set up your workspace" : "Open workspace",
			available: canAccessWorkspace,
		},
		{
			id: "review",
			title: "Website review",
			audience: "For website owners & review teams",
			description:
				"Help your website take shape. Share clear feedback and follow the changes your team is making.",
			icon: Globe2,
			features: [
				"Review websites shared with you",
				"Follow your submitted feedback",
				"See what is ready and resolved",
			],
			status:
				reviewWebsiteCount > 0
					? `${reviewWebsiteCount} website${reviewWebsiteCount === 1 ? "" : "s"} to review`
					: "No websites connected yet",
			href: "/client/dashboard",
			action: "Open website review",
			available: true,
		},
	];

	return (
		<div className="relative isolate min-h-svh overflow-hidden bg-background font-inter">
			<div
				aria-hidden="true"
				className="-z-10 pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-linear-to-b from-primary/10 via-primary/3 to-transparent"
			/>
			<header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-10 sm:py-6">
				<Link
					href="/"
					className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4"
				>
					<Image src="/logo.svg" width={30} height={30} alt="" />
					<span className="font-bold font-caudex text-2xl">Reviseo</span>
				</Link>
				<Link
					href="/"
					className="flex items-center gap-1.5 rounded-md py-1 text-muted-foreground text-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4"
				>
					Back to website
					<ArrowUpRight aria-hidden="true" className="size-3.5" />
				</Link>
			</header>

			<main className="mx-auto flex w-full max-w-5xl flex-col px-5 pt-4 pb-8 sm:px-10 sm:pt-16 sm:pb-12">
				<div className="mb-6 space-y-2 text-center sm:mb-11 sm:space-y-4">
					<p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.2em]">
						Your Reviseo
					</p>
					<h1 className="text-balance font-bold font-caudex text-3xl tracking-tight sm:text-5xl">
						Where would you like to go?
					</h1>
					<p className="mx-auto max-w-lg text-balance text-muted-foreground text-sm leading-relaxed sm:text-base">
						Choose the dashboard for what you want to do today.
					</p>
				</div>

				<div className="grid gap-3 sm:gap-5 md:grid-cols-2">
					{choices.map((choice) => {
						const content = (
							<>
								<div className="mb-7 hidden items-center justify-between gap-3 sm:flex">
									<div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/8 text-primary">
										<choice.icon aria-hidden="true" className="size-6" />
									</div>
									<span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-muted-foreground text-xs">
										{choice.status}
									</span>
								</div>
								<div className="flex items-start gap-3 sm:block">
									<div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/8 text-primary sm:hidden">
										<choice.icon aria-hidden="true" className="size-4.5" />
									</div>
									<div className="min-w-0">
										<h2 className="font-semibold text-xl tracking-tight sm:text-2xl">
											{choice.title}
										</h2>
										<p className="mt-1 font-medium text-muted-foreground text-xs sm:mt-1.5">
											{choice.audience}
										</p>
									</div>
								</div>
								<p className="mt-3 text-muted-foreground text-sm leading-relaxed sm:mt-4">
									{choice.description}
								</p>
								<p className="mt-3 text-muted-foreground text-xs sm:hidden">
									{choice.status}
								</p>
								<ul className="mt-6 mb-8 hidden space-y-3 sm:block">
									{choice.features.map((feature) => (
										<li
											key={feature}
											className="flex items-center gap-2.5 text-sm"
										>
											<Check
												aria-hidden="true"
												className="size-3.5 shrink-0 text-primary/70"
											/>
											{feature}
										</li>
									))}
								</ul>
								<div className="mt-4 border-border border-t pt-3 sm:mt-auto sm:pt-5">
									{choice.available ? (
										<span className="flex items-center justify-between gap-3 font-semibold text-foreground text-sm">
											{choice.action}
											<ArrowRight
												aria-hidden="true"
												className="size-4 text-primary transition-transform motion-safe:group-hover:translate-x-1"
											/>
										</span>
									) : (
										<p className="flex items-start gap-2 text-muted-foreground text-xs leading-relaxed">
											<LockKeyhole
												aria-hidden="true"
												className="mt-0.5 size-3.5 shrink-0"
											/>
											Ask a workspace owner to invite you to manage projects.
										</p>
									)}
								</div>
							</>
						);
						const className = cn(
							"group flex flex-col rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-8",
							choice.available &&
								"transition-[border-color,box-shadow] hover:border-primary/45 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4",
						);

						return choice.available ? (
							<Link key={choice.id} href={choice.href} className={className}>
								{content}
							</Link>
						) : (
							<div key={choice.id} className={className}>
								{content}
							</div>
						);
					})}
				</div>

				<div className="mt-6 space-y-2 text-center text-muted-foreground text-xs leading-relaxed sm:mt-8 sm:space-y-3">
					<p className="flex items-center justify-center gap-1.5">
						<Repeat2 aria-hidden="true" className="size-3.5" />
						Use Switch dashboard to return here at any time.
					</p>
					{reviewWebsiteCount === 0 && (
						<p className="mx-auto max-w-md text-balance">
							Invited to review a website? Open your invitation link to connect
							it to your account.
						</p>
					)}
					<p className="break-all pt-2">Signed in as {email}</p>
				</div>
			</main>
		</div>
	);
}
