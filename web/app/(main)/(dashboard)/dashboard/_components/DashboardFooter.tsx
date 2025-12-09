import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const DashboardFooter = () => {
	return (
		<div className="pt-6">
			<Separator className="mb-4" />
			<div className="flex flex-col items-center justify-between gap-2 text-muted-foreground text-xs lg:flex-row">
				<p>© 2025 Reviseo. All rights reserved.</p>
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
