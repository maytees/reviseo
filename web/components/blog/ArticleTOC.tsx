"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type HeadingItem = {
	id: string;
	text: string;
	level: number;
};

export function ArticleTOC({
	containerSelector = "#article-content",
	minHeadingLevel = 2,
	maxHeadingLevel = 3,
	disableIndex = false,
}: {
	containerSelector?: string;
	minHeadingLevel?: number;
	maxHeadingLevel?: number;
	disableIndex?: boolean;
}) {
	const [headings, setHeadings] = useState<HeadingItem[]>([]);

	const selector = useMemo(() => {
		const levels = [] as string[];
		for (let lvl = minHeadingLevel; lvl <= maxHeadingLevel; lvl++) {
			levels.push(`h${lvl}`);
		}
		return levels.join(", ");
	}, [minHeadingLevel, maxHeadingLevel]);

	useEffect(() => {
		const container = document.querySelector(containerSelector);
		if (!container) return;

		const existing = Array.from(
			container.querySelectorAll(selector),
		) as HTMLHeadingElement[];
		if (!existing.length) return;

		// Build unique slugs and ensure ids
		const used = new Map<string, number>();
		const toSlug = (text: string) =>
			text
				.trim()
				.toLowerCase()
				.replace(/[\s\t\n]+/g, "-")
				.replace(/[^a-z0-9-]/g, "")
				.replace(/-+/g, "-")
				.replace(/^-|-$|/g, "");

		const items: HeadingItem[] = existing.map((h) => {
			let id = h.id?.trim();
			if (!id) {
				const base = toSlug(h.textContent || "section");
				const count = used.get(base) ?? 0;
				used.set(base, count + 1);
				id = count === 0 ? base : `${base}-${count + 1}`;
				h.id = id;
			}
			return {
				id,
				text: h.textContent || "Untitled",
				level: Number(h.tagName.substring(1)),
			};
		});

		setHeadings(items);
	}, [containerSelector, selector]);

	const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
		e.preventDefault();
		const el = document.getElementById(id);
		if (!el) return;
		const y = el.getBoundingClientRect().top + window.scrollY - 88; // account for navbar
		window.scrollTo({ top: y, behavior: "smooth" });
	};

	if (!headings.length) return null;

	return (
		<nav className="sticky top-42 hidden h-fit max-w-xs xl:block">
			<div className="rounded-xl border border-border/50 bg-background/60 p-4 backdrop-blur supports-backdrop-filter:bg-background/40">
				<h2 className="mb-2 font-bold text-muted-foreground text-sm uppercase tracking-wide">
					On this page
				</h2>
				<ul className="space-y-1 text-sm">
					{headings.map((h, index) => (
						<li key={h.id} className={h.level >= 3 ? "pl-4" : undefined}>
							<Link
								href={`#${h.id}`}
								onClick={(e) => onClick(e, h.id)}
								className="block truncate py-1 text-muted-foreground transition-colors hover:text-foreground"
							>
								{disableIndex ? (
									h.text
								) : (
									<>
										{index + 1}. {h.text}
									</>
								)}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}
