import { Skeleton } from "@/components/ui/skeleton";

const WebsitesLoading = () => {
	return (
		<div className="flex flex-col min-h-full">
			<div className="flex-1 space-y-4">
				{/* Header row */}
				<div className="flex flex-row items-center justify-between">
					<div className="flex flex-col gap-0.5">
						<div className="flex items-center justify-between">
							<Skeleton className="w-56 h-8" />
						</div>
						<div className="flex-1">
							<Skeleton className="w-64 h-4" />
						</div>
					</div>
					<Skeleton className="w-40 h-9" />
				</div>

				{/* Websites list - simple outer rectangles */}
				<div className="flex flex-col gap-2">
					{Array.from({ length: 3 }).map((_, idx) => (
						<Skeleton key={idx} className="w-full h-32" />
					))}
				</div>
			</div>
		</div>
	);
};

export default WebsitesLoading;
