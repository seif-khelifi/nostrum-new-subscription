"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type PillInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
	className?: string;
	inputClassName?: string;
	onAccessoryClick?: () => void;
	/** When true, applies error ring styling to the pill */
	hasError?: boolean;
};

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

const PillInput = React.forwardRef<HTMLInputElement, PillInputProps>(
	(
		{
			className,
			inputClassName,
			onAccessoryClick,
			value,
			defaultValue,
			placeholder,
			hasError,
			onChange,
			...props
		},
		ref,
	) => {
		/**
		 * Track an internal mirror of the input value so the "filled" styling
		 * works both when the component is:
		 *  - controlled (value prop) → uses value directly
		 *  - uncontrolled / register() (no value prop) → uses internalValue
		 */
		const [internalValue, setInternalValue] = React.useState(
			String(value ?? defaultValue ?? ""),
		);

		// Keep internalValue in sync when controlled value changes
		React.useEffect(() => {
			if (value !== undefined) {
				setInternalValue(String(value));
			}
		}, [value]);

		const filled = Boolean(value !== undefined ? value : internalValue);

		const handleChange = React.useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				setInternalValue(e.target.value);
				onChange?.(e);
			},
			[onChange],
		);

		/* ── hidden sizer: mirrors the visible text to auto-size the wrapper ── */
		const sizerRef = React.useRef<HTMLSpanElement>(null);
		const [inputWidth, setInputWidth] = React.useState<number | undefined>(undefined);

		const displayText = filled
			? String(value !== undefined ? value : internalValue)
			: (placeholder ?? "");

		React.useLayoutEffect(() => {
			if (sizerRef.current) {
				setInputWidth(sizerRef.current.scrollWidth + 8);
			}
		}, [displayText]);

		return (
			<div
				className={cn(
					/* shared layout – same radius in both states */
					"group relative inline-flex h-9 items-center rounded-xl px-0.5",
					"transition-colors duration-200 ease-out",
					/* focus / hover rings */
					"hover:ring-2 hover:ring-primary/10",
					"focus-within:ring-2 focus-within:ring-primary/20",
					/* state colours */
					filled ? "bg-[#490076] text-white" : "bg-[#F3E5FA] text-[#490076]",
					/* error state — red ring */
					hasError && "ring-2 ring-red-500/60 hover:ring-red-500/80 focus-within:ring-red-500/80",
					className,
				)}
			>
				{/* Hidden span used to measure text width */}
				<span
					ref={sizerRef}
					aria-hidden
					className={cn(
						"pointer-events-none invisible absolute left-0 top-0 h-0 overflow-hidden whitespace-pre text-[15px] font-medium",
						inputClassName,
					)}
				>
					{displayText || "\u00A0"}
				</span>

				<input
					ref={ref}
					data-slot="pill-input"
					placeholder={placeholder}
					style={inputWidth ? { width: inputWidth } : undefined}
					className={cn(
						"h-full rounded-xl bg-transparent pl-3 pr-2 text-[15px] font-medium outline-none",
						filled
							? "text-white placeholder:text-white/60"
							: "text-[#490076] placeholder:text-[#490076]/60",
						"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
						"selection:bg-white/30 selection:text-inherit",
						inputClassName,
					)}
					value={value}
					defaultValue={defaultValue}
					onChange={handleChange}
					{...props}
				/>

				<button
					type="button"
					tabIndex={-1}
					aria-label="Options"
					onClick={onAccessoryClick}
					className={cn(
						"ml-1 mr-1 inline-flex h-6 w-3 items-center justify-center rounded-md",
						"transition-colors duration-200 ease-out",
						filled ? "bg-[#D9D9D9] text-[#490076]" : "bg-[#490076] text-white",
						"hover:opacity-90 active:scale-95",
					)}
				>
					<ThreeDotsVertical />
				</button>
			</div>
		);
	},
);

PillInput.displayName = "PillInput";

export { PillInput };
