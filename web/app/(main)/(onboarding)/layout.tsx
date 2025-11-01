import type { ReactNode } from "react";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

export default function OnboardingLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="relative w-full min-h-screen overflow-hidden">
			{/* Background Gradient */}
			<div
				className="absolute top-[40vh] opacity-30 left-1/2 -translate-x-1/2 w-full h-[1000px] pointer-events-none -z-50 blur-3xl "
				style={{
					background:
						"radial-gradient(circle, var(--secondary), transparent 80%)",
				}}
			/>

			{/* Navbar */}
			<div className="sticky z-50 flex items-center justify-center w-full px-2 pt-6 sm:px-4 md:px-6 top-4">
				<Navbar />
			</div>

			<div className="relative z-10">{children}</div>
			<Footer />
		</div>
	);
}
