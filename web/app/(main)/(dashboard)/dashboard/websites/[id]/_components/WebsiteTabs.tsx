"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { UserDataType } from "@/app/data/user/get-user-data";
import type { WebsiteDataTypeNonNullable } from "@/app/data/website/get-website-by-id-and-dev-id";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientInfo from "./client/ClientInfo";
import FeedbackTable from "./feedback/FeedbackTable";
import SettingsTab from "./settings/SettingsTab";
import WidgetTab from "./widget/WidgetTab";

interface WebsiteTabsProps {
	website: WebsiteDataTypeNonNullable;
	openId: string | string[] | undefined;
	userData: UserDataType;
}

export default function WebsiteTabs({
	website,
	openId,
	userData,
}: WebsiteTabsProps) {
	const searchParams = useSearchParams();
	const activeTab = searchParams.get("tab") || "feedback";

	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		if (!isMounted) {
			setIsMounted(true);
		}
	}, [isMounted]);

	if (!isMounted) return null;

	return (
		<Tabs defaultValue={activeTab} className="mt-4">
			<TabsList className="grid h-8 grid-cols-4">
				<TabsTrigger value={"feedback"}>Feedback</TabsTrigger>
				<TabsTrigger value={"client"}>Client</TabsTrigger>
				<TabsTrigger value={"widget"}>Widget</TabsTrigger>
				<TabsTrigger value={"settings"}>Settings</TabsTrigger>
			</TabsList>
			<TabsContent value="feedback">
				<FeedbackTable website={website} open={openId} />
			</TabsContent>
			<TabsContent value="client">
				<ClientInfo website={website} userData={userData} />
			</TabsContent>
			<TabsContent value="widget">
				<WidgetTab
					projectId={website.projectId}
					widgetInstalled={website.widgetInstalled}
					verifiedAt={website.verifiedAt}
				/>
			</TabsContent>
			<TabsContent value="settings">
				<SettingsTab website={website} />
			</TabsContent>
		</Tabs>
	);
}
