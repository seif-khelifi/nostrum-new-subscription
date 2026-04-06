"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type SidebarStepperState = "collapsed" | "expanded";
export type SidebarStepperTheme = "default" | "purple";

export type SidebarStepItem = {
	id: number;
	label: string;
	icon: React.ReactNode;
	disabled?: boolean;
};

const stepperVariants = cva(
	"inline-flex flex-col rounded-[28px] transition-all duration-200 ease-out",
	{
		variants: {
			sidebarState: {
				collapsed: "w-full items-center gap-2 p-2.5",
				expanded: "w-full max-w-[260px] gap-3 p-3",
			},
			theme: {
				default: "bg-[#E9E6DF]",
				purple: "bg-[#490076]",
			},
		},
		defaultVariants: {
			sidebarState: "expanded",
			theme: "default",
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
				true: "",
				false: "",
			},
			theme: {
				default: "",
				purple: "",
			},
		},
		compoundVariants: [
			/* ── Default theme ── */
			{ theme: "default", active: true, className: "bg-[#1D1B20] text-white shadow-sm" },
			{ theme: "default", active: false, className: "bg-[#F6F4F0] text-[#444444]" },
			/* ── Purple theme (variant A) ── */
			{ theme: "purple", active: true, className: "bg-[#E0B1FF] text-[#490076] shadow-sm" },
			{ theme: "purple", active: false, className: "bg-[#38005B] text-[#E0B1FF]" },
		],
		defaultVariants: {
			sidebarState: "expanded",
			active: false,
			theme: "default",
		},
	},
);

/** Resolve inner pill classes based on theme + active state */
function pillClasses(theme: SidebarStepperTheme, active: boolean) {
	if (theme === "purple") {
		return active
			? "bg-[#F6F4F0] text-[#490076]"
			: "bg-[#490076] text-[#E0B1FF]";
	}
	// default theme
	return active ? "bg-white/10 text-white" : "bg-white text-[#444444]";
}

/** Resolve step number color based on theme + active state */
function numberClasses(theme: SidebarStepperTheme, active: boolean) {
	if (theme === "purple") {
		return active ? "text-[#490076]" : "text-[#E0B1FF]";
	}
	return "";
}

export type SidebarStepperProps = {
	items: SidebarStepItem[];
	value: number;
	onValueChange: (value: number) => void;
	sidebarState?: SidebarStepperState;
	theme?: SidebarStepperTheme;
	className?: string;
} & VariantProps<typeof stepperVariants>;

function SidebarStepper({
	items,
	value,
	onValueChange,
	sidebarState = "expanded",
	theme = "default",
	className,
}: SidebarStepperProps) {
	return (
		<div
			data-slot="sidebar-stepper"
			data-sidebar-state={sidebarState}
			data-theme={theme}
			className={cn(stepperVariants({ sidebarState, theme }), className)}
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
						className={cn(itemVariants({ sidebarState, active, theme }))}
					>
						{/* Inner pill with icon + step number */}
						<span
							className={cn(
								"inline-flex items-center justify-center rounded-xl font-medium transition-colors",
								sidebarState === "collapsed"
									? "h-8 min-w-8 gap-1.5 px-1.5 text-xs"
									: "h-9 min-w-9 gap-2 px-2 text-sm",
								pillClasses(theme, active),
							)}
						>
							{item.icon}
							<span className={cn("font-bold leading-none", numberClasses(theme, active))}>
								{item.id}
							</span>
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
