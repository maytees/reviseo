import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ColorSwatchProps {
	onColorChange: (color: string) => void;
	selectedColor?: string;
}
const COLORS = [
	{ name: "Black", value: "#000000" },
	{ name: "Red", value: "#d58489" },
	{ name: "Orange", value: "#ffd6a8" },
	{ name: "Yellow", value: "#fff085" },
	{ name: "Green", value: "#b9f8cf" },
	{ name: "Blue", value: "#bedbff" },
	{ name: "Purple", value: "#e9d4ff" },
	{ name: "Pink", value: "#fccee8" },
];

export default function ColorSwatch({
	onColorChange,
	selectedColor = "#000000",
}: ColorSwatchProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					mode="icon"
					variant="outline"
					tooltip="Color"
					className="relative"
				>
					<div
						className="size-4 rounded-full border border-gray-300"
						style={{ backgroundColor: selectedColor }}
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent side="right" className="w-auto p-3 z-[99999]">
				<fieldset className="space-y-3">
					<legend className="text-foreground text-sm leading-none font-medium">
						Choose a color
					</legend>
					<RadioGroup
						className="grid grid-cols-6 gap-2"
						value={selectedColor}
						onValueChange={onColorChange}
					>
						{COLORS.map((color) => (
							<RadioGroupItem
								key={color.value}
								value={color.value}
								aria-label={color.name}
								className="size-7 border-2 shadow-none data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2 data-[state=checked]:ring-gray-400"
								style={{
									backgroundColor: color.value,
									borderColor: color.value,
								}}
							/>
						))}
					</RadioGroup>
				</fieldset>
			</PopoverContent>
		</Popover>
	);
}
