import { ArrowUpRightIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import type { UserDataType } from "@/app/data/user/get-user-data";
import type { WebsiteDataTypeNonNullable } from "@/app/data/website/get-website-by-id-and-dev-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
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
import InviteClientDialog from "../../../../_components/InviteClientDialog";
import ClientDropdownMenu from "./ClientDropdownMenu";
import InvitesCard from "./InvitesCard";

const ClientInfo = ({
	website,
	userData,
}: {
	website: WebsiteDataTypeNonNullable;
	userData: UserDataType;
}) => {

	return (
		<div className="w-full h-full space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Client</CardTitle>
					<CardDescription>Information about your client</CardDescription>
				</CardHeader>
				<CardContent>
					{website.client ? (
						<div className="flex flex-row items-center justify-between w-full">
							<div className="flex flex-row items-center gap-2">
								<div className="relative">
									<Avatar className="size-10">
										<AvatarImage
											src={
												website.client.image ||
												`https://avatar.vercel.sh/${website.client.email}`
											}
											alt={website.client.name}
											width={40}
											height={40}
										/>
										<AvatarFallback>
											{website.client.name
												.split(" ")
												.map((word: string) => word[0])
												.join("")
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</div>
								<div>
									<h3 className="font-bold">{website.client.name}</h3>
									<p className="text-sm font-light text-muted-foreground">
										{website.client.email}
									</p>
								</div>
							</div>

							<ClientDropdownMenu
								websiteId={website.id}
								clientId={website.client.id}
								clientEmail={website.client.email}
							/>
						</div>
					) : (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<UserIcon />
								</EmptyMedia>
								<EmptyTitle>No Client Invited</EmptyTitle>
								<EmptyDescription>
									You haven&apos;t created any projects yet. Get started by
									creating your first project.
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<div className="flex gap-2">
									<InviteClientDialog
										refresh
										website={website}
										userData={userData}
									>
										<Button size={"sm"}>Invite Client</Button>
									</InviteClientDialog>
									<Button
										variant="link"
										asChild
										className="text-muted-foreground"
										size="sm"
									>
										<Link href="/blog/inviting-client">
											Learn More <ArrowUpRightIcon />
										</Link>
									</Button>
								</div>
							</EmptyContent>
						</Empty>
					)}
				</CardContent>
			</Card>
			<InvitesCard website={website} />
		</div>
	);
};

export default ClientInfo;
