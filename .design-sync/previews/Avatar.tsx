import { Avatar, AvatarFallback } from "web";

export const Fallbacks = () => (
	<div className="flex items-center gap-3">
		<Avatar>
			<AvatarFallback>LL</AvatarFallback>
		</Avatar>
		<Avatar>
			<AvatarFallback className="bg-primary text-primary-foreground">
				MM
			</AvatarFallback>
		</Avatar>
		<Avatar>
			<AvatarFallback className="bg-accent text-accent-foreground">
				DV
			</AvatarFallback>
		</Avatar>
	</div>
);

export const Group = () => (
	<div className="-space-x-2 flex">
		<Avatar className="ring-2 ring-background">
			<AvatarFallback>LL</AvatarFallback>
		</Avatar>
		<Avatar className="ring-2 ring-background">
			<AvatarFallback className="bg-primary text-primary-foreground">
				MM
			</AvatarFallback>
		</Avatar>
		<Avatar className="ring-2 ring-background">
			<AvatarFallback className="bg-secondary text-secondary-foreground">
				+3
			</AvatarFallback>
		</Avatar>
	</div>
);
