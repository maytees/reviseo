import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyRequest } from "./VerifyRequest";

export const metadata: Metadata = {
	title: "Verify Request",
};

export default function VerifyRequestRoute() {
	return (
		<Suspense>
			<VerifyRequest />
		</Suspense>
	);
}
