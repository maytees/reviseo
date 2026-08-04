import {
	Badge,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "web";

export const FeedbackList = () => (
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Title</TableHead>
				<TableHead>Type</TableHead>
				<TableHead>Priority</TableHead>
				<TableHead>Status</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			<TableRow>
				<TableCell>Hero heading overlaps nav</TableCell>
				<TableCell>
					<Badge variant="destructive" appearance="light">
						Bug
					</Badge>
				</TableCell>
				<TableCell>High</TableCell>
				<TableCell>
					<Badge variant="warning">In progress</Badge>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>Swap hero product shot</TableCell>
				<TableCell>
					<Badge variant="info2" appearance="light">
						Image edit
					</Badge>
				</TableCell>
				<TableCell>Low</TableCell>
				<TableCell>
					<Badge variant="success">Resolved</Badge>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>Tighten CTA copy</TableCell>
				<TableCell>
					<Badge variant="info" appearance="light">
						Text edit
					</Badge>
				</TableCell>
				<TableCell>Medium</TableCell>
				<TableCell>
					<Badge variant="secondary">New</Badge>
				</TableCell>
			</TableRow>
		</TableBody>
	</Table>
);
