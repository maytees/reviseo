import { Tabs, TabsContent, TabsList, TabsTrigger } from "web";

export const Basic = () => (
	<Tabs defaultValue="feedback" className="w-96">
		<TabsList>
			<TabsTrigger value="feedback">Feedback</TabsTrigger>
			<TabsTrigger value="team">Team</TabsTrigger>
			<TabsTrigger value="settings">Settings</TabsTrigger>
		</TabsList>
		<TabsContent value="feedback" className="pt-3 text-muted-foreground text-sm">
			12 new submissions this week across 3 websites.
		</TabsContent>
		<TabsContent value="team" className="pt-3 text-sm">
			Team members
		</TabsContent>
		<TabsContent value="settings" className="pt-3 text-sm">
			Settings
		</TabsContent>
	</Tabs>
);
