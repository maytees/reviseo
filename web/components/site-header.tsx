"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
	const pathname = usePathname();

	const getBreadcrumbs = (path: string) => {
		const segments = path.split("/").filter(Boolean);
		const breadcrumbs = [];

		// Main nav items
		if (segments[0] === "home") {
			breadcrumbs.push({
				label: "Home",
				href: "/home",
				isLast: segments[1] === undefined,
			});
		}

		if (segments[0] === "calendar") {
			breadcrumbs.push({
				label: "Calendar",
				href: "/calendar",
				isLast: segments[1] === undefined,
			});
		}

		if (segments[0] === "notes") {
			breadcrumbs.push({
				label: "Notes",
				href: "/notes",
				isLast: segments[1] === undefined,
			});
			if (segments[1] === "create") {
				breadcrumbs.push({
					label: "Create",
					href: "/notes/create",
					isLast: true,
				});
			}
		}

		if (segments[0] === "assignments") {
			breadcrumbs.push({
				label: "Assignments",
				href: "/assignments",
				isLast: segments[1] === undefined,
			});
			if (segments[1] === "create") {
				breadcrumbs.push({
					label: "Create",
					href: "/assignments/create",
					isLast: true,
				});
			}
		}

		if (segments[0] === "courses") {
			breadcrumbs.push({
				label: "Courses",
				href: "/courses",
				isLast: segments[1] === undefined,
			});
			if (segments[1] === "create") {
				breadcrumbs.push({
					label: "Create",
					href: "/courses/create",
					isLast: true,
				});
			}
		}

		// Study tools
		if (segments[0] === "quiz") {
			breadcrumbs.push({
				label: "Study",
				href: "/study",
				isLast: false,
			});
			breadcrumbs.push({
				label: "Quiz",
				href: "/quiz",
				isLast: true,
			});
		}

		if (segments[0] === "flashcards") {
			breadcrumbs.push({
				label: "Study",
				href: "/study",
				isLast: false,
			});
			breadcrumbs.push({
				label: "Flashcards",
				href: "/flashcards",
				isLast: true,
			});
		}

		if (segments[0] === "pomodoro") {
			breadcrumbs.push({
				label: "Study",
				href: "/study",
				isLast: false,
			});
			breadcrumbs.push({
				label: "Pomodoro",
				href: "/pomodoro",
				isLast: true,
			});
		}

		// Stats section
		if (segments[0] === "progress") {
			breadcrumbs.push({
				label: "Stats",
				href: "/stats",
				isLast: false,
			});
			breadcrumbs.push({
				label: "Progress",
				href: "/progress",
				isLast: true,
			});
		}

		if (segments[0] === "streaks") {
			breadcrumbs.push({
				label: "Stats",
				href: "/stats",
				isLast: false,
			});
			breadcrumbs.push({
				label: "Streaks",
				href: "/streaks",
				isLast: true,
			});
		}

		if (segments[0] === "milestones") {
			breadcrumbs.push({
				label: "Stats",
				href: "/stats",
				isLast: false,
			});
			breadcrumbs.push({
				label: "Milestones",
				href: "/milestones",
				isLast: true,
			});
		}

		// Secondary nav
		if (segments[0] === "settings") {
			breadcrumbs.push({
				label: "Settings",
				href: "/settings",
				isLast: true,
			});
		}
		return breadcrumbs;
	};

	const breadcrumbs = getBreadcrumbs(pathname);

	return (
		<header className="flex items-center h-16 px-4 shrink-0 gap-2">
			<SidebarTrigger className="-ml-1" />
			<Separator
				orientation="vertical"
				className="mr-2 data-[orientation=vertical]:h-4"
			/>
			<Breadcrumb>
				<BreadcrumbList>
					{breadcrumbs.map((breadcrumb) => (
						<React.Fragment key={breadcrumb.href}>
							<BreadcrumbItem>
								{breadcrumb.isLast ? (
									<BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink href={breadcrumb.href}>
										{breadcrumb.label}
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{!breadcrumb.isLast && <BreadcrumbSeparator />}
						</React.Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</header>
	);
}
