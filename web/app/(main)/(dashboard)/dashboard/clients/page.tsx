import DashboardFooter from "../_components/DashboardFooter";

export default function ClientsPage() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold font-caudex">Clients</h1>
			</div>
			<div className="flex-1">
				<p className="text-muted-foreground font-inter">
					Manage your clients and send invite links.
				</p>
			</div>
			<DashboardFooter />
		</div>
	);
}
