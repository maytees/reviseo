import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="relative w-full min-h-screen overflow-hidden">
			{/* Background Gradient */}
			<div
				className="absolute -top-10 -left-56 w-[700px] h-[700px] pointer-events-none -z-30 blur-3xl opacity-30"
				style={{
					background:
						"radial-gradient(circle, oklch(0.5053 0.2350 286.8637), transparent 70%)",
				}}
			/>

			{/* Background Dots */}
			<div
				className="fixed inset-0 w-full h-full pointer-events-none -z-40"
				style={{
					backgroundImage: `radial-gradient(circle, #562a2a 1px, transparent 1px)`,
					backgroundSize: "32px 32px",
				}}
			/>

			{/* Navbar */}
			<div className="sticky z-50 flex items-center justify-center w-full px-2 pt-6 sm:px-4 md:px-6 top-4">
				<Navbar />
			</div>

			<div className="flex min-h-[calc(100vh-6rem)] mt-20 flex-col items-center justify-center relative z-10">
				<div className="flex flex-col w-full max-w-md gap-6 px-4">
					{children}
					<div className="text-sm text-center text-balance text-muted-foreground font-inter">
						By clicking continue, you agree to our{" "}
						<Link
							href="/terms"
							className="font-semibold hover:text-primary hover:underline hover:cursor-pointer"
						>
							Terms of service
						</Link>{" "}
						and{" "}
						<Link
							href="/privacy"
							className="font-semibold hover:text-primary hover:underline hover:cursor-pointer"
						>
							Privacy Policy
						</Link>
						.
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
