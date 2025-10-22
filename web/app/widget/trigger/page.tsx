"use client";
import Image from "next/image";
import { type MouseEventHandler, useEffect, useId } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const TriggerButton = () => {
	const {
		data: session,
		isPending, //loading state
	} = authClient.useSession();

	const triggerId = useId();

	useEffect(() => {
		console.log(document.title, "is title");
		console.log(session?.user.email, "is email");
	}, [isPending]);

	const handleWidgetOpen: MouseEventHandler<HTMLButtonElement> = (e) => {
		window.parent.postMessage({ type: "OPEN_FORM" }, "*");
	};

	return (
		<Button
			disabled={isPending}
			id={triggerId}
			className={cn(
				"rounded-full border-2 border-border size-14",
				!session?.user && "hidden",
			)}
			variant={"secondary"}
			onClick={handleWidgetOpen}
		>
			{/* <Bug className={"text-foreground"} /> */}
			<Image
				priority
				src={"/logo.svg"}
				width={35}
				height={35}
				alt={"Reviseo Logo"}
			/>
		</Button>
	);
};

export default TriggerButton;
