import { zodResolver } from "@hookform/resolvers/zod";
import html2canvas from "html2canvas-pro";
import { Bug, Send, X } from "lucide-react";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from "./components/ui/dialog";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "./components/ui/empty";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { Spinner } from "./components/ui/spinner";
import { Textarea } from "./components/ui/textarea";
import FeedbackCanvas from "./FeedbackCanvas";

const formSchema = z.object({
	title: z.string().min(1, { error: "Provide a valid overview!" }).max(50, {
		error:
			"Maximum of 50 characters allowed! Explain more in the description if necessary.",
	}),
	description: z
		.string()
		.max(5000, { error: "Maximum of 5000 characteres allowed!" })
		.optional(),
});
function FeedbackWidget() {
	const formId = useId();
	const [open, setOpen] = useState<boolean>(false);
	const contentId = useId();
	const overlayId = useId();
	const thingId = useId();
	const triggerId = useId();

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isPending, startTransition] = useTransition();
	const [screenshotData, setScreenshotData] = useState<string | null>(null);
	const [canvasElementIds, setCanvasElementIds] = useState<string[]>([]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log("submitted ", values);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: maybe use react 19.2 later
	useEffect(() => {
		if (!open) return;
		const captureScreenshot = async () => {
			// Simulate network delay for testing
			// await new Promise((resolve) => setTimeout(resolve, 2000));

			// Use html2canvas to capture the page
			const canvas = await html2canvas(document.body, {
				scrollX: 0,
				scrollY: 0,
				x: window.scrollX,
				y: window.scrollY,
				width: window.innerWidth,
				height: window.innerHeight,
				windowWidth: window.innerWidth,
				windowHeight: window.innerHeight,
				ignoreElements: (element) => {
					// Check for data-html2canvas-ignore attribute first
					if (element.getAttribute('data-html2canvas-ignore') !== null) {
						return true;
					}

					// Don't include the widget itself and all canvas elements in the screenshot
					const excludedIds = [
						overlayId,
						contentId,
						triggerId,
						...canvasElementIds,
					];

					// Check if element or any of its parents should be excluded by ID
					let currentElement: Element | null = element;
					while (currentElement) {
						if (excludedIds.includes(currentElement.id)) {
							return true;
						}
						currentElement = currentElement.parentElement;
					}

					return false;
				},
			});

			// Convert canvas to data URL
			const dataUrl = canvas.toDataURL('image/png');
			return dataUrl;
		};

		// Wrap in startTransition for loading state
		startTransition(async () => {
			const dataUrl = await captureScreenshot();
			setScreenshotData(dataUrl);
		});
	}, [open]);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger
				id={triggerId}
				className="absolute z-[9997] bottom-4 right-4"
				asChild
			>
				<Button
					mode={"icon"}
					className="fixed rounded-full p-6"
					variant={"mono"}
				>
					<Bug className="size-5" />
				</Button>
			</DialogTrigger>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} id={formId}>
					<DialogContent
						overlayId={overlayId}
						id={contentId}
						showCloseButton={false}
						variant={"fullscreen"}
						className="flex flex-row gap-2 z-[9998]"
					>
						<div className="w-full h-full py-0">
							{isPending && (
								<div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
									<Empty className="w-full">
										<EmptyHeader>
											<EmptyMedia variant="icon">
												<Spinner />
											</EmptyMedia>
											<EmptyTitle>Creating Screenshot</EmptyTitle>
											<EmptyDescription>
												Please wait while the screenshot is generated, this
												should only take a few seconds.
											</EmptyDescription>
										</EmptyHeader>
									</Empty>
								</div>
							)}
							<FeedbackCanvas
								isLoading={isPending}
								thingId={thingId}
								canvasRef={canvasRef}
								screenshotData={screenshotData}
								onCanvasElementIds={setCanvasElementIds}
							/>
						</div>
						<Card className="h-full rounded-2xl w-4/12 flex flex-col">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									Provide Feedback
								</CardTitle>
								<CardDescription>
									Provide explanations for your annotations, this will help the
									developer better fix/improve the site.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6 flex-1 flex flex-col overflow-hidden">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Title</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Provide Basic Annotation"
													disabled={isPending}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem className="flex-1 flex flex-col overflow-hidden">
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													placeholder="Optional, provide a detailed overveiew to developers to better undestand what changes/improvements you want"
													className="h-full max-h-full resize-none"
													disabled={isPending}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</CardContent>
							<CardFooter className="gap-2 flex-col">
								<DialogClose asChild>
									<Button
										className="w-full"
										variant={"outline"}
										disabled={isPending}
									>
										<X />
										Close
									</Button>
								</DialogClose>
								<Button
									className="w-full"
									type="submit"
									form={formId}
									disabled={isPending}
								>
									<Send />
									Send Feedback
								</Button>
							</CardFooter>
						</Card>
					</DialogContent>
				</form>
			</Form>
		</Dialog>
	);
}

export default FeedbackWidget;
