import { Skeleton } from "@/components/ui/skeleton";

const DashboardLoading = () => {
	return (
		<div className="flex flex-col gap-10">
			{/* Header */}
			<div className="flex flex-col gap-0.5">
				<div className="flex items-center justify-between">
					<Skeleton className="w-48 h-8" />
				</div>
				<div className="flex-1">
					<Skeleton className="w-64 h-4" />
				</div>
			</div>

			<div className="flex flex-row justify-between w-full gap-2">
				<div className="flex flex-col w-full gap-5 xl:w-4/6 ">
					{/* Stats - simple rectangles */}
					<div className="flex flex-row w-full gap-2">
						<div className="w-1/3">
							<Skeleton className="w-full h-24" />
						</div>
						<div className="w-1/3">
							<Skeleton className="w-full h-24" />
						</div>
						<div className="w-1/3">
							<Skeleton className="w-full h-24" />
						</div>
					</div>

					{/* Quick Actions (mobile) - simple rectangle */}
					<div className="xl:hidden">
						<Skeleton className="w-full h-32" />
					</div>

					{/* Recent Feedback - simple rectangle */}
					<Skeleton className="w-full h-64" />

					{/* Catch Up (mobile) - simple rectangle */}
					<div className="xl:hidden">
						<Skeleton className="w-full h-40" />
					</div>
				</div>

				{/* Desktop right column - simple rectangles */}
				<div className="flex-col hidden w-2/6 h-full gap-5 xl:flex">
					<Skeleton className="w-full h-32" />
					<Skeleton className="w-full h-60" />
				</div>
			</div>
		</div>
	);
};

export default DashboardLoading;
