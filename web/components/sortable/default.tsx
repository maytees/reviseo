"use client";

import {
	FileTextIcon,
	GripVertical,
	ImageIcon,
	MusicIcon,
	VideoIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
	Sortable,
	SortableItem,
	SortableItemHandle,
} from "@/components/ui/sortable";

interface SortableItem {
	id: string;
	title: string;
	description: string;
	type: "image" | "document" | "audio" | "video";
	size: string;
}

const defaultItems: SortableItem[] = [
	{
		id: "1",
		title: "Product Demo",
		description: "Main product image",
		type: "image",
		size: "2.4 MB",
	},
	{
		id: "2",
		title: "Product Specification",
		description: "Technical details document",
		type: "document",
		size: "1.2 MB",
	},
	{
		id: "3",
		title: "Product Demo Video",
		description: "How to use the product",
		type: "video",
		size: "15.7 MB",
	},
	{
		id: "4",
		title: "Product Audio Guide",
		description: "Audio instructions",
		type: "audio",
		size: "8.3 MB",
	},
	{
		id: "5",
		title: "Product Specification",
		description: "Additional product view",
		type: "image",
		size: "3.1 MB",
	},
];

const getTypeIcon = (type: SortableItem["type"]) => {
	switch (type) {
		case "image":
			return <ImageIcon className="h-4 w-4" />;
		case "document":
			return <FileTextIcon className="h-4 w-4" />;
		case "audio":
			return <MusicIcon className="h-4 w-4" />;
		case "video":
			return <VideoIcon className="h-4 w-4" />;
	}
};

const getTypeColor = (type: SortableItem["type"]) => {
	switch (type) {
		case "image":
			return "primary";
		case "document":
			return "success";
		case "audio":
			return "destructive";
		case "video":
			return "info";
	}
};

export default function SortableDefault() {
	const [items, setItems] = useState<SortableItem[]>(defaultItems);

	const handleValueChange = (newItems: SortableItem[]) => {
		console.log("🔴 VALUE CHANGED:", newItems);
		setItems(newItems);

		// Show toast with new order
		toast.success("Items reordered successfully!", {
			description: `${newItems.map((item, index) => `${index + 1}. ${item.title}`).join(", ")}`,
			duration: 4000,
		});
	};

	const getItemValue = (item: SortableItem) => item.id;

	return (
		<div className="mx-auto w-full max-w-4xl space-y-8 p-6">
			<Sortable
				value={items}
				onValueChange={handleValueChange}
				getItemValue={getItemValue}
				strategy="vertical"
				className="space-y-2"
			>
				{items.map((item) => (
					<SortableItem key={item.id} value={item.id}>
						<div
							className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:bg-accent/50"
							// onClick={() => console.log('🔴 ITEM CLICKED:', item.id)}
						>
							<SortableItemHandle className="text-muted-foreground hover:text-foreground">
								<GripVertical className="h-4 w-4" />
							</SortableItemHandle>

							<div className="flex items-center gap-2 text-muted-foreground">
								{getTypeIcon(item.type)}
							</div>

							<div className="min-w-0 flex-1">
								<h4 className="truncate font-medium text-sm">{item.title}</h4>
								<p className="truncate text-muted-foreground text-xs">
									{item.description}
								</p>
							</div>

							<div className="flex items-center gap-2">
								<Badge variant={getTypeColor(item.type)} appearance="outline">
									{item.type}
								</Badge>
								<span className="text-muted-foreground text-xs">
									{item.size}
								</span>
							</div>
						</div>
					</SortableItem>
				))}
			</Sortable>
		</div>
	);
}
