import { getUserCurrentPlan } from "@/app/data/user/get-user-plan";
import { Footer } from "@/components/landing/Footer";
import { Pricing } from "@/components/landing/Pricing";
import BackgroundStuff from "../../_components/BackgroundStuff";

export default async function PricingPage() {
	const { subscription } = await getUserCurrentPlan();

	return (
		<div className="relative min-h-screen min-h-scren w-full overflow-x-hidden">
			<BackgroundStuff short />
			{/* <div className="sticky top-4 z-50 flex w-full items-center justify-center px-2 pt-6 sm:px-4 md:px-6">
				<Navbar />
			</div> */}
			<Pricing plan={subscription} />
			<Footer />
		</div>
	);
}
