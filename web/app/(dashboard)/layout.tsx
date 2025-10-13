import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireUser } from "../data/require-user";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	await requireUser();
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "19rem",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="floating" collapsible="icon" />
			<SidebarInset>
				<SiteHeader />
				<div className="flex flex-col flex-1">
					<div className="@container/main flex flex-1 flex-col gap-4 p-4 pt-0">
						<div className="flex flex-col h-full gap-4">{children}</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
