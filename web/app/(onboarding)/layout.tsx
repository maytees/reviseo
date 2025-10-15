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
				className="absolute top-[40vh] opacity-30 left-1/2 -translate-x-1/2 w-full h-[1000px] pointer-events-none -z-50 blur-3xl "
				style={{
					background:
						"radial-gradient(circle, var(--secondary), transparent 80%)",
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
