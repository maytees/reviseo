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
import { Navbar } from "@/components/landing/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge, type BadgeVariantsType } from "@/components/ui/badge";
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
		<div className="relative w-full min-h-screen min-h-scren">
			<div className="z-50 flex items-center justify-center w-full px-2 pt-6 sm:px-4 md:px-6 top-4">
				<Navbar />
			</div>
			<section className="xl:px-18 lg:pr-10 lg:pl-5 mt-42">
				<div className="relative flex flex-row items-start justify-around lg:space-x-10 ">
					<div className="sticky flex-col hidden w-3/12 xl:w-2/12 lg:flex top-42">
						<div className="flex flex-col w-full h-full ">
							<div className="w-fit">
								<p className="text-sm font-bold tracking-widest text-left uppercase text-muted-foreground">
									Author
								</p>
								<Separator className="my-2" />
							</div>
							<div className="flex flex-row items-center gap-3 mt-1">
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
									<p className="text-sm font-semibold">{articleData.author}</p>
									<span className="text-xs text-muted-foreground">
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
							<div className="flex flex-row items-center justify-between mt-5">
								<p className="text-sm font-bold tracking-widest text-left uppercase text-muted-foreground">
									Published
								</p>
								<span className="text-xs font-medium text-muted-foreground">
									{moment(articleData.date).format("MMM Do YY")}
								</span>
							</div>
							<div className="flex flex-row items-center justify-between mt-5">
								<p className="text-sm font-bold tracking-widest text-left uppercase text-muted-foreground">
									Last Modified
								</p>
								<span className="text-xs font-medium text-muted-foreground">
									{moment(articleData.lastModified).format("MMM Do YY")}
								</span>
							</div>
							<div className="flex flex-row items-center justify-between mt-2">
								<p className="text-sm font-bold tracking-widest text-left uppercase text-muted-foreground">
									Category
								</p>
								<Badge
									variant={
										categoryMap[
											articleData.category as keyof typeof categoryMap
										] as BadgeVariantsType
									}
									appearance={"outline"}
									className="w-fit"
								>
									{articleData.category.at(0)?.toUpperCase() +
										articleData.category.substring(1)}
								</Badge>
							</div>

							{articleData.seeMore && articleData.seeMore.length > 0 && (
								<div className="mt-2 w-fit">
									<p className="text-sm font-bold tracking-widest text-left uppercase text-muted-foreground">
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
													className="text-sm font-semibold font-caudex hover:underline text-accent-foreground"
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
							className="flex flex-row items-center gap-1 mt-8 text-sm font-semibold hover:underline text-primary"
						>
							<ArrowLeft className="font-semibold size-4" />
							See All
						</Link>
					</div>
					<div className="flex flex-col flex-1 gap-6 max-w-9/12">
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
							<div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-border/50 bg-muted/30">
								<Image
									src={articleData.cover}
									alt={articleData.title}
									fill
									className="object-cover"
								/>
							</div>
						) : null}
						<header className="flex flex-col gap-2">
							<h1 className="text-3xl font-bold sm:text-4xl md:text-5xl font-caudex">
								{articleData.title}
							</h1>
							{articleData.description ? (
								<p className="text-base sm:text-lg text-muted-foreground">
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
