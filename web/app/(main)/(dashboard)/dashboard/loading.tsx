import { Skeleton } from "@/components/ui/skeleton";

const DashboardLoading = () => {
	return (
		<div className="flex flex-col gap-10">
			{/* Header */}
			<div className="flex flex-col gap-0.5">
				<div className="flex items-center justify-between">
					<Skeleton className="h-8 w-48" />
				</div>
				<div className="flex-1">
					<Skeleton className="h-4 w-64" />
				</div>
			</div>

			<div className="flex w-full flex-row justify-between gap-2">
				<div className="flex w-full flex-col gap-5 xl:w-4/6">
					{/* Stats - simple rectangles */}
					<div className="flex w-full flex-row gap-2">
						<div className="w-1/3">
							<Skeleton className="h-24 w-full" />
						</div>
						<div className="w-1/3">
							<Skeleton className="h-24 w-full" />
						</div>
						<div className="w-1/3">
							<Skeleton className="h-24 w-full" />
						</div>
					</div>

					{/* Quick Actions (mobile) - simple rectangle */}
					<div className="xl:hidden">
						<Skeleton className="h-32 w-full" />
					</div>

					{/* Recent Feedback - simple rectangle */}
					<Skeleton className="h-64 w-full" />

					{/* Catch Up (mobile) - simple rectangle */}
					<div className="xl:hidden">
						<Skeleton className="h-40 w-full" />
					</div>
				</div>

				{/* Desktop right column - simple rectangles */}
				<div className="hidden h-full w-2/6 flex-col gap-5 xl:flex">
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-60 w-full" />
				</div>
			</div>
		</div>
	);
};

export default DashboardLoading;
