import type { Metadata } from "next";
import { SuccessPage } from "./SuccessPage";

export const metadata: Metadata = {
	title: "Thank You",
};

const BillingSuccessPage = () => {
	return <SuccessPage />;
};

export default BillingSuccessPage;
