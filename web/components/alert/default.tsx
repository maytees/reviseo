import { RiNotificationFill } from "@remixicon/react";
import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertToolbar,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Component() {
	return (
		<div className="flex w-full flex-col items-center gap-6 lg:max-w-[75%]">
			<Alert close={true}>
				<AlertIcon>
					<RiNotificationFill />
				</AlertIcon>
				<AlertTitle>This is a primary alert</AlertTitle>
				<AlertToolbar>
					<Button
						variant="inverse"
						mode="link"
						underlined="solid"
						size="sm"
						className="mt-0.5 flex"
					>
						Upgrade
					</Button>
				</AlertToolbar>
			</Alert>
		</div>
	);
}
