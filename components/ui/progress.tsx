"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Progress({
	className,
	indicatorClassName,
	indicatorStyle,
	value,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
	indicatorClassName?: string;
	indicatorStyle?: React.CSSProperties;
}) {
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={cn(
				"relative h-1.5 w-full overflow-hidden rounded-full bg-[#CE99FF]/40",
				className,
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				data-slot="progress-indicator"
				className={cn(
					"h-full w-full bg-[#490076] transition-transform duration-300 ease-out",
					indicatorClassName,
				)}
				style={{
					transform: `translateX(-${100 - (value ?? 0)}%)`,
					...indicatorStyle,
				}}
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress };
