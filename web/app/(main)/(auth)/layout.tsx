import type { ReactNode } from "react";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="relative min-h-screen w-full overflow-hidden">
			{/* Background Gradient */}
			<div
				className="-top-10 -left-56 -z-30 pointer-events-none absolute h-[700px] w-[700px] opacity-30 blur-3xl"
				style={{
					background:
						"radial-gradient(circle, oklch(0.5053 0.2350 286.8637), transparent 70%)",
				}}
			/>

			{/* Background Dots */}
			<div
				className="-z-40 pointer-events-none fixed inset-0 h-full w-full"
				style={{
					backgroundImage: `radial-gradient(circle, #562a2a 1px, transparent 1px)`,
					backgroundSize: "32px 32px",
				}}
			/>

			{/* Navbar */}
			<div className="sticky top-4 z-50 flex w-full items-center justify-center px-2 pt-6 sm:px-4 md:px-6">
				<Navbar />
			</div>

			<div className="relative z-10 mt-20 flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center">
				<div className="flex w-full max-w-md flex-col gap-6 px-4">
					{children}
					{/* <div className="text-sm text-center text-balance text-muted-foreground font-inter">
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
					</div> */}
				</div>
			</div>
			<Footer />
		</div>
	);
}
