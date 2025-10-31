"use client";

import {
	BookText,
	CreditCard,
	Gift,
	Globe,
	HeartHandshake,
	Home,
	LogOutIcon,
	Mail,
	Moon,
	Settings,
	Sun,
	User,
	Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { useSignOut } from "@/lib/hooks/useSignOut";

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: Home,
		},
		{
			title: "Websites",
			url: "/websites",
			icon: Globe,
		},
		{
			title: "Settings",
			url: "/settings",
			icon: Settings,
		},
	],
	resources: [
		{
			title: "Documentation",
			url: "/docs",
			icon: BookText,
		},
		{
			title: "Support",
			url: "/support",
			icon: HeartHandshake,
		},
		{
			title: "Changelog",
			url: "/changelog",
			icon: Zap,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { theme, setTheme } = useTheme();
	const handleSignOut = useSignOut();
	const { data: session, isPending } = authClient.useSession();

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5 "
						>
							<Link href="/">
								<Image
									src="/logo.svg"
									width={32}
									height={32}
									alt="Reviseo Logo"
									className="!size-5"
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
							<SidebarMenuItem>
								<SidebarMenuButton tooltip={"Refer"} asChild>
									<Link href="/account">
										<Gift />
										<span>Refer</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton tooltip={"Account"} asChild>
									<Link href="/account">
										<User />
										<span>Account</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton tooltip={"Billing"} asChild>
									<Link href="/billing">
										<CreditCard />
										<span>Billing</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton tooltip={"Notifications"} asChild>
									<Link href="/notifications">
										<Mail />
										<span>Notifications</span>
									</Link>
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
					{isPending ? (
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" className="cursor-default">
								<Skeleton className="w-8 h-8 rounded-lg" />
								<div className="grid flex-1 gap-1 text-sm leading-tight text-left">
									<Skeleton className="w-20 h-4" />
									<Skeleton className="w-16 h-3" />
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					) : (
						<SidebarMenuItem className="flex flex-row gap-2 px-1 py-1">
							<Avatar className="rounded-lg">
								<AvatarImage
									src={
										session?.user.image ??
										`https://avatar.vercel.sh/${session?.user.email}`
									}
									alt={session?.user.name}
								/>
								<AvatarFallback className="rounded-lg">
									{session?.user.name && session.user.name.length > 0
										? session.user.name.charAt(0).toUpperCase()
										: session?.user.email.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-sm leading-tight text-left">
								<span className="font-medium truncate">
									{session?.user.name && session.user.name.length > 0
										? session.user.name
										: session?.user.email.split("@")[0]}
								</span>
								<span className="text-xs truncate text-muted-foreground">
									{session?.user.email}
								</span>
							</div>
							<Button variant={"outline"} onClick={handleSignOut} mode={"icon"}>
								<LogOutIcon />
							</Button>
						</SidebarMenuItem>
					)}
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
