import type { Metadata } from "next";
import { CancelPage } from "./CancelPage";

export const metadata: Metadata = {
	title: "Subscription Cancelled",
};

const BillingCancelPage = () => {
	return <CancelPage />;
};

export default BillingCancelPage;
