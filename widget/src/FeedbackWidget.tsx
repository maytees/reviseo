import { Field, Form } from "@base-ui-components/react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Bug, Send } from "lucide-preact";
import { domToSvg } from "modern-screenshot";
import { useEffect, useId, useState } from "preact/hooks";
import { Button } from "./components/Button";
import ExCanvas from "./ExCanvas";
import { type LogEntry, useConsoleLogger } from "./hooks/useConsoleLogger";
import { type NetworkLog, useNetworkLogger } from "./hooks/useNetworkLogger";

type DataType = {
	image?: string;
	consoleLogs: LogEntry[];
	networkLogs: NetworkLog[];
	url?: string;
	viewport?: string;
	agent?: string;
};

const DEBUG = false;

async function submitForm(
	title: string,
	data: DataType,
	description?: string,
): Promise<{ success: boolean; error?: string }> {
	// Mimic a server response
	await new Promise((resolve) => {
		setTimeout(resolve, 1000);
	});

	if (DEBUG) {
		console.info(`Title: ${title}
	Description: ${description}
	Viewport: ${data.viewport}
	Url: ${data.url}
	Agent: ${data.agent}`);

		console.info("\nConsole Logs:");
		if (data.consoleLogs.length === 0) {
			console.info("No Logs");
		} else {
			console.dir(data.consoleLogs, { depth: null });
		}

		console.info("\nNetwork Logs:");
		if (data.networkLogs.length === 0) {
			console.info("No Logs");
		} else {
			console.dir(data.networkLogs, { depth: null });
		}
	}

	return { success: true };
}

export function FeedbackWidget({
	portalContainer,
}: {
	portalContainer: HTMLElement;
}) {
	const [open, setOpen] = useState<boolean>(false);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<DataType>({
		consoleLogs: [],
		networkLogs: [],
	});

	const popupId = useId();
	const formId = useId();
	const triggerId = useId();

	const { getLogs, clearLogs } = useConsoleLogger();
	const networkLogs = useNetworkLogger();

	const blacklist = [popupId, formId, triggerId, "feedback-widget-root"];

	useEffect(() => {
		if (!open) return;

		const captureScreenshot = async () => {
			domToSvg(window.document.body, {
				filter: (e: HTMLElement) => {
					return !blacklist.includes(e.id);
				},
			}).then((dataUrl) => {
				setData({
					image: dataUrl,
					consoleLogs: getLogs(),
					networkLogs: networkLogs,
					url: window.location.href,
					viewport: `${window.innerWidth}x${window.innerHeight}`,
					agent: navigator.userAgent,
				});
			});
		};

		setLoading(true);
		captureScreenshot().finally(() => setLoading(false));
	}, [open]);

	return (
		<Dialog.Root onOpenChange={setOpen} open={open}>
			<Dialog.Trigger
				id={triggerId}
				className={
					"p-4 bg-background red-509 border-border border fixed bottom-5 right-5 rounded-full hover:cursor-pointer"
				}
			>
				<Bug className={"text-foreground"} />
			</Dialog.Trigger>
			<Dialog.Portal container={portalContainer}>
				<Dialog.Popup
					id={popupId}
					className="fixed border border-border bg-background top-1/2 left-1/2 w-[calc(100vw-3vw)] h-[calc(100dvh-3dvh)] -translate-x-1/2 -translate-y-1/2 rounded-lg p-6"
				>
					<Form
						id={formId}
						errors={errors}
						onClearErrors={setErrors}
						className={"h-full"}
						onSubmit={async (event) => {
							event.preventDefault();
							const formData = new FormData(event.currentTarget);
							const title = formData.get("title") as string;
							const description = formData.get("description") as
								| string
								| undefined;

							setLoading(true);

							const response = await submitForm(title, data, description);

							setErrors(response.error);
							setLoading(false);

							if (response.success) setOpen(false);
						}}
					>
						<div className="flex w-full h-full gap-4">
							<div className="flex flex-row w-full h-full gap-2">
								<div
									className={
										"border-1 inset-0 h-full  w-8/12  border-border rounded-lg"
									}
								>
									<ExCanvas pending={loading} imageUrl={data.image} />
								</div>
								<div
									className={
										"w-4/12 h-full border-1 border-border p-4 flex flex-col space-y-6 rounded-xl overflow-y-auto"
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
											type="text"
											required
											placeholder="Basic tasks overview"
											maxlength={100}
											disabled={loading}
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
											type="text"
											disabled={loading}
											placeholder="Optional - Longer form instructions; explain the annotations to the developer(s)."
											className="flex-1 text-foreground resize-none placeholder:text-muted-foreground hover:border-ring/70 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/50 aria-invalid:border-destructive bg-input flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 md:text-sm"
											maxlength={1000}
											render={(props) => <textarea {...props} />}
										/>
										<Field.Error className="text-sm text-destructive" />
									</Field.Root>
									<div className={"mt-auto flex flex-col gap-2 w-full"}>
										<Button
											onClick={() => setOpen(false)}
											disabled={loading}
											className={"w-full"}
											variant="outline"
										>
											Close
										</Button>
										<Button disabled={loading} className={"w-full"}>
											<Send />
											Send Feedback
										</Button>
									</div>
								</div>
							</div>
						</div>
					</Form>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
