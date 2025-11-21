import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SlimSwitchProps {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	label?: string;
	className?: string;
}

export default function SlimSwitch({
	checked,
	onCheckedChange,
	disabled,
	label = "M2-style switch",
	className,
}: SlimSwitchProps) {
	const id = useId();
	return (
		<div className={`inline-flex items-center gap-2 ${className || ""}`}>
			<Switch
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
				disabled={disabled}
				className="h-3 w-9 border-none outline-offset-[6px] [&_span]:border [&_span]:border-input"
			/>
			<Label htmlFor={id} className="sr-only">
				{label}
			</Label>
		</div>
	);
}
