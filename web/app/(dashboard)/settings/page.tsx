export default function SettingsPage() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold font-caudex">Settings</h1>
			</div>
			<div className="flex-1">
				<p className="text-muted-foreground font-alegreya">
					Configure your account settings and preferences.
				</p>
			</div>
		</div>
	);
}
