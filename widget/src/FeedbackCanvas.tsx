import type { Ref } from "react";

const FeedbackCanvas = ({ ref }: { ref: Ref<HTMLCanvasElement> }) => {
	return (
		<canvas ref={ref} className="h-full w-full">
			FeedbackCanvas
		</canvas>
	);
};

export default FeedbackCanvas;
