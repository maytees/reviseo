import moment from "moment";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAllArticles } from "@/lib/blog";
import { categoryMap } from "@/lib/types";

export const metadata: Metadata = {
	title: "Blog",
};

const BlogPage = async () => {
	const articles = await getAllArticles();

	return (
		<div className="relative min-h-screen min-h-scren w-full overflow-x-hidden">
			{/* <div className="sticky top-4 z-50 flex w-full items-center justify-center px-2 pt-6 sm:px-4 md:px-6">
				<Navbar />
			</div> */}
			<header className="mt-48">
				<h1 className="mx-auto max-w-xl text-center font-caudex font-extrabold text-5xl">
					Learn with Reviseo
				</h1>
				<p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground text-sm">
					Explore in depth articles, company news, product updates, and insights
					to help you get te most out of Reviseo. Learn how tools, features, and
					community can support your growth and success.
				</p>
			</header>
			<section className="mt-10 grid place-content-center gap-y-10 md:grid-cols-2 md:px-5 lg:grid-cols-3 lg:px-10 xl:px-28">
				{articles.map((article) => (
					<Link
						className="h-120 max-w-sm rounded-xl p-5 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent/20 focus:scale-105 focus:bg-accent/20"
						key={article.id}
						href={`/blog/${article.slug ?? article.id}`}
					>
						<div className="flex h-full flex-col items-start justify-between">
							<div>
								<Image
									width={600}
									height={400}
									className="rounded-t-2xl"
									alt={`${article.title} alt`}
									src={article.cover ? article.cover : "/excalidraw-light.png"}
								/>
								<div className="mt-2 flex flex-row justify-between">
									<Badge
										variant={categoryMap[article.category]}
										appearance={"outline"}
									>
										{article.category.at(0)?.toUpperCase() +
											article.category.substring(1)}
									</Badge>
									<p className="text-muted-foreground text-xs">
										{moment(article.date).format("MMM Do YY")}
									</p>
								</div>
								<h1 className="mt-5 font-caudex font-semibold text-2xl">
									{article.title}
								</h1>
								<p className="mt-1 text-muted-foreground text-sm">
									{article.description ?? "No description."}
								</p>
							</div>
							<div className="mt-auto flex flex-row items-start gap-3">
								{article.authorImage && (
									<Avatar className="size-10">
										<AvatarImage src={article.authorImage} />
										<AvatarFallback>
											{article.author
												.split(" ")
												.map((word) => word[0])
												.join("")
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
								)}
								<div className="flex flex-col items-start">
									<p className="font-semibold text-sm">{article.author}</p>
									<span className="text-muted-foreground text-xs">
										{article.authorRole}
									</span>
								</div>
							</div>
						</div>
					</Link>
				))}
			</section>
			<FinalCTA />
			<Footer />
		</div>
	);
};

export default BlogPage;
