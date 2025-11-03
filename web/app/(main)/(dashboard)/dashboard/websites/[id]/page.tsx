import { notFound } from "next/navigation";
import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import DashboardFooter from "../../_components/DashboardFooter";

const WebsitePage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const user = await requireUser();
	const { id } = await params;

	const website = await prisma.website.findUnique({
		where: {
			id,
			developerId: user.id,
		},
	});

	if (!website) return notFound();

	return (
		<div className="flex flex-col gap-0.5">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold font-caudex">{website.name}</h1>
			</div>
			<div className="flex-1">
				<p className="text-sm text-muted-foreground">
					Manage <em>{website.name}</em>'s feedback, widget, client, and more.
				</p>
			</div>
			<DashboardFooter />
		</div>
	);
};

export default WebsitePage;
