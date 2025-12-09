import type React from "react";
import { Navbar } from "@/components/landing/Navbar";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
};

export default LandingLayout;
