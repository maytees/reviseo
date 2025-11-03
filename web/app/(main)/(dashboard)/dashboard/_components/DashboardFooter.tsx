import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const DashboardFooter = () => {
	return (
		<div className="pt-6">
			<Separator className="mb-4" />
			<div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground lg:flex-row">
				<p>
					© {new Date().getFullYear()} Reviseo. All rights reserved.
				</p>
				<div className="flex items-center gap-3">
					<Link className="hover:underline" href="/privacy">
						Privacy
					</Link>
					<Link className="hover:underline" href="/terms">
						Terms
					</Link>
					<Link className="hover:underline" href="/about">
						About
					</Link>
				</div>
			</div>
		</div>
	);
};

export default DashboardFooter;


