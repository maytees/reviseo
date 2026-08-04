import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "web";

export const Placeholder = () => (
	<div className="w-72">
		<Select>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Select priority" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="low">Low</SelectItem>
				<SelectItem value="medium">Medium</SelectItem>
				<SelectItem value="high">High</SelectItem>
			</SelectContent>
		</Select>
	</div>
);

export const WithValue = () => (
	<div className="w-72">
		<Select defaultValue="improvement">
			<SelectTrigger className="w-full">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="bug">Bug</SelectItem>
				<SelectItem value="improvement">Improvement</SelectItem>
			</SelectContent>
		</Select>
	</div>
);

export const Disabled = () => (
	<div className="w-72">
		<Select disabled defaultValue="bug">
			<SelectTrigger className="w-full">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="bug">Bug</SelectItem>
			</SelectContent>
		</Select>
	</div>
);
