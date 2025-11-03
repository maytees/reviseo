"use client";
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
import { usePathname } from "next/navigation";
import React from "react";

export function SiteHeader() {
	const pathname = usePathname();

	const getBreadcrumbs = (path: string) => {
		const segments = path.split("/").filter(Boolean);
		const breadcrumbs = [] as { label: string; href: string; isLast: boolean }[];

		// Base: Dashboard
		if (segments[0] === "dashboard") {
			breadcrumbs.push({
				label: "Dashboard",
				href: "/dashboard",
				isLast: segments.length === 1,
			});

			const section = segments[1];
			if (section === "websites") {
				breadcrumbs.push({
					label: "Websites",
					href: "/dashboard/websites",
					isLast: segments.length === 2,
				});
				// Optional third-level (website id)
				if (segments[2]) {
					breadcrumbs.push({
						label: "Website",
						href: `/dashboard/websites/${segments[2]}`,
						isLast: true,
					});
				}
			}

			if (section === "clients") {
				breadcrumbs.push({
					label: "Clients",
					href: "/dashboard/clients",
					isLast: segments.length === 2,
				});
			}

			if (section === "settings") {
				breadcrumbs.push({
					label: "Settings",
					href: "/dashboard/settings",
					isLast: segments.length === 2,
				});
			}
		} else {
			// Fallbacks for any non-dashboard paths
			if (segments[0] === "websites") {
				breadcrumbs.push({
					label: "Websites",
					href: "/dashboard/websites",
					isLast: segments.length === 1,
				});
			}
			if (segments[0] === "clients") {
				breadcrumbs.push({
					label: "Clients",
					href: "/dashboard/clients",
					isLast: segments.length === 1,
				});
			}
			if (segments[0] === "settings") {
				breadcrumbs.push({
					label: "Settings",
					href: "/dashboard/settings",
					isLast: segments.length === 1,
				});
			}
		}

		return breadcrumbs;
	};

	const breadcrumbs = getBreadcrumbs(pathname);

	return (
		<header className="flex items-center h-16 gap-2 px-4 shrink-0">
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
