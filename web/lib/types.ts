// export type ApiResponse = {
// 	status: "success" | "error";

import {
	BugIcon,
	CheckCircleIcon,
	CircleAlertIcon,
	CircleDashedIcon,
	ClockIcon,
	ImageIcon,
	InboxIcon,
	type LucideIcon,
	PaletteIcon,
	PlayIcon,
	SparklesIcon,
	TextCursorInputIcon,
	TriangleAlertIcon,
	XCircleIcon,
} from "lucide-react";
import type { BadgeVariantsType } from "@/components/ui/badge";
import type {
	FeedbackPriority,
	FeedbackStatus,
	FeedbackType,
	InviteStatus,
	Prisma,
} from "@/prisma/generated/client/client";

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
	tags: string[];
	author: string;
	authorImage?: string;
	description?: string;
	authorLinkedIn: string;
	seeMore: string[];
	cover?: string;
	slug?: string;
	authorRole?: string;
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
	browser: string;
	browserVersion: string;
	cpu: string;
	os: string;
	device: string;
	engine: string;
}

export const STATUS_CONFIG: Record<
	FeedbackStatus,
	{
		label: string;
		icon: LucideIcon;
		color: string;
	}
> = {
	NEW: { label: "New", icon: InboxIcon, color: "text-blue-500" },
	IN_PROGRESS: {
		label: "In Progress",
		icon: PlayIcon,
		color: "text-amber-500",
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
	TEXT_EDIT: {
		label: "Text edits",
		icon: TextCursorInputIcon,
		color: "text-violet-600",
	},
	STYLE_EDIT: {
		label: "Style changes",
		icon: PaletteIcon,
		color: "text-fuchsia-600",
	},
	IMAGE_EDIT: {
		label: "Image replacements",
		icon: ImageIcon,
		color: "text-cyan-600",
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
	TEXT_EDIT: "primary",
	STYLE_EDIT: "info2",
	IMAGE_EDIT: "secondary",
};

// Client-team approval pipeline. DIRECT items show no badge — they never
// entered the queue.
export const APPROVAL_CONFIG = {
	DIRECT: null,
	PENDING: {
		label: "Awaiting approval",
		badge: "warning" as BadgeVariantsType,
	},
	APPROVED: { label: "Approved", badge: "success" as BadgeVariantsType },
	REJECTED: { label: "Rejected", badge: "destructive" as BadgeVariantsType },
} as const;

export const TEXT_EDIT_STATUS_CONFIG = {
	PENDING: { label: "Pending", icon: ClockIcon, color: "text-amber-500" },
	APPLIED: {
		label: "Applied",
		icon: CheckCircleIcon,
		color: "text-emerald-500",
	},
	REJECTED: { label: "Rejected", icon: XCircleIcon, color: "text-red-500" },
} as const;

export const INVITE_STATUS_CONFIG: Record<
	InviteStatus,
	{
		label: string;
		icon: LucideIcon;
		color: string;
	}
> = {
	PENDING: { label: "Pending", icon: ClockIcon, color: "text-amber-500" },
	ACCEPTED: {
		label: "Accepted",
		icon: CheckCircleIcon,
		color: "text-emerald-500",
	},
	REVOKED: { label: "Revoked", icon: XCircleIcon, color: "text-red-500" },
};

export const INVITE_STATUS_BADGE_MAP: Record<InviteStatus, BadgeVariantsType> =
	{
		PENDING: "warning",
		ACCEPTED: "success",
		REVOKED: "destructive",
	};

// Mirrors app/data/selects.ts feedbackSelect (kept in lib/types because this
// file is safely importable from client components).
export type FeedbackSelectAllPayload = Prisma.FeedbackGetPayload<{
	select: {
		id: true;
		websiteId: true;
		authorId: true;
		status: true;
		approval: true;
		approvalNote: true;
		pageUrl: true;
		viewport: true;
		priority: true;
		timestamp: true;
		author: {
			select: {
				id: true;
				name: true;
				email: true;
				emailVerified: true;
				image: true;
				createdAt: true;
				updatedAt: true;
				hasCompletedOnboarding: true;
				role: true;
			};
		};
		website: { select: { id: true; name: true; url: true } };
		browser: true;
		screenshotKey: true;
		browserVersion: true;
		os: true;
		device: true;
		createdAt: true;
		updatedAt: true;
		title: true;
		description: true;
		type: true;
		textEdits: {
			select: {
				id: true;
				selector: true;
				elementTag: true;
				originalText: true;
				suggestedText: true;
				pageUrl: true;
				status: true;
			};
			orderBy: { createdAt: "asc" };
		};
		styleEdits: {
			select: {
				id: true;
				selector: true;
				elementTag: true;
				pageUrl: true;
				changes: true;
				status: true;
			};
			orderBy: { createdAt: "asc" };
		};
		imageEdits: {
			select: {
				id: true;
				selector: true;
				pageUrl: true;
				originalSrc: true;
				newKey: true;
				newUrl: true;
				status: true;
			};
			orderBy: { createdAt: "asc" };
		};
	};
}>;

// Widget Config Types
export type WidgetPosition =
	| "bottom-right"
	| "bottom-left"
	| "top-right"
	| "top-left";
export type WidgetTheme = "light" | "dark" | "auto";

export interface WidgetConfig {
	projectId: string;
	position?: WidgetPosition;
	theme?: WidgetTheme;
}
