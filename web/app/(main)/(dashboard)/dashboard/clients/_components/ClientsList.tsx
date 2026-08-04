import { Globe, PersonStanding } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import type { UserDataType } from "@/app/data/user/get-user-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type Website = NonNullable<UserDataType>["developerWebsites"][number];

export default function ClientsList({ websites }: { websites: Website[] }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Active Clients</CardTitle>
				<CardDescription>
					{websites.length}{" "}
					{websites.length === 1 ? "client is" : "clients are"} connected to
					your websites
				</CardDescription>
			</CardHeader>
			<CardContent>
				{websites.length === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<PersonStanding />
							</EmptyMedia>
							<EmptyTitle>No clients yet</EmptyTitle>
							<EmptyDescription>
								Invite a client to one of your websites and they'll appear here
								once they accept.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Client</TableHead>
								<TableHead>Website</TableHead>
								<TableHead className="hidden sm:table-cell">Feedback</TableHead>
								<TableHead className="hidden sm:table-cell">Joined</TableHead>
								<TableHead className="w-20" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{websites.map((website) => {
								const client = website.client;
								if (!client) return null;
								const clientFeedback = website.feedback.filter(
									(f) => f.authorId === client.id,
								).length;

								return (
									<TableRow key={website.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="size-8">
													<AvatarImage
														src={client.image ?? undefined}
														alt={client.name}
													/>
													<AvatarFallback>
														{client.name?.charAt(0).toUpperCase() ||
															client.email.charAt(0).toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div className="flex flex-col">
													<span className="font-medium text-sm">
														{client.name || "—"}
													</span>
													<span className="text-muted-foreground text-xs">
														{client.email}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<span className="flex items-center gap-1.5 text-sm">
												<Globe className="size-3.5 text-muted-foreground" />
												{website.name}
											</span>
										</TableCell>
										<TableCell className="hidden sm:table-cell">
											<Badge variant="secondary">{clientFeedback}+</Badge>
										</TableCell>
										<TableCell className="hidden text-muted-foreground text-sm sm:table-cell">
											{moment(client.createdAt).format("MMM D, YYYY")}
										</TableCell>
										<TableCell>
											<Button asChild variant="ghost" size="sm">
												<Link href={`/dashboard/websites/${website.id}`}>
													Manage
												</Link>
											</Button>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}
