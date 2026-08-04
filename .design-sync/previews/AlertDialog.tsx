import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "web";

export const DeleteWebsite = () => (
	<AlertDialog open>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Delete voltrush.com?</AlertDialogTitle>
				<AlertDialogDescription>
					This permanently removes the website, its widget install, and all 42
					feedback submissions. This action cannot be undone.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction>Delete website</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
);
