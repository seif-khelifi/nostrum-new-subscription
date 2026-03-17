"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { fr } from "date-fns/locale";

/* ── tiny three-dot icon (vertical) ── */
function ThreeDotsVertical({ className }: { className?: string }) {
	return (
		<span className={cn("flex flex-col items-center justify-center gap-[2px]", className)}>
			<span className="size-[2.5px] rounded-full bg-current" />
			<span className="size-[2.5px] rounded-full bg-current" />
			<span className="size-[2.5px] rounded-full bg-current" />
		</span>
	);
}

interface PillDatePickerProps {
	/** Currently selected Date (or undefined) */
	value?: Date;
	/** Called when a date is selected */
	onChange?: (date: Date | undefined) => void;
	/** Placeholder text when no date selected */
	placeholder?: string;
	/** Additional class for the trigger wrapper */
	className?: string;
	/** min width class for the button */
	inputClassName?: string;
	/** When true, applies error ring styling */
	hasError?: boolean;
	/** Start year for the dropdown */
	fromYear?: number;
	/** End year for the dropdown */
	toYear?: number;
}

export function PillDatePicker({
	value,
	onChange,
	placeholder = "JJ/MM/AAAA",
	className,
	inputClassName,
	hasError,
	fromYear,
	toYear,
}: PillDatePickerProps) {
	const [open, setOpen] = React.useState(false);
	const filled = Boolean(value);

	const displayText = value
		? value.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
		: "";

	// Compute year bounds: default to age 19–95
	const now = new Date();
	const startYear = fromYear ?? now.getFullYear() - 95;
	const endYear = toYear ?? now.getFullYear() - 19;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						/* shared layout – same radius in both states */
						"group relative inline-flex h-9 items-center rounded-xl px-0.5",
						"transition-colors duration-200 ease-out cursor-pointer",
						/* focus / hover rings */
						"hover:ring-2 hover:ring-primary/10",
						"focus:ring-2 focus:ring-primary/20 focus:outline-none",
						/* state colours */
						filled ? "bg-[#490076] text-white" : "bg-[#F3E5FA] text-[#490076]",
						/* error state — red ring */
						hasError && "ring-2 ring-red-500/60 hover:ring-red-500/80 focus:ring-red-500/80",
						className,
					)}
				>
					<span
						className={cn(
							"h-full flex items-center rounded-xl bg-transparent pl-3 pr-2 text-[15px] font-medium",
							filled
								? "text-white"
								: "text-[#490076]/60",
							inputClassName,
						)}
					>
						{displayText || placeholder}
					</span>

					<span
						className={cn(
							"ml-1 mr-1 inline-flex h-6 w-3 items-center justify-center rounded-md",
							"transition-colors duration-200 ease-out",
							filled ? "bg-[#D9D9D9] text-[#490076]" : "bg-[#490076] text-white",
						)}
					>
						<ThreeDotsVertical />
					</span>
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-auto overflow-hidden p-0" align="start">
				<Calendar
					mode="single"
					locale={fr}
					selected={value}
					defaultMonth={value ?? new Date(endYear, 0)}
					captionLayout="dropdown"
					startMonth={new Date(startYear, 0)}
					endMonth={new Date(endYear, 11)}
					onSelect={(date) => {
						onChange?.(date);
						setOpen(false);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}
