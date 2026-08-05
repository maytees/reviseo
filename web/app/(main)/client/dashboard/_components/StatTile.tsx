import type { LucideIcon } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/old-card";
import { cn } from "@/lib/utils";

// Static map — Tailwind can't see dynamically-built class strings.
const TONE_CLASSES = {
	amber: { tile: "bg-amber-300/20", icon: "text-amber-500" },
	blue: { tile: "bg-blue-300/20", icon: "text-blue-500" },
	emerald: { tile: "bg-emerald-300/20", icon: "text-emerald-400" },
	violet: { tile: "bg-violet-300/20", icon: "text-violet-500" },
} as const;

type StatTileProps = {
	icon: LucideIcon;
	label: string;
	value: number | string;
	tone: keyof typeof TONE_CLASSES;
	emphasize?: boolean;
};

export default function StatTile({
	icon: Icon,
	label,
	value,
	tone,
	emphasize = false,
}: StatTileProps) {
	const toneClasses = TONE_CLASSES[tone];
	return (
		<Card
			className={cn(
				"flex flex-row items-center gap-4 px-5 py-4",
				emphasize && "ring-1 ring-amber-500/30",
			)}
		>
			<div
				className={cn(
					"flex size-11 shrink-0 items-center justify-center rounded-lg",
					toneClasses.tile,
				)}
			>
				<Icon className={cn("size-5", toneClasses.icon)} />
			</div>
			<div className="flex flex-col">
				<CardTitle className="font-caudex text-base text-muted-foreground">
					{label}
				</CardTitle>
				<span className="font-bold text-3xl">{value}</span>
			</div>
		</Card>
	);
}
