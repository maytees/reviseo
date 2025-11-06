// export type ApiResponse = {
// 	status: "success" | "error";

import {
	BugIcon,
	CheckCircleIcon,
	CircleAlertIcon,
	CircleDashedIcon,
	InboxIcon,
	type LucideIcon,
	PlayIcon,
	SparklesIcon,
	TriangleAlertIcon,
} from "lucide-react";
import type { BadgeVariantsType } from "@/components/ui/badge";
import type {
	FeedbackPriority,
	FeedbackStatus,
	FeedbackType,
	Prisma,
} from "@/prisma/generated/client";

// 	message: string;
// };

export type ApiResponse<T = void> =
	| (T extends void
			? {
					status: "success";
					message: string;
				}
			: {
					status: "success";
					message: string;
					data: T;
				})
	| {
			status: "error";
			message: string;
	  };

export type BlogItem = {
	id: string;
	title: string;
	date: Date;
	lastModified: Date;
	category: "story" | "product" | "guide";
	author: string;
	authorImage?: string;
	description?: string;
	authorLinkedIn: string;
	seeMore: string[];
	cover?: string;
	slug?: string;
	authorRole?: string;
};

export const categoryMap: Record<
	"story" | "product" | "guide",
	BadgeVariantsType
> = {
	story: "info",
	product: "success",
	guide: "warning",
};

export type Browser =
	| "Firefox"
	| "Edge"
	| "Chrome"
	| "Safari"
	| "Opera"
	| "Unknown";
export type OS = "Windows" | "MacOS" | "Linux" | "Android" | "iOS" | "Unknown";

export interface BrowserInfo {
	browser: Browser;
	browserVersion: string;
	os: OS;
	isMobile: boolean;
}

export const STATUS_CONFIG: Record<
	FeedbackStatus,
	{
		label: string;
		icon: LucideIcon;
		color: string;
	}
> = {
	NEW: { label: "New", icon: InboxIcon, color: "text-blue-300" },
	IN_PROGRESS: {
		label: "In Progress",
		icon: PlayIcon,
		color: "text-amber-300",
	},
	RESOLVED: {
		label: "Resolved",
		icon: CheckCircleIcon,
		color: "text-emerald-300",
	},
};

export const PRIORITY_CONFIG: Record<
	FeedbackPriority,
	{
		label: string;
		icon: LucideIcon;
		color: string;
	}
> = {
	LOW: { label: "Low", icon: CircleDashedIcon, color: "text-green-600" },
	MEDIUM: {
		label: "Medium",
		icon: TriangleAlertIcon,
		color: "text-yellow-600",
	},
	HIGH: { label: "High", icon: CircleAlertIcon, color: "text-red-600" },
};

export const TYPE_CONFIG: Record<
	FeedbackType,
	{
		label: string;
		icon: LucideIcon;
		color: string;
	}
> = {
	BUG: { label: "Bug", icon: BugIcon, color: "text-red-600" },
	IMPROVEMENT: {
		label: "Improvement",
		icon: SparklesIcon,
		color: "text-blue-600",
	},
} as const;

export const STATUS_BADGE_MAP: Record<FeedbackStatus, BadgeVariantsType> = {
	NEW: "info2",
	IN_PROGRESS: "primary",
	RESOLVED: "success",
};

export const PRIORITY_BADGE_MAP: Record<FeedbackPriority, BadgeVariantsType> = {
	LOW: "secondary",
	MEDIUM: "warning",
	HIGH: "destructive",
};

export const TYPE_BADGE_MAP: Record<FeedbackType, BadgeVariantsType> = {
	BUG: "destructive",
	IMPROVEMENT: "info",
};

export type FeedbackSelectAllPayload = Prisma.FeedbackGetPayload<{
	select: {
		id: true;
		websiteId: true;
		authorId: true;
		status: true;
		pageUrl: true;
		viewport: true;
		priority: true;
		timestamp: true;
		author: true;
		website: true;
		browser: true;
		screenshotKey: true;
		browserVersion: true;
		isMobile: true;
		os: true;
		createdAt: true;
		updatedAt: true;
		title: true;
		description: true;
		type: true;
	};
}>;
