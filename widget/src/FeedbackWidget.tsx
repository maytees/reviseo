import { Field, Form } from "@base-ui-components/react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Bug, Send } from "lucide-preact";
import { useState } from "preact/hooks";
import { Button } from "./components/Button";
import { Textarea } from "./components/Textarea";

async function submitForm(title: string, description?: string) {
	// Mimic a server response
	await new Promise((resolve) => {
		setTimeout(resolve, 1000);
	});

	return { success: true };
}

export function FeedbackWidget() {
	const [open, setOpen] = useState<boolean>(false);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	return (
		<Dialog.Root onOpenChange={setOpen} open={open}>
			<Dialog.Trigger
				className={
					"p-4 absolute bottom-5 right-5 bg-background rounded-full hover:cursor-pointer"
				}
			>
				<Bug className={"text-foreground"} />
			</Dialog.Trigger>
			<Dialog.Portal>
				<Form
					errors={errors}
					onClearErrors={setErrors}
					// onSubmit={async (event) => {
					// 	event.preventDefault();
					// 	const formData = new FormData(event.currentTarget);
					// 	const title = formData.get("title") as string;
					// 	const description = formData.get("description") as
					// 		| string
					// 		| undefined;

					// 	setLoading(true);
					// 	const response = await submitForm(title, description);
					// 	const serverErrors = {
					// 		url: response.error,
					// 	};

					// 	setErrors(serverErrors);
					// 	setLoading(false);
					// }}
				>
					<Dialog.Popup className="fixed top-1/2 left-1/2 outline  w-[calc(100vw-3vw)] h-[calc(100dvh-3dvh)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-card p-6 transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0">
						<div className="flex justify-end h-full w-full mt-auto gap-4">
							<div className="flex w-full h-full flex-row gap-2">
								<div
									className={"w-full h-full border-1 border-border rounded-xl"}
								></div>
								<div
									className={
										"w-4/12 h-full border-1 border-border p-4 flex flex-col space-y-6 rounded-xl"
									}
								>
									<div>
										<h1
											className={
												"text-foreground focus:text-accent-foreground text-lg font-semibold"
											}
										>
											Provide Feedback
										</h1>
										<p className={"text-muted-foreground text-sm"}>
											Provide explanations for your annotations, this will help
											the developer better fix/improve the site.
										</p>
									</div>
									<Field.Root
										name="title"
										className="flex flex-col items-start gap-1"
									>
										<Field.Label className="text-sm font-medium text-card-foreground">
											Title
										</Field.Label>
										<Field.Control
											type="name"
											required
											placeholder="Basic tasks overview"
											maxlength={100}
											className="h-10 w-full bg-input rounded-md border border-input pl-3.5 text-base text-foreground focus:outline-2 focus:-outline-offset-1 focus:outline-blue-100"
										/>
										<Field.Error className="text-sm text-destructive" />
									</Field.Root>

									<Field.Root
										name="description"
										className="flex flex-col items-start gap-1 grow"
									>
										<Field.Label className="text-sm font-medium text-card-foreground">
											Description
										</Field.Label>
										<Field.Control
											type="description"
											className="w-full flex-1 rounded-md border border-input pl-3.5 text-base text-foreground focus:outline-2 focus:-outline-offset-1 focus:outline-blue-100"
											render={() => (
												<Textarea
													placeholder="Optional - Longer form instructions; explain the annotations to the developer(s)."
													className={"flex-1 resize-none"}
													maxlength={1_000}
												/>
											)}
										/>
										<Field.Error className="text-sm text-destructive" />
									</Field.Root>

									<div className={"mt-auto flex flex-col gap-2 w-full"}>
										<Dialog.Close>
											<Button className={"w-full"} variant="outline">
												Close
											</Button>
										</Dialog.Close>
										<Button className={"w-full"}>
											<Send />
											Send Feedback
										</Button>
									</div>
								</div>
							</div>
						</div>
					</Dialog.Popup>
				</Form>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
