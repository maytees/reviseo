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

			<div className="text-balance text-center font-inter text-muted-foreground text-sm">
				By clicking continue, you agree to our{" "}
				<Link
					href="/terms"
					className="font-semibold hover:cursor-pointer hover:text-primary hover:underline"
				>
					Terms of service
				</Link>{" "}
				and{" "}
				<Link
					href="/privacy"
					className="font-semibold hover:cursor-pointer hover:text-primary hover:underline"
				>
					Privacy Policy
				</Link>
				.
			</div>
		</Suspense>
	);
}
