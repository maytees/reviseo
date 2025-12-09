import type { ReactNode } from "react";
import { Footer } from "@/components/landing/Footer";

export default function OnboardingLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="relative min-h-screen w-full overflow-hidden">
			{/* Background Gradient */}
			<div
				className="-translate-x-1/2 -z-50 pointer-events-none absolute top-[40vh] left-1/2 h-[1000px] w-full opacity-30 blur-3xl"
				style={{
					background:
						"radial-gradient(circle, var(--secondary), transparent 80%)",
				}}
			/>

			{/* Navbar */}
			{/* <div className="sticky top-4 z-50 flex w-full items-center justify-center px-2 pt-6 sm:px-4 md:px-6">
				<Navbar />
			</div> */}

			<div className="relative z-10">{children}</div>
			<Footer />
		</div>
	);
}
