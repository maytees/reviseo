import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./widget.css";

const inter = Inter({ subsets: ["latin"] });

export default function WidgetLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.className}>
			<body className="flex h-screen w-screen items-center justify-center overflow-hidden bg-transparent">
				{children}
				<Toaster position="bottom-right" />
			</body>
		</html>
	);
}
