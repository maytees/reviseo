import moment from "moment";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
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
		<div className="relative w-full min-h-screen overflow-x-hidden min-h-scren">
			<div className="sticky z-50 flex items-center justify-center w-full px-2 pt-6 sm:px-4 md:px-6 top-4">
				<Navbar />
			</div>
			<header className="mt-48">
				<h1 className="max-w-xl mx-auto text-5xl font-extrabold text-center font-caudex">
					Learn with Reviseo
				</h1>
				<p className="max-w-xl mx-auto mt-2 text-sm text-center text-muted-foreground">
					Explore in depth articles, company news, product updates, and insights
					to help you get te most out of Reviseo. Learn how tools, features, and
					community can support your growth and success.
				</p>
			</header>
			<section className="grid mt-10 gap-y-10 lg:px-10 xl:px-28 md:px-5 place-content-center md:grid-cols-2 lg:grid-cols-3">
				{articles.map((article) => (
					<Link
						className="max-w-sm p-5 transition-all duration-300  ease-in-out h-[30rem] focus:bg-accent/20 hover:bg-accent/20 rounded-xl focus:scale-105 hover:scale-105"
						key={article.id}
						href={`/blog/${article.slug ?? article.id}`}
					>
						<div className="flex flex-col items-start justify-between h-full">
							<div>
								<Image
									width={600}
									height={400}
									className="rounded-t-2xl"
									alt={`${article.title} alt`}
									src={article.cover ? article.cover : "/excalidraw-light.png"}
								/>
								<div className="flex flex-row justify-between mt-2">
									<Badge
										variant={
											categoryMap[
												article.category as keyof typeof categoryMap
											] as
												| "info"
												| "success"
												| "warning"
												| "primary"
												| "secondary"
												| "outline"
												| "destructive"
												| null
												| undefined
										}
										appearance={"outline"}
									>
										{article.category.at(0)?.toUpperCase() +
											article.category.substring(1)}
									</Badge>
									<p className="text-xs text-muted-foreground">
										{moment().format("MMM Do YY")}
									</p>
								</div>
								<h1 className="mt-5 text-2xl font-semibold font-caudex">
									{article.title}
								</h1>
								<p className="mt-1 text-sm text-muted-foreground">
									{article.description ?? "No description."}
								</p>
							</div>
							<div className="flex flex-row items-start gap-3 mt-auto">
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
									<p className="text-sm font-semibold">{article.author}</p>
									<span className="text-xs text-muted-foreground">
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
