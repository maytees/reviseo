import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "web";

export const Basic = () => (
	<Card className="w-95">
		<CardHeader>
			<CardTitle className="text-xl">Please check your email</CardTitle>
			<CardDescription>
				We sent a verification code to your email address. Open the email and
				paste the code below.
			</CardDescription>
		</CardHeader>
		<CardContent>
			<p className="text-sm text-muted-foreground">
				Didn&apos;t receive anything? Check your spam folder or resend the
				code.
			</p>
		</CardContent>
		<CardFooter className="justify-end gap-2">
			<Button variant="ghost">Resend code</Button>
			<Button variant="primary">Verify</Button>
		</CardFooter>
	</Card>
);

export const ProjectSummary = () => (
	<Card className="w-95">
		<CardHeader>
			<CardTitle>voltrush.com</CardTitle>
			<CardDescription>Feedback activity for the last 7 days</CardDescription>
		</CardHeader>
		<CardContent className="space-y-3">
			<div className="flex items-center justify-between text-sm">
				<span>New submissions</span>
				<Badge variant="info">12</Badge>
			</div>
			<div className="flex items-center justify-between text-sm">
				<span>Awaiting approval</span>
				<Badge variant="warning">3</Badge>
			</div>
			<div className="flex items-center justify-between text-sm">
				<span>Resolved</span>
				<Badge variant="success">27</Badge>
			</div>
		</CardContent>
		<CardFooter className="justify-end">
			<Button variant="outline" size="sm">
				Open dashboard
			</Button>
		</CardFooter>
	</Card>
);
