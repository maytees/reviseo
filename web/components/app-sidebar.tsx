"use client";

import { IconHelp, IconSearch, IconSettings } from "@tabler/icons-react";
import {
	BarChart3Icon,
	BookOpenIcon,
	BrainIcon,
	CalendarIcon,
	CardSimIcon,
	FlameIcon,
	GraduationCap,
	HomeIcon,
	NotebookIcon,
	PaperclipIcon,
	TimerIcon,
	TrophyIcon,
} from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavStats } from "./nav-stats";
import { NavStudy } from "./nav-study";

const data = {
	navMain: [
		{
			title: "Home",
			url: "/home",
			icon: HomeIcon,
		},
		{
			title: "Notes",
			url: "/notes",
			icon: NotebookIcon,
		},
		{
			title: "Assignments",
			url: "/assignments",
			icon: PaperclipIcon,
		},
		{
			title: "Courses",
			url: "/courses",
			icon: BookOpenIcon,
		},
		{
			title: "Calendar",
			url: "/calendar",
			icon: CalendarIcon,
		},
	],
	navStudy: [
		{
			title: "Quiz",
			url: "/quiz",
			icon: BrainIcon,
		},
		{
			title: "Flashcards",
			url: "/Flashcards",
			icon: CardSimIcon,
		},
		{
			title: "Pomodoro",
			url: "/pomodoro",
			icon: TimerIcon,
		},
	],
	navStats: [
		{
			title: "Progress",
			url: "/progress",
			icon: BarChart3Icon,
		},
		{
			title: "Streaks",
			url: "/streaks",
			icon: FlameIcon,
		},
		{
			title: "Milestones",
			url: "/milestones",
			icon: TrophyIcon,
		},
	],
	navSecondary: [
		{
			title: "Settings",
			url: "/settings",
			icon: IconSettings,
		},
		{
			title: "Get Help",
			url: "#",
			icon: IconHelp,
		},
		{
			title: "Search",
			url: "#",
			icon: IconSearch,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
								<GraduationCap className="!size-5" />
								<span className="text-base font-semibold">Molnr</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavStudy items={data.navStudy} />
				<NavStats items={data.navStats} />
				{/* <NavCourses items={data.documents} /> */}
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
