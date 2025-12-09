import type { Metadata } from "next";
import { Suspense } from "react";
import InvitePage from "./InvitePage";

export const metadata: Metadata = {
	title: "Accept Invitation",
};

export default function Page({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) {
	return (
		<Suspense>
			<InvitePage searchParams={searchParams} />
		</Suspense>
	);
}
