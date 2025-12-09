"use client";

import { Button } from "@/components/ui-custom/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui-custom/popover";
import { cn } from "@/lib/utils";
import { parseDate } from "chrono-node";
import { ChevronDownIcon } from "lucide-react";
import { ComponentProps, useState } from "react";
import type { Matcher } from "react-day-picker";
import { Calendar } from "./calendar";

interface IDateInput extends Omit<ComponentProps<"button">, "disabled"> {
	buttonText?: string;
	id?: string;
	defaultDate?: Date;
	disabled?: Matcher | Matcher[];
	buttonDisabled?: boolean;
	className?: string;
	startMonth?: Date;
	endMonth?: Date;
	onDateChange?: (date: Date | undefined) => void;
}

export function DateInput({
	className,
	buttonText,
	id,
	defaultDate,
	disabled,
	buttonDisabled,
	startMonth,
	endMonth,
	onDateChange,
	...props
}: IDateInput) {
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState<Date | undefined>(defaultDate);

	const parsedDate = date && parseDate(date.toLocaleDateString())?.toLocaleDateString();

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					className={cn(className, "justify-between hover:scale-100")}
					variant="outline"
					id={id}
					disabled={buttonDisabled}
					{...props}
				>
					{date ? parsedDate : buttonText}
					<ChevronDownIcon />
				</Button>
			</PopoverTrigger>

			<PopoverContent>
				<Calendar
					id={id}
					className="w-full h-[350px]"
					mode="single"
					selected={date}
					captionLayout="dropdown"
					onSelect={(date) => {
						setDate(date);
						setOpen(false);

						if (onDateChange) {
							onDateChange(date);
						}
					}}
					disabled={disabled}
					startMonth={startMonth}
					endMonth={endMonth}
				/>
			</PopoverContent>
		</Popover>
	);
}
