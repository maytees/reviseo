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

		// Dashboard
		if (segments[0] === "dashboard") {
			breadcrumbs.push({
				label: "Dashboard",
				href: "/dashboard",
				isLast: segments[1] === undefined,
			});
		}

		// Websites
		if (segments[0] === "websites") {
			breadcrumbs.push({
				label: "Websites",
				href: "/websites",
				isLast: segments[1] === undefined,
			});
		}

		// Clients
		if (segments[0] === "clients") {
			breadcrumbs.push({
				label: "Clients",
				href: "/clients",
				isLast: segments[1] === undefined,
			});
		}

		// Settings
		if (segments[0] === "settings") {
			breadcrumbs.push({
				label: "Settings",
				href: "/settings",
				isLast: segments[1] === undefined,
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
