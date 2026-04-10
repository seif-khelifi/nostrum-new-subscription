"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { SidebarStepper } from "@/components/ui/sidebar-stepper";
import { useStepper } from "@/context/StepperContext";

const stepItems = [
	{
		id: 2,
		label: "Situation",
		icon: (
			<Image
				src="/navbarMobile/illustration=Info.svg"
				alt=""
				width={16}
				height={16}
				className="h-4 w-4 shrink-0 object-contain"
				unoptimized
			/>
		),
	},
	{
		id: 3,
		label: "Santé",
		icon: (
			<Image
				src="/navbarMobile/illustration=Sante.svg"
				alt=""
				width={16}
				height={16}
				className="h-4 w-4 shrink-0 object-contain"
				unoptimized
			/>
		),
	},
	{
		id: 5,
		label: "Devis",
		icon: (
			<Image
				src="/navbarMobile/illustration=Coin.svg"
				alt=""
				width={16}
				height={16}
				className="h-4 w-4 shrink-0 object-contain"
				unoptimized
			/>
		),
	},
	{
		id: 6,
		label: "Souscription",
		icon: (
			<Image
				src="/navbarMobile/illustration=Ordonnance.svg"
				alt=""
				width={16}
				height={16}
				className="h-4 w-4 shrink-0 object-contain"
				unoptimized
			/>
		),
	},
];

/**
 * Variant A — purple left sidebar.
 *
 * - < sm:  hidden (mobile shell takes over)
 * - sm → lg: collapsed (~120px, icon-only stepper)
 * - lg+: full width (16rem, expanded stepper)
 *
 * Self-contained: owns its theme, colors, and logo treatment.
 * When variant A is removed, delete this file.
 */
export function SidebarVariantA({ className }: { className?: string }) {
	const { sidebarGroupId, goToGroup } = useStepper();

	return (
		<aside
			className={cn(
				/* base */
				"fixed top-0 left-0 bottom-0 z-40 overflow-hidden bg-background border-r border-[#E9E6DF]",
				/* width transition */
				"transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
				/* responsive visibility & width */
				"hidden sm:flex sm:flex-col sm:w-[120px] lg:w-64",
				className,
			)}
		>
			{/* Logo */}
			<div className="flex items-center justify-center h-16 shrink-0 whitespace-nowrap overflow-hidden mt-4 transition-[padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
				{/* Expanded logo – visible only at lg+ */}
				<span className="hidden lg:inline-flex transition-opacity duration-200 ease-in-out">
					<Image
						src="/navbarMobile/nostrum-logo.svg"
						alt="Nostrum"
						width={121}
						height={40}
						className="h-12 w-auto object-contain"
						unoptimized
					/>
				</span>

			{/* Collapsed logo – visible only at sm → lg */}
			<span className="hidden sm:inline-flex lg:hidden">
					<Image
						src="/navbarMobile/nostrum-logo.svg"
						alt="Nostrum"
						width={28}
						height={28}
						className="h-7 w-auto object-contain"
						unoptimized
					/>
				</span>
			</div>

			{/* Stepper: collapsed (sm → lg) */}
			<div className="hidden sm:flex sm:justify-center sm:px-3 sm:pt-10 lg:hidden">
				<SidebarStepper
					items={stepItems}
					value={sidebarGroupId}
					onValueChange={goToGroup}
					sidebarState="collapsed"
					theme="purple"
				/>
			</div>

			{/* Stepper: expanded (lg+) */}
			<div className="hidden lg:flex lg:justify-center lg:px-3 lg:pt-10">
				<SidebarStepper
					items={stepItems}
					value={sidebarGroupId}
					onValueChange={goToGroup}
					sidebarState="expanded"
					theme="purple"
				/>
			</div>
		</aside>
	);
}
