import type { ReactNode } from "react";
import { Navbar } from "@/components/landing/Navbar";

export default function OnboardingLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="relative min-h-screen w-full overflow-hidden">
			{/* Background Gradient */}
			<div
				className="absolute -top-10 -left-56 w-[700px] h-[700px] pointer-events-none -z-30 blur-3xl opacity-30"
				style={{
					background:
						"radial-gradient(circle, oklch(0.5053 0.2350 286.8637), transparent 70%)",
				}}
			/>

			{/* Navbar */}
			<div className="w-full pt-6 justify-center flex items-center px-2 sm:px-4 md:px-6 sticky top-4 z-50">
				<Navbar />
			</div>

			<div className="relative z-10">{children}</div>
		</div>
	);
}
