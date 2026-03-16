import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
	[
		"flex w-full min-w-0 transition-all duration-200 ease-out",
		"outline-none",
		"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
		"placeholder:text-muted-foreground",
		"file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
	].join(" "),
	{
		variants: {
			variant: {
				default: [
					"h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs",
					"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
					"md:text-sm",
				].join(" "),
				pillPurple: [
					"h-12 rounded-[14px] border bg-white px-4 text-[18px] font-semibold",
					"border-[#490076] text-[#490076]",
					"shadow-sm",
					"hover:bg-[#fcfaff] hover:border-[#5d0b92]",
					"focus-visible:border-[#490076]",
					"focus-visible:ring-[3px] focus-visible:ring-[#490076]/20",
					"active:scale-[0.995]",
				].join(" "),
			},
			inputSize: {
				default: "",
				sm: "h-10 px-3 text-base",
				lg: "h-14 px-5 text-[20px]",
			},
		},
		defaultVariants: {
			variant: "default",
			inputSize: "default",
		},
	},
);

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, variant, inputSize, ...props }, ref) => {
		return (
			<input
				ref={ref}
				type={type}
				data-slot="input"
				className={cn(inputVariants({ variant, inputSize }), className)}
				{...props}
			/>
		);
	},
);

Input.displayName = "Input";

export { Input, inputVariants };
