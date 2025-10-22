import type { Metadata } from "next";
import { Caudex, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
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

// const alegreya = Alegreya({
// 	subsets: ['latin'],
// 	variable: '--font-inter',
// 	display: 'swap',
// })

export const metadata: Metadata = {
	title: "Reviseo — Freelancing Simplified",
	description:
		"Platform for freelance web developers to make client revisieons seamless.",
	icons: {
		icon: "/logo.svg",
		shortcut: "/logo.svg",
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
