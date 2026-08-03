import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";
import DocsContent from "./_components/DocsContent";

export const metadata: Metadata = {
	title: "Installation Docs",
	description:
		"Install the Reviseo feedback widget on any site — plain HTML, Next.js, React, Vue, Nuxt, WordPress, or Shopify.",
};

export default function DocsPage() {
	return (
		<div className="relative min-h-screen w-full overflow-x-hidden">
			<DocsContent />
			<Footer />
		</div>
	);
}
