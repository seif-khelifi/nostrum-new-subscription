"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type SidebarStepperState = "collapsed" | "expanded";

export type SidebarStepItem = {
	id: number;
	label: string;
	icon: React.ReactNode;
	disabled?: boolean;
};

const stepperVariants = cva(
	"inline-flex flex-col rounded-[28px] bg-[#E9E6DF] transition-all duration-200 ease-out",
	{
		variants: {
			sidebarState: {
				collapsed: "w-full items-center gap-2 p-2.5",
				expanded: "w-full max-w-[260px] gap-3 p-3",
			},
		},
		defaultVariants: {
			sidebarState: "expanded",
		},
	},
);

const itemVariants = cva(
	"group relative inline-flex w-full cursor-pointer items-center rounded-[16px] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			sidebarState: {
				collapsed: "h-[52px] justify-center px-0",
				expanded: "h-[52px] justify-start gap-2.5 px-3",
			},
			active: {
				true: "bg-[#1D1B20] text-white shadow-sm",
				false: "bg-[#F6F4F0] text-[#444444]",
			},
		},
		defaultVariants: {
			sidebarState: "expanded",
			active: false,
		},
	},
);

export type SidebarStepperProps = {
	items: SidebarStepItem[];
	value: number;
	onValueChange: (value: number) => void;
	sidebarState?: SidebarStepperState;
	className?: string;
} & VariantProps<typeof stepperVariants>;

function SidebarStepper({
	items,
	value,
	onValueChange,
	sidebarState = "expanded",
	className,
}: SidebarStepperProps) {
	return (
		<div
			data-slot="sidebar-stepper"
			data-sidebar-state={sidebarState}
			className={cn(stepperVariants({ sidebarState }), className)}
		>
			{items.map((item) => {
				const active = item.id === value;

				return (
					<button
						key={item.id}
						type="button"
						data-slot="sidebar-stepper-item"
						data-state={active ? "active" : "inactive"}
						disabled={item.disabled}
						onClick={() => onValueChange(item.id)}
						className={cn(itemVariants({ sidebarState, active }))}
					>
						{/* Inner pill with icon + step number */}
						<span
							className={cn(
								"inline-flex items-center justify-center rounded-xl font-medium transition-colors",
								sidebarState === "collapsed"
									? "h-8 min-w-8 gap-1.5 px-1.5 text-xs"
									: "h-9 min-w-9 gap-2 px-2 text-sm",
								active
									? "bg-white/10 text-white"
									: "bg-white text-[#444444]",
							)}
						>
							{item.icon}
							<span className="font-bold leading-none">{item.id}</span>
						</span>

						{/* Label text — hidden in collapsed via width/opacity animation */}
						<span
							className={cn(
								"truncate font-semibold leading-none transition-all duration-200 ease-out",
								sidebarState === "collapsed"
									? "w-0 overflow-hidden opacity-0 text-xs"
									: "w-auto opacity-100 text-sm",
							)}
						>
							{item.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}

export { SidebarStepper };
