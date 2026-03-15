"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
	size?: "sm" | "default";
	variant?: "purple" | "gradient";
};

function Switch({ className, variant = "purple", size = "sm", ...props }: SwitchProps) {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			data-variant={variant}
			className={cn(
				"peer group/switch relative inline-flex shrink-0 items-center overflow-hidden",
				"h-8 w-[64px] p-[3px]",
				"rounded-[14px] border-0 outline-none transition-all",
				"focus-visible:ring-3 focus-visible:ring-ring/50",
				"data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				variant === "purple" && "data-[state=checked]:bg-primary",
				variant === "gradient" &&
					"data-[state=checked]:bg-[radial-gradient(173.95%_608.83%_at_8.7%_100%,#FBF4EA_0%,#FEA8CD_34.13%,#CE99FF_62.98%,#9000E3_80.77%,#490076_100%)]",
				className,
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					"pointer-events-none block shrink-0",
					"h-[26px] w-[26px] rounded-[10px]",
					"bg-white ring-0 shadow-sm",
					"transition-transform duration-200 ease-out",
					"translate-x-0",
					"group-data-[state=checked]/switch:translate-x-8",
				)}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
