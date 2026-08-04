import { Skeleton } from "web";

// Skeletons sit on the app's bg-background surface (like dashboard/loading.tsx)
// — bg-card/20 blocks are invisible on pure white.
export const DashboardLoading = () => (
	<div className="w-md space-y-5 rounded-xl bg-background p-5">
		<div className="space-y-2">
			<Skeleton className="h-8 w-48" />
			<Skeleton className="h-4 w-64" />
		</div>
		<div className="flex gap-2">
			<Skeleton className="h-24 w-1/3" />
			<Skeleton className="h-24 w-1/3" />
			<Skeleton className="h-24 w-1/3" />
		</div>
		<Skeleton className="h-32 w-full" />
	</div>
);
