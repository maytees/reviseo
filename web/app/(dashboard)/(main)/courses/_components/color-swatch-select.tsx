"use client";
import type { UseFormReturn } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CourseSchemaType } from "@/lib/schemas/courseSchema";

export default function ColorSelectSwatch({
	form,
}: {
	form: UseFormReturn<CourseSchemaType>;
}) {
	return (
		<div className="*:not-first:mt-2">
			<FormField
				control={form.control}
				name="color"
				render={({ field }) => (
					<FormItem className="space-y-1">
						<FormLabel>Course Color</FormLabel>
						<FormControl>
							<fieldset className="space-y-4">
								<RadioGroup
									className="flex gap-1.5"
									defaultValue={field.value}
									onValueChange={field.onChange}
								>
									<RadioGroupItem
										value="bg-red-400"
										aria-label="Red"
										className="size-6 border-red-400 bg-red-400 border-4 shadow-none  [&>div]:bg-red-400"
									/>
									<RadioGroupItem
										value="bg-orange-400"
										aria-label="Orange"
										className="size-6 border-4 border-orange-400 bg-orange-400 shadow-none  [&>div]:bg-orange-400"
									/>
									<RadioGroupItem
										value="bg-amber-400"
										aria-label="Amber"
										className="size-6 border-4 border-amber-400 bg-amber-400 shadow-none  [&>div]:bg-amber-400"
									/>
									<RadioGroupItem
										value="bg-lime-400"
										aria-label="Lime"
										className="size-6 border-4 border-lime-400 bg-lime-400 shadow-none  [&>div]:bg-lime-400"
									/>
									<RadioGroupItem
										value="bg-emerald-400"
										aria-label="Emerald"
										className="size-6 border-4 border-emerald-400 bg-emerald-400 shadow-none  [&>div]:bg-emerald-400"
									/>
									<RadioGroupItem
										value="bg-blue-400"
										aria-label="Blue"
										className="size-6 border-4 border-blue-400 bg-blue-400 shadow-none  [&>div]:bg-blue-400"
									/>
									<RadioGroupItem
										value="bg-indigo-400"
										aria-label="Indigo"
										className="size-6 border-4 border-indigo-400 bg-indigo-400 shadow-none  [&>div]:bg-indigo-400"
									/>
									<RadioGroupItem
										value="bg-violet-400"
										aria-label="Violet"
										className="size-6 border-4 border-violet-400 bg-violet-400 shadow-none  [&>div]:bg-violet-400"
									/>
								</RadioGroup>
							</fieldset>
						</FormControl>
					</FormItem>
				)}
			/>
		</div>
	);
}
