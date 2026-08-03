"use client";

import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

/** Workspace switcher for users who belong to multiple organizations.
 *  Renders a static label when there's only one. */
export function OrgSwitcher() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const { data: organizations } = authClient.useListOrganizations();
	const { data: activeOrg } = authClient.useActiveOrganization();

	if (!organizations || organizations.length === 0) return null;

	const active = activeOrg ?? organizations[0];

	const switchOrg = (organizationId: string) => {
		if (organizationId === active?.id) return;
		startTransition(async () => {
			const { error } = await authClient.organization.setActive({
				organizationId,
			});
			if (error) {
				toast.error(error.message ?? "Failed to switch workspace");
				return;
			}
			router.refresh();
		});
	};

	if (organizations.length === 1) {
		return (
			<SidebarMenuItem>
				<SidebarMenuButton className="pointer-events-none">
					<Building2 className="size-4" />
					<span className="truncate text-sm">{active?.name}</span>
				</SidebarMenuButton>
			</SidebarMenuItem>
		);
	}

	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton disabled={isPending}>
						<Building2 className="size-4" />
						<span className="truncate text-sm">{active?.name}</span>
						<ChevronsUpDown className="ml-auto size-3.5 opacity-60" />
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="start"
					className="w-(--radix-dropdown-menu-trigger-width) min-w-48"
				>
					<DropdownMenuLabel>Workspaces</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{organizations.map((org) => (
						<DropdownMenuItem key={org.id} onClick={() => switchOrg(org.id)}>
							<span className="truncate">{org.name}</span>
							{org.id === active?.id && (
								<Check className="ml-auto size-4 text-primary" />
							)}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
}
