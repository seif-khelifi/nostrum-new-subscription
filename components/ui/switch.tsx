"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
	size?: "compact" | "sm" | "default";
	variant?: "purple" | "gradient";
};

function Switch({ className, variant = "purple", size = "sm", ...props }: SwitchProps) {
	const isCompact = size === "compact";

	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			data-variant={variant}
			className={cn(
				"peer group/switch relative inline-flex shrink-0 items-center overflow-hidden",
				"border-0 outline-none transition-all",
				"focus-visible:ring-3 focus-visible:ring-ring/50",
				"data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				variant === "purple" && "data-[state=checked]:bg-primary",
				variant === "gradient" &&
					"data-[state=checked]:bg-[radial-gradient(173.95%_608.83%_at_8.7%_100%,#FBF4EA_0%,#FEA8CD_34.13%,#CE99FF_62.98%,#9000E3_80.77%,#490076_100%)]",
				isCompact
					? "h-6 w-[48px] p-[2px] rounded-[10px]"
					: "h-8 w-[64px] p-[3px] rounded-[14px]",
				className,
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					"pointer-events-none block shrink-0",
					"bg-white ring-0 shadow-sm",
					"transition-transform duration-200 ease-out",
					"translate-x-0",
					isCompact
						? "h-[20px] w-[20px] rounded-[8px] group-data-[state=checked]/switch:translate-x-6"
						: "h-[26px] w-[26px] rounded-[10px] group-data-[state=checked]/switch:translate-x-8",
				)}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
