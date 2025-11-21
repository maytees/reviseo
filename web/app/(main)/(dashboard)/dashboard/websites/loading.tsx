import { Skeleton } from "@/components/ui/skeleton";

const WebsitesLoading = () => {
	return (
		<div className="flex min-h-full flex-col">
			<div className="flex-1 space-y-4">
				{/* Header row */}
				<div className="flex flex-row items-center justify-between">
					<div className="flex flex-col gap-0.5">
						<div className="flex items-center justify-between">
							<Skeleton className="h-8 w-56" />
						</div>
						<div className="flex-1">
							<Skeleton className="h-4 w-64" />
						</div>
					</div>
					<Skeleton className="h-9 w-40" />
				</div>

				{/* Websites list - simple outer rectangles */}
				<div className="flex flex-col gap-2">
					{Array.from({ length: 3 }).map((_, idx) => (
						<Skeleton key={idx} className="h-32 w-full" />
					))}
				</div>
			</div>
		</div>
	);
};

export default WebsitesLoading;
