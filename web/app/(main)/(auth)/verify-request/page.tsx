import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { VerifyRequest } from "./VerifyRequest";

export const metadata: Metadata = {
	title: "Verify Request",
};

export default function VerifyRequestRoute() {
	return (
		<Suspense>
			<VerifyRequest />

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
		</Suspense>
	);
}
