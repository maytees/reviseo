import {
	Button,
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Input,
	Label,
} from "web";

export const InviteTeammate = () => (
	<Dialog open>
		<DialogContent className="max-w-md">
			<DialogHeader>
				<DialogTitle>Invite a teammate</DialogTitle>
				<DialogDescription>
					They&apos;ll get an email with a link to join your workspace.
				</DialogDescription>
			</DialogHeader>
			<DialogBody className="space-y-3">
				<div className="space-y-1.5">
					<Label htmlFor="invite-email">Email address</Label>
					<Input id="invite-email" placeholder="teammate@studio.com" />
				</div>
			</DialogBody>
			<DialogFooter>
				<Button variant="ghost">Cancel</Button>
				<Button variant="primary">Send invite</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
