"use client";

import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { tryCatch } from "@/lib/try-catch";
import { finalizeClientToken } from "./actions";

const InvitePage = ({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) => {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();
	const search = use(searchParams);
	const token = search.token ?? null;

	useEffect(() => {
		if (isPending) return;

		// If query param present, persist it for the login page to use
		if (token) {
			localStorage.setItem("token", token);
		}

		const storageToken = localStorage.getItem("token");

		// If user not logged in, redirect to login (login page should read storageToken and redirect back after auth)
		if (!session?.user) {
			// keep storageToken intact so login can use it
			router.push("/login");
			return;
		}

		// If logged in but no token anywhere, nothing to finalize -> optionally navigate elsewhere
		if (!storageToken) {
			// no invite token to finalize; decide default landing
			router.push("/client/dashboard");
			return;
		}

		// finalize token
		const finalize = async () => {
			try {
				const { data: result, error } = await tryCatch(
					finalizeClientToken(storageToken),
				);

				if (error) {
					console.error("Token finalize error:", error);
					// treat network transiently: show an error UI or retry. For permanent errors you can clear the token:
					// localStorage.removeItem("token");
					// router.push("/client/dashboard");
					return;
				}

				if (result?.status === "error") {
					console.error("Token finalize returned error:", result.message);
					// If token invalid/used/expired — remove it so we don't keep retrying
					localStorage.removeItem("token");
					// show message or redirect
					router.push("/client/dashboard");
					return;
				}

				// Success — remove token and navigate to target page
				localStorage.removeItem("token");
				// You can navigate to a special “post-invite” page or dashboard
				router.push("/client/dashboard");
			} catch (err) {
				console.error("Unexpected finalize error", err);
				// keep token (or remove depending on your error policy)
			}
		};

		finalize();
	}, [token, session?.user, isPending, router]);

	if (isPending) return <div>Loading...</div>;
	return <div>InvitePage</div>;
};

export default InvitePage;
