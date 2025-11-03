import type { Metadata } from "next";
import { Caudex, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "react-photo-view/dist/react-photo-view.css";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

const caudex = Caudex({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-caudex",
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		default: "Reviseo",
		template: "%s - Reviseo",
	},
	description:
		"Platform for freelance web developers to make visual client feedback seamless.",
	icons: {
		icon: "/logo.svg",
		shortcut: "/logo.svg",
	},
	twitter: {
		card: "summary_large_image",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${caudex.variable} ${inter.variable} antialiased`}
			>
				<ThemeProvider attribute="class" defaultTheme="dark">
					{children}
					<Toaster position="bottom-right" />
				</ThemeProvider>
			</body>
		</html>
	);
}
