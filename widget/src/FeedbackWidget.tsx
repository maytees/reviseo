import { zodResolver } from "@hookform/resolvers/zod";
import { toPng } from "html-to-image";
import { Bug, Loader2, Send, X } from "lucide-react";
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
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";

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

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isPending, startTransition] = useTransition();


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

	useEffect(() => {
		if (!open) return;

		const captureScreenshot = async () => {
			// Wait for the dialog to be fully rendered and the canvas to be available
			await new Promise(resolve => setTimeout(resolve, 100));

			const canvas = canvasRef.current;
			if (!canvas) {
				console.log("Canvas not available yet");
				return;
			}

			// Simulate network delay for testing
			await new Promise(resolve => setTimeout(resolve, 2000));

			// Use html-to-image to capture the page
			const dataUrl = await toPng(document.body, {
				cacheBust: true,
				filter: (element) => {
					// Don't include the widget itself in the screenshot
					return element.id !== 'feedback-widget-content' && element.id !== 'feedback-widget-trigger' && element.id !== 'feedback-widget-overlay';
				}
			});

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			// Set canvas size to match viewport
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			// Create an image from the data URL and draw it on the canvas
			const img = new Image();
			img.onload = () => {
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			};
			img.src = dataUrl;
		};

		// Wrap in startTransition for loading state
		startTransition(async () => {
			console.log("capturing screenshot");
			await captureScreenshot();
		});
	}, [open]);


	return (
		<Dialog
			onOpenChange={setOpen}
			open={open}
		>
			<DialogTrigger id="feedback-widget-trigger" className="absolute z-[9998] bottom-4 right-4" asChild>
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
					<DialogContent id="feedback-widget-content"
						showCloseButton={false}
						variant={"fullscreen"}
						className="flex flex-row gap-2 z-[9999]"
					>
						<div className="w-full h-full py-0 relative">
							{isPending && (
								<div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
									<Loader2 className="size-8 animate-spin text-muted-foreground" />
								</div>
							)}
							<canvas ref={canvasRef} className="h-full w-full "></canvas>
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
									<Button className="w-full" variant={"outline"} disabled={isPending}>
										<X />
										Close
									</Button>
								</DialogClose>
								<Button className="w-full" type="submit" form={formId} disabled={isPending}>
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
