"use client";

import {
	CreditCard,
	Globe,
	HeartHandshake,
	Home,
	Moon,
	Settings,
	Sun,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { NavUser } from "./nav-user";

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: Home,
		},
		{
			title: "Websites",
			url: "/dashboard/websites",
			icon: Globe,
		},
		{
			title: "Settings",
			url: "/dashboard/settings",
			icon: Settings,
		},
	],
	resources: [
		// {
		// 	title: "Documentation",
		// 	url: "/docs",
		// 	icon: BookText,
		// },
		{
			title: "Support",
			url: "/#contact",
			icon: HeartHandshake,
		},
		// {
		// 	title: "Changelog",
		// 	url: "/blog/changelog",
		// 	icon: Zap,
		// },
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { theme, setTheme } = useTheme();

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:p-1.5! "
						>
							<Link href="/">
								<Image
									src="/logo.svg"
									width={32}
									height={32}
									alt="Reviseo Logo"
									className="size-5!"
								/>
								<span className="text-2xl font-semibold font-caudex">
									Reviseo
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{/* Main Navigation */}
				<NavMain items={data.navMain} />

				{/* Feedback Management */}
				{/* <SidebarGroup>
					<SidebarGroupLabel>Feedback</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{data.feedback.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup> */}

				{/* Resources */}
				<SidebarGroup>
					<SidebarGroupLabel>Resources</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{data.resources.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton tooltip={item.title} asChild>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Account & Preferences */}
				<SidebarGroup className="mt-auto">
					<SidebarGroupLabel>Miscellaneous</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{/* <SidebarMenuItem>
								<SidebarMenuButton tooltip={"Refer"} asChild>
									<Link href="/account">
										<Gift />
										<span>Refer</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem> */}

							<SidebarMenuItem>
								<SidebarMenuButton
									tooltip={"Billing"}
									onClick={async () => await authClient.customer.portal()}
								>
									<CreditCard />
									<span>Billing</span>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton
									tooltip={"Toggle Theme"}
									onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
								>
									<Sun className="dark:hidden" />{" "}
									<Moon className="hidden dark:inline-block" />
									<span className="dark:hidden">Light Mode</span>
									<span className="hidden dark:inline-block">Dark Mode</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<NavUser />
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
