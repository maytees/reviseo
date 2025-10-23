// app/(widget)/layout.tsx
import "./widget.css"; // or import tailwind here
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function WidgetLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${inter.className} max-w-fit`}>
			<body className="flex flex-row items-center justify-center w-16 h-16 overflow-hidden bg-transparent max-w-16 max-h-16">
				{children}
			</body>
		</html>
	);
}
