import { MessageCircle } from "lucide-react";
import Image from "next/image";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemHeader,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/old-card";
import type { FeedbackStatus, FeedbackType } from "@/prisma/generated/client";
import type { JsonValue } from "@/prisma/generated/client/runtime/library";

const RecentSubmissions = ({
	feedbacks,
}: {
	feedbacks?: {
		title: string;
		id: string;
		type: FeedbackType;
		createdAt: Date;
		updatedAt: Date;
		userAgent: string | null;
		websiteId: string;
		authorId: string | null;
		status: FeedbackStatus;
		description: string | null;
		pageUrl: string;
		screenshotSvgUrl: string;
		annotatedSvg: string;
		viewportJson: JsonValue;
	}[];
}) => {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Recent Feedback</CardTitle>
				<CardDescription>
					Latest feedback submissions across all websites.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{feedbacks && feedbacks.length !== 0 ? (
					feedbacks.map((feedback) => (
						<Item key={feedback.id}>
							<ItemHeader>Item Header</ItemHeader>
							<ItemMedia variant={"image"}>
								<Image
									src={feedback.screenshotSvgUrl}
									alt={feedback.title}
									width={32}
									height={32}
									className="object-cover grayscale"
								/>
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Item</ItemTitle>
								<ItemDescription>Item</ItemDescription>
							</ItemContent>
							<ItemActions />
							<ItemFooter>Item Footer</ItemFooter>
						</Item>
					))
				) : (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<MessageCircle />
							</EmptyMedia>
							<EmptyTitle>No Feedback</EmptyTitle>
							<EmptyDescription>
								Your clients havent submitted any bugs or improvements on any of
								your websites.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				)}
			</CardContent>
		</Card>
	);
};

export default RecentSubmissions;
