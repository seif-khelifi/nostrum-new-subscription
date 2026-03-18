"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

/* ─── Props ─── */

export interface SearchInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
	/** Extra class names for the outer wrapper */
	wrapperClassName?: string;
	/** Called when the search icon / button is clicked */
	onSearch?: () => void;
}

/* ─── Component ─── */

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
	({ className, wrapperClassName, onSearch, ...props }, ref) => {
		return (
			<div
				data-slot="search-input"
				className={cn(
					/* layout */
					"flex w-full items-center overflow-hidden rounded-xl",
					/* focus-within ring to mimic shadcn Input focus style */
					"focus-within:ring-[3px] focus-within:ring-[#490076]/20",
					"transition-shadow duration-200 ease-out",
					wrapperClassName,
				)}
			>
				<input
					ref={ref}
					type="text"
					className={cn(
						/* sizing & shape */
						"flex-1 h-12 px-4",
						"rounded-none rounded-l-xl",
						/* colours — matches the unfilled pill style */
						"bg-[#F3E5FA] text-[#490076]",
						"placeholder:text-[#490076]/50",
						/* typography */
						"text-[15px] font-medium",
						/* reset */
						"border-0 shadow-none outline-none",
						"focus-visible:ring-0",
						/* disabled */
						"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					{...props}
				/>

				<button
					type="button"
					tabIndex={-1}
					aria-label="Rechercher"
					onClick={onSearch}
					className={cn(
						/* sizing & shape */
						"h-12 w-12 shrink-0",
						"rounded-none rounded-r-xl",
						/* colours — solid purple like ctaPurple */
						"bg-[#490076] text-white",
						/* interaction */
						"inline-flex items-center justify-center",
						"hover:bg-[#5a0a8f]",
						"active:translate-y-px",
						"transition-colors duration-200 ease-out",
						"outline-none",
					)}
				>
					<Search className="size-5" />
				</button>
			</div>
		);
	},
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
