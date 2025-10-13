"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
	AlarmClock,
	Book,
	BookCheck,
	CalendarIcon,
	Check,
	CircleDashed,
	CircleIcon,
	FlagIcon,
	FlameIcon,
	FormInputIcon,
	HomeIcon,
	Loader2,
	MinusCircleIcon,
	Plus,
	Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { CoursesType } from "@/app/data/user/get-all-courses";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type CreateAssignmentSchemaType,
	createAssignmentSchema,
} from "@/lib/schemas/assignmentSchema";
import { tryCatch } from "@/lib/try-catch";
import { cn } from "@/lib/utils";
import { createAssignment } from "./actions";

const priorityIconMap = {
	low: <MinusCircleIcon className="text-violet-500" />,
	medium: <CircleIcon className="text-cyan-500" />,
	high: <FlagIcon className="text-yellow-500" />,
	urgent: <FlameIcon className="text-destructive" />,
};

const CreateAssignmentDialog = ({ courses }: { courses: CoursesType[] }) => {
	const [pending, startTransition] = useTransition();
	const router = useRouter();
	const formId = useId();
	const [open, setOpen] = useState<boolean>(false);

	const form = useForm<CreateAssignmentSchemaType>({
		resolver: zodResolver(createAssignmentSchema),
		defaultValues: {
			title: "",
			dueDate: undefined,
			priority: "medium",
			status: "todo",
			courseId: "",
			type: "homework",
		},
	});

	const onSubmit = (values: CreateAssignmentSchemaType) => {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(createAssignment(values));

			if (error) {
				toast.error("An unexpected error occurred. Please try again.");
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				setOpen(false);
				form.reset();
				router.refresh();
			} else if (result.status === "error") {
				toast.error(result.message);
			}
		});
	};

	function handleDateSelect(date: Date | undefined, field: "dueDate") {
		if (date) {
			form.setValue(field, date);
		}
	}

	function handleTimeChange(
		type: "hour" | "minute" | "ampm",
		value: string,
		field: "dueDate",
	) {
		const currentDate = form.getValues(field) || new Date();
		const newDate = new Date(currentDate);

		if (type === "hour") {
			const hour = parseInt(value, 10);
			newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
		} else if (type === "minute") {
			newDate.setMinutes(parseInt(value, 10));
		} else if (type === "ampm") {
			const hours = newDate.getHours();
			if (value === "AM" && hours >= 12) {
				newDate.setHours(hours - 12);
			} else if (value === "PM" && hours < 12) {
				newDate.setHours(hours + 12);
			}
		}

		form.setValue(field, newDate);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Form {...form}>
				<form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
					<DialogTrigger asChild>
						<Button variant={"mono"}>
							<Plus />
							Add
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Create Assignment</DialogTitle>
							<DialogDescription>
								Create your assignment here, more information can be added after
								you&apos;ve created it.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 h-full">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Discussion #2"
												disabled={pending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="courseId"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Course</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a course" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{courses.map((c) => (
													<SelectItem key={c.id} value={c.id} className="">
														<div className={`${c.color} rounded-full size-3`} />
														{c.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="dueDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Due</FormLabel>
										<Popover>
											<FormControl>
												<PopoverTrigger asChild>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														{field.value ? (
															format(field.value, "MM/dd/yyyy hh:mm aa")
														) : (
															<span>Enter Due Date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</PopoverTrigger>
											</FormControl>
											<PopoverContent className="w-auto p-0">
												<div className="sm:flex">
													<Calendar
														mode="single"
														selected={field.value as Date}
														onSelect={(date) =>
															handleDateSelect(date, "dueDate")
														}
														initialFocus
													/>
													<div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
														<ScrollArea className="w-64 sm:w-auto">
															<div className="flex sm:flex-col p-2">
																{Array.from({ length: 12 }, (_, i) => i + 1)
																	.reverse()
																	.map((hour) => (
																		<Button
																			key={hour}
																			size="icon"
																			variant={
																				field.value &&
																				field.value.getHours() % 12 ===
																					hour % 12
																					? "mono"
																					: "ghost"
																			}
																			className="sm:w-full shrink-0 aspect-square"
																			onClick={() =>
																				handleTimeChange(
																					"hour",
																					hour.toString(),
																					"dueDate",
																				)
																			}
																		>
																			{hour}
																		</Button>
																	))}
															</div>
															<ScrollBar
																orientation="horizontal"
																className="sm:hidden"
															/>
														</ScrollArea>
														<ScrollArea className="w-64 sm:w-auto h-full">
															<div className="flex sm:flex-col p-2">
																{Array.from({ length: 60 }, (_, i) => i).map(
																	(minute) => (
																		<Button
																			key={minute}
																			size="icon"
																			variant={
																				field.value &&
																				field.value.getMinutes() === minute
																					? "mono"
																					: "ghost"
																			}
																			className="sm:w-full shrink-0 aspect-square"
																			onClick={() =>
																				handleTimeChange(
																					"minute",
																					minute.toString(),
																					"dueDate",
																				)
																			}
																		>
																			{minute.toString().padStart(2, "0")}
																		</Button>
																	),
																)}
															</div>
															<ScrollBar
																orientation="horizontal"
																className="sm:hidden"
															/>
														</ScrollArea>
														<ScrollArea className="h-full">
															<div className="flex sm:flex-col p-2">
																{["AM", "PM"].map((ampm) => (
																	<Button
																		key={ampm}
																		size="icon"
																		variant={
																			field.value &&
																			((ampm === "AM" &&
																				field.value.getHours() < 12) ||
																				(ampm === "PM" &&
																					field.value.getHours() >= 12))
																				? "mono"
																				: "ghost"
																		}
																		className="sm:w-full shrink-0 aspect-square"
																		onClick={() =>
																			handleTimeChange("ampm", ampm, "dueDate")
																		}
																	>
																		{ampm}
																	</Button>
																))}
															</div>
														</ScrollArea>
													</div>
												</div>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex flex-row gap-2">
								<FormField
									control={form.control}
									name="priority"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Priority</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select a priority" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="low">
														{priorityIconMap.low}
														<span className="text-violet-500">Low</span>
													</SelectItem>
													<SelectItem value="medium">
														{priorityIconMap.medium}
														<span className="text-cyan-500">Medium</span>
													</SelectItem>
													<SelectItem value="high">
														{priorityIconMap.high}
														<span className="text-yellow-500">High</span>
													</SelectItem>
													<SelectItem value="urgent">
														{priorityIconMap.urgent}
														<span className="text-destructive">Urgent</span>
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="status"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Status</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select a status" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="todo">
														<Loader2 className="text-cyan-500" />
														<span className="text-cyan-500">Todo</span>
													</SelectItem>
													<SelectItem value="in_progress">
														<AlarmClock className="text-yellow-500" />
														<span className="text-yellow-500">In Progress</span>
													</SelectItem>
													<SelectItem value="completed">
														<Check className="text-green-500" />
														<span className="text-green-500">Completed</span>
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Type</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="homework">
													<HomeIcon className="text-cyan-500" />
													<span className="text-cyan-500">Homework</span>
												</SelectItem>
												<SelectItem value="quiz">
													<FormInputIcon className="text-purple-500" />
													<span className="text-purple-500">Quiz</span>
												</SelectItem>
												<SelectItem value="exam">
													<BookCheck className="text-red-500" />
													<span className="text-red-500">Exam</span>
												</SelectItem>
												<SelectItem value="project">
													<Target className="text-green-500" />
													<span className="text-green-500">Project</span>
												</SelectItem>
												<SelectItem value="reading">
													<Book className="text-amber-500" />
													<span className="text-amber-500">Reading</span>
												</SelectItem>
												<SelectItem value="other">
													<CircleDashed className="text-gray-500" />
													<span className="text-gray-500">Other</span>
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<Button type="submit" form={formId}>
								Create Assignment
							</Button>
						</DialogFooter>
					</DialogContent>
				</form>
			</Form>
		</Dialog>
	);
};

export default CreateAssignmentDialog;
