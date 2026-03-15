"use client";

import { type ReactNode } from "react";
import {
	Rocket,
	HeartPulse,
	CircleDollarSign,
	WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarStepper } from "@/components/ui/sidebar-stepper";
import { useStepper } from "@/context/StepperContext";
import "./app-sidebar.css";

export interface AppSidebarProps {
	/** Custom logo element for expanded state */
	logo?: ReactNode;
	/** Custom icon/logo for collapsed state (defaults to "N") */
	collapsedLogo?: ReactNode;
	className?: string;
	children?: ReactNode;
}

const stepItems = [
	{ id: 1, label: "Situation", icon: <Rocket className="h-4 w-4" /> },
	{ id: 2, label: "Santé", icon: <HeartPulse className="h-4 w-4" /> },
	{ id: 3, label: "Devis", icon: <CircleDollarSign className="h-4 w-4" /> },
	{ id: 4, label: "Souscription", icon: <WalletCards className="h-4 w-4" /> },
];

/**
 * Responsive sidebar component.
 *
 * - < sm:  hidden (mobile shell takes over)
 * - sm → lg: collapsed (~120px, icon-only stepper)
 * - lg+: full width (16rem, expanded stepper)
 */
export function AppSidebar({
	logo,
	collapsedLogo,
	className,
	children,
}: AppSidebarProps) {
	const { sidebarGroupId, goToGroup } = useStepper();

	return (
		<aside
			className={cn(
				"app-sidebar",
				/* hidden on mobile, flex on sm+ */
				"hidden sm:flex sm:flex-col",
				/* collapsed width (sm → lg), full width (lg+) */
				"sm:w-[120px] lg:w-64",
				className,
			)}
		>
			<div
				className={cn(
					"app-sidebar__logo",
					/* collapsed: center, no padding | expanded: left-aligned with padding */
					"sm:px-0 sm:justify-center lg:px-6 lg:justify-start",
				)}
			>
				{/* Expanded logo – visible only at lg+ */}
				<span className="hidden lg:inline-flex transition-opacity duration-200 ease-in-out">
					{logo ?? (
						<span className="app-sidebar__logo-text">Nostrum</span>
					)}
				</span>

				{/* Collapsed logo – visible only at sm → lg */}
				<span className="hidden sm:inline-flex lg:hidden">
					{collapsedLogo ?? (
						<span className="app-sidebar__logo-icon">N</span>
					)}
				</span>
			</div>

			{/* Stepper: collapsed (sm → lg) */}
			<div className="hidden sm:flex sm:justify-center sm:px-3 sm:pt-2 lg:hidden">
				<SidebarStepper
					items={stepItems}
					value={sidebarGroupId}
					onValueChange={goToGroup}
					sidebarState="collapsed"
				/>
			</div>

			{/* Stepper: expanded (lg+) */}
			<div className="hidden lg:flex lg:justify-center lg:px-3 lg:pt-2">
				<SidebarStepper
					items={stepItems}
					value={sidebarGroupId}
					onValueChange={goToGroup}
					sidebarState="expanded"
				/>
			</div>

			{children}
		</aside>
	);
}
