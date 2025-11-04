import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import DashboardFooter from "../../_components/DashboardFooter";
import CopyProjectId from "../_components/CopyProjectId";
import EditWebsiteDetailsDialog from "./_components/EditWebsiteDetailsDialog";

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
		<div className="flex flex-col gap-0.5 h-full">
			<div className="flex items-center gap-4">
				<h1 className="text-3xl font-bold font-caudex">{website.name}</h1>
				<div className="space-x-1.5 flex flex-row items-center">
					<EditWebsiteDetailsDialog website={website} />
					<CopyProjectId projectId={website.projectId} />
				</div>
			</div>
			<div className="flex-1">
				<Link
					href={website.url}
					className="flex items-center text-sm peer-hover:underline hover:underline text-muted-foreground"
					target="_blank"
				>
					{website.url}
					<ExternalLink className="ml-1 peer-hover:underline underline size-2.5" />
				</Link>
			</div>
			<div className="mt-auto">
				<DashboardFooter />
			</div>
		</div>
	);
};

export default WebsitePage;
