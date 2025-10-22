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
			<body className="bg-transparent max-w-fit">{children}</body>
		</html>
	);
}
