export default function DashboardPage() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold font-caudex">Dashboard</h1>
			</div>
			<div className="flex-1">
				<p className="text-muted-foreground font-alegreya">
					Welcome to your Reviseo dashboard.
				</p>
			</div>
		</div>
	);
}
