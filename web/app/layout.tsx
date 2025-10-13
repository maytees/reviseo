import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Alegreya, Caudex, Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
	display: 'swap',
})

const caudex = Caudex({
	subsets: ['latin'],
	weight: ['400', '700'],
	variable: '--font-caudex',
	display: 'swap',
})

const alegreya = Alegreya({
	subsets: ['latin'],
	variable: '--font-alegreya',
	display: 'swap',
})

export const metadata: Metadata = {
	title: "Reviseo — Freelancing Simplified",
	description: "All in one platform for academic productivity.",
	icons: {
		icon: "/logo.svg",
		shortcut: "/logo.svg",
	}
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${caudex.variable} ${alegreya.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Toaster position="bottom-right" />
				</ThemeProvider>
			</body>
		</html>
	);
}
