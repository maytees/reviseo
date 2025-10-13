"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	type Dispatch,
	type SetStateAction,
	useId,
	useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	type DeleteCourseSchemaType,
	deleteCourseSchema,
} from "@/lib/schemas/courseSchema";
import { tryCatch } from "@/lib/try-catch";
import { deleteCourse } from "../actions";

interface DeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	id: string;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

const DeleteCourseDialog = ({
	open,
	onOpenChange,
	title,
	id,
	setOpen,
}: DeleteDialogProps) => {
	const [pending, startTransition] = useTransition();
	const formId = useId();
	const router = useRouter();

	const form = useForm<DeleteCourseSchemaType>({
		resolver: zodResolver(deleteCourseSchema),
		defaultValues: {
			name: "",
		},
	});

	const name = form.watch("name");

	function onSubmit(values: DeleteCourseSchemaType) {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(deleteCourse(id, values));

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
	}

	// const onError = (errors) => {
	// 	console.log(`${JSON.stringify(errors)} are errors`);
	// };

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<div className="flex flex-col items-center gap-2">
					<div
						className="flex items-center justify-center border rounded-full border-destructive size-9 shrink-0"
						aria-hidden="true"
					>
						<CircleAlertIcon
							className="opacity-80 text-destructive"
							size={16}
						/>
					</div>
					<DialogHeader>
						<DialogTitle className="sm:text-center">Are you sure?</DialogTitle>
						<DialogDescription className="sm:text-center">
							This action cannot be undone. To confirm, please enter the course
							name. You should archive a course instead of deleting it!
						</DialogDescription>
						<code className="p-1 text-sm text-center rounded-lg text-foreground ">
							{title}
						</code>
					</DialogHeader>
				</div>

				<Form {...form}>
					<form
						id={formId}
						className="space-y-6"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<div className="*:not-first:mt-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Course Name</FormLabel>
										<FormControl>
											<Input
												disabled={pending}
												{...field}
												type="text"
												placeholder={`Type '${title}' to confirm`}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="max-sm:gap-3">
							<DialogClose asChild>
								<Button
									disabled={pending}
									type="button"
									variant="outline"
									className="md:flex-1"
								>
									Cancel
								</Button>
							</DialogClose>
							<Button
								form={formId}
								type="submit"
								className="md:flex-1"
								variant={"destructive"}
								disabled={name !== title || pending}
							>
								Delete
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteCourseDialog;
