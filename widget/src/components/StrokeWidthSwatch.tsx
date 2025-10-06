import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ButtonGroup } from "./ui/button-group";

interface StrokeWidthSwatchProps {
	onStrokeWidthChange: (width: number) => void;
	selectedStrokeWidth?: number;
}

const STROKE_WIDTHS = [
	{ name: "Thin", value: 2 },
	{ name: "Medium", value: 5 },
	{ name: "Thick", value: 10 },
];

export default function StrokeWidthSwatch({
	onStrokeWidthChange,
	selectedStrokeWidth = 5,
}: StrokeWidthSwatchProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button mode="icon" variant="outline" className="relative">
					<div className="flex items-center justify-center">
						<div
							className="bg-gray-800 rounded-full"
							style={{
								width: "24px",
								height: `${selectedStrokeWidth}px`,
							}}
						/>
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent side="right" className="w-auto p-0 z-[99999]">
				<ButtonGroup>
					{STROKE_WIDTHS.map((strokeWidth) => (
						<Button
							variant={
								selectedStrokeWidth === strokeWidth.value ? "dashed" : "outline"
							}
							key={strokeWidth.value}
							type="button"
							mode={"icon"}
							onClick={() => onStrokeWidthChange(strokeWidth.value)}
							className="flex items-center justify-center"
						>
							<div
								className="bg-gray-800 rounded-full"
								style={{
									width: "16px",
									height: `${strokeWidth.value}px`,
								}}
							/>
						</Button>
					))}
				</ButtonGroup>
			</PopoverContent>
		</Popover>
	);
}
