import { ArrowLeft } from "lucide-react";
import moment from "moment";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiLinkedin } from "react-icons/si";
import { ArticleTOC } from "@/components/blog/ArticleTOC";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAllArticles, getArticleData } from "@/lib/blog";
import { categoryMap } from "@/lib/types";

export async function generateStaticParams() {
	const articles = await getAllArticles();

	// Puts id's of all articles into an array (prerender all of these)
	return articles.map(({ id }) => ({
		id,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const articleData = await getArticleData(id);

	if (!articleData) {
		return notFound();
	}

	return {
		title: articleData.title,
		description: articleData.description,
		openGraph: {
			images: [
				{
					// TODO: Unsafe
					url: articleData.cover as string,
				},
			],
		},
	};
}

const ArticlePage = async ({ params }: { params: { id: string } }) => {
	const { id } = await params;
	const articleData = await getArticleData(id);

	if (!articleData) {
		return notFound();
	}

	return (
		<div className="relative min-h-screen min-h-scren w-full">
			{/* <div className="top-4 z-50 flex w-full items-center justify-center px-2 pt-6 sm:px-4 md:px-6">
				<Navbar />
			</div> */}
			<section className="mt-42 lg:pr-10 lg:pl-5 xl:px-18">
				<div className="relative flex flex-row items-start justify-around lg:space-x-10">
					<div className="sticky top-42 hidden w-3/12 flex-col lg:flex xl:w-2/12">
						<div className="flex h-full w-full flex-col">
							<div className="w-fit">
								<p className="text-left font-bold text-muted-foreground text-sm uppercase tracking-widest">
									Author
								</p>
								<Separator className="my-2" />
							</div>
							<div className="mt-1 flex flex-row items-center gap-3">
								{articleData.authorImage && (
									<Avatar className="size-12">
										<AvatarImage src={articleData.authorImage} />
										<AvatarFallback>
											{articleData.author
												.split(" ")
												.map((word: string) => word[0])
												.join("")
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
								)}
								<div className="flex flex-col items-start">
									<p className="font-semibold text-sm">{articleData.author}</p>
									<span className="text-muted-foreground text-xs">
										{articleData.authorRole}
									</span>
								</div>
								<Button
									mode={"icon"}
									className="ml-auto"
									variant={"ghost"}
									asChild
								>
									<Link href={articleData.authorLinkedIn} target="_blank">
										<SiLinkedin className="text-blue-600" />
									</Link>
								</Button>
							</div>
							<div className="mt-5 flex flex-row items-center justify-between">
								<p className="text-left font-bold text-muted-foreground text-sm uppercase tracking-widest">
									Published
								</p>
								<span className="font-medium text-muted-foreground text-xs">
									{moment(articleData.date).format("MMM Do YY")}
								</span>
							</div>
							<div className="mt-5 flex flex-row items-center justify-between">
								<p className="text-left font-bold text-muted-foreground text-sm uppercase tracking-widest">
									Last Modified
								</p>
								<span className="font-medium text-muted-foreground text-xs">
									{moment(articleData.lastModified).format("MMM Do YY")}
								</span>
							</div>
							<div className="mt-2 flex flex-row items-center justify-between">
								<p className="text-left font-bold text-muted-foreground text-sm uppercase tracking-widest">
									Category
								</p>
								<Badge
									variant={categoryMap[articleData.category]}
									appearance={"outline"}
									className="w-fit"
								>
									{articleData.category.at(0)?.toUpperCase() +
										articleData.category.substring(1)}
								</Badge>
							</div>

							{articleData.seeMore && articleData.seeMore.length > 0 && (
								<div className="mt-2 w-fit">
									<p className="text-left font-bold text-muted-foreground text-sm uppercase tracking-widest">
										More like this
									</p>
									<Separator className="my-2" />
									<div className="flex flex-col gap-4">
										{articleData.seeMore.map(async (id) => {
											const a = await getArticleData(id);
											if (!a) return null;
											return (
												<Link
													key={id}
													className="font-caudex font-semibold text-accent-foreground text-sm hover:underline"
													href={`/blog/${id}`}
												>
													{a?.title}
												</Link>
											);
										})}
									</div>
								</div>
							)}
						</div>
						<Link
							href={"/blog"}
							className="mt-8 flex flex-row items-center gap-1 font-semibold text-primary text-sm hover:underline"
						>
							<ArrowLeft className="size-4 font-semibold" />
							See All
						</Link>
					</div>
					<div className="flex max-w-9/12 flex-1 flex-col gap-6">
						{/* <div className="flex items-center justify-between">
							<Link
								href={"/blog"}
								className="flex flex-row gap-1 text-muted-foreground place-items-center"
							>
								<ArrowLeft className="size-4" />
								Back to blog
							</Link>
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<span>{articleData.date.toString()}</span>
								<span>•</span>
								<span>By {articleData.author}</span>
							</div>
						</div> */}
						{articleData.cover ? (
							<div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/50 bg-muted/30">
								<Image
									src={articleData.cover}
									alt={articleData.title}
									fill
									className="object-cover"
								/>
							</div>
						) : null}
						<header className="flex flex-col gap-2">
							<h1 className="font-bold font-caudex text-3xl sm:text-4xl md:text-5xl">
								{articleData.title}
							</h1>
							{articleData.description ? (
								<p className="text-base text-muted-foreground sm:text-lg">
									{articleData.description}
								</p>
							) : null}
						</header>
						{/** biome-ignore lint/correctness/useUniqueElementIds: goon */}
						<article
							id="article-content"
							className="prose dark:prose-invert max-w-none"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: goon
							dangerouslySetInnerHTML={{ __html: articleData.contentHtml }}
						/>
					</div>
					<ArticleTOC disableIndex />
				</div>
			</section>
			<FinalCTA />
			<Footer />
		</div>
	);
};

export default ArticlePage;
