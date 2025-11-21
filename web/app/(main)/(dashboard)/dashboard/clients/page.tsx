import type { Metadata } from "next";
import DashboardFooter from "../_components/DashboardFooter";

export const metadata: Metadata = {
	title: "Clients",
};

export default function ClientsPage() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="font-bold font-caudex text-3xl">Clients</h1>
			</div>
			<div className="flex-1">
				<p className="font-inter text-muted-foreground">
					Manage your clients and send invite links.
				</p>
			</div>
			<DashboardFooter />
		</div>
	);
}
