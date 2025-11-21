import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserData } from "@/app/data/user/get-user-data";
import DashboardFooter from "../_components/DashboardFooter";
import AccountInfoSection from "./_components/AccountInfoSection";
import DangerZoneSection from "./_components/DangerZoneSection";
import NotificationsSection from "./_components/NotificationsSection";
import ProfileSection from "./_components/ProfileSection";

export const metadata: Metadata = {
	title: "Settings",
};

export default async function SettingsPage() {
	const userData = await getUserData();

	if (!userData) return notFound();

	return (
		<div className="flex min-h-full flex-col">
			<div className="flex-1 space-y-6">
				<div className="flex flex-col gap-0.5">
					<h1 className="font-bold font-caudex text-3xl">Settings</h1>
					<p className="text-muted-foreground text-sm">
						Manage your account settings and preferences.
					</p>
				</div>

				{/* Profile Section */}
				<ProfileSection user={userData} />

				{/* Account Info Section */}
				<AccountInfoSection user={userData} />

				{/* Notifications Section */}
				<NotificationsSection user={userData} />

				{/* Danger Zone */}
				<DangerZoneSection />
			</div>
			<DashboardFooter />
		</div>
	);
}
