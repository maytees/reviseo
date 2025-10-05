import { zodResolver } from "@hookform/resolvers/zod";
import { Bug, Send, X } from "lucide-react";
import { useId } from "react";
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

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<Dialog>
			<DialogTrigger className="absolute z-[9998] bottom-4 right-4" asChild>
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
						showCloseButton={false}
						variant={"fullscreen"}
						className="flex flex-row gap-2 z-[9999]"
					>
						<Card className="w-full h-full py-0">
							<canvas className="h-full w-full bg-black"></canvas>
						</Card>
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
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</CardContent>
							<CardFooter className="gap-2 flex-col">
								<DialogClose asChild>
									<Button className="w-full" variant={"outline"}>
										<X />
										Close
									</Button>
								</DialogClose>
								<Button className="w-full" type="submit" form={formId}>
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
