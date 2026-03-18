"use client";

import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

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

interface PillComboboxProps {
	/** Simple list of string items (used for filtering + display) */
	options: string[];
	/** Currently selected value (controlled) */
	value?: string;
	/** Called when the value changes */
	onValueChange?: (value: string) => void;
	/** Placeholder text when nothing is selected */
	placeholder?: string;
	/** Additional class for the outer wrapper */
	className?: string;
	/** Min-width class for the input */
	inputClassName?: string;
	/** When true, applies error ring styling */
	hasError?: boolean;
}

export function PillCombobox({
	options,
	value,
	onValueChange,
	placeholder = "Sélectionner…",
	className,
	inputClassName,
	hasError,
}: PillComboboxProps) {
	const filled = Boolean(value);

	const handleValueChange = (val: string | null) => {
		onValueChange?.(val ?? "");
	};

	return (
		<ComboboxPrimitive.Root
			value={value}
			onValueChange={handleValueChange}
			items={options}
		>
			<div
				className={cn(
					/* shared layout – same radius & height as PillInput */
					"group/pill-combo relative inline-flex h-9 items-center rounded-xl px-0.5",
					"transition-colors duration-200 ease-out",
					/* focus / hover rings */
					"hover:ring-2 hover:ring-primary/10",
					"focus-within:ring-2 focus-within:ring-primary/20",
					/* state colours – same as PillInput */
					filled ? "bg-[#490076] text-white" : "bg-[#F3E5FA] text-[#490076]",
					/* error state — red ring */
					hasError && "ring-2 ring-red-500/60 hover:ring-red-500/80 focus-within:ring-red-500/80",
					className,
				)}
			>
				<ComboboxPrimitive.Input
						placeholder={placeholder}
						className={cn(
							"h-full w-0 min-w-0 flex-1 rounded-xl bg-transparent pl-3 pr-2 text-[15px] font-medium outline-none",
							filled
								? "text-white placeholder:text-white/60"
								: "text-[#490076] placeholder:text-[#490076]/60",
							"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
							"selection:bg-white/30 selection:text-inherit",
							inputClassName,
						)}
					/>

				<ComboboxPrimitive.Trigger
					className={cn(
						"ml-1 mr-1 inline-flex h-6 w-3 shrink-0 items-center justify-center rounded-md",
						"transition-colors duration-200 ease-out cursor-pointer",
						filled ? "bg-[#D9D9D9] text-[#490076]" : "bg-[#490076] text-white",
						"hover:opacity-90 active:scale-95",
					)}
				>
					<ThreeDotsVertical />
				</ComboboxPrimitive.Trigger>
			</div>

			<ComboboxPrimitive.Portal>
				<ComboboxPrimitive.Positioner
					side="bottom"
					sideOffset={6}
					align="start"
					className="isolate z-50"
				>
					<ComboboxPrimitive.Popup
						className="max-h-60 min-w-[180px] origin-(--transform-origin) overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-foreground/10 duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
					>
						<ComboboxPrimitive.List
							className="no-scrollbar max-h-60 scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0"
						>
							{(item: string) => (
								<ComboboxPrimitive.Item
									key={item}
									value={item}
									className="relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm text-[#1D1B20] outline-hidden select-none data-highlighted:bg-[#F3E5FA] data-highlighted:text-[#490076]"
								>
									{item}
									<ComboboxPrimitive.ItemIndicator
										render={
											<span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
										}
									>
										<CheckIcon className="size-4 text-[#490076]" />
									</ComboboxPrimitive.ItemIndicator>
								</ComboboxPrimitive.Item>
							)}
						</ComboboxPrimitive.List>

						<ComboboxPrimitive.Empty
							className="flex w-full justify-center py-2 text-center text-sm text-[#490076]/60"
						>
							Aucun résultat
						</ComboboxPrimitive.Empty>
					</ComboboxPrimitive.Popup>
				</ComboboxPrimitive.Positioner>
			</ComboboxPrimitive.Portal>
		</ComboboxPrimitive.Root>
	);
}
