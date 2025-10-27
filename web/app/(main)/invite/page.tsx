import { Suspense } from "react";
import InvitePage from "./InvitePage";

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
