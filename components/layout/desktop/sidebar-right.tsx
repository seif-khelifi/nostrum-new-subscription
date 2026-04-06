"use client";

import { cn } from "@/lib/utils";
import { AlertBanner } from "@/components/ui/alert";

export interface DesktopSidebarRightProps {
	className?: string;
}

/**
 * Right sidebar for variant A desktop layout.
 *
 * Contains two stacked AlertBanner cards:
 * 1. Call card — dark (#490076) with call.svg image
 * 2. Santé card — default gradient with girl.svg image
 *
 * Both cards use a responsive layout: when the sidebar is narrow,
 * images stack below the text content instead of sitting beside it.
 *
 * Visibility is controlled by the parent DesktopShell — the right sidebar
 * is hidden when the left sidebar collapses (below lg breakpoint).
 */
export function DesktopSidebarRight({ className }: DesktopSidebarRightProps) {
	return (
		<aside
			className={cn(
				/* base */
				"fixed top-0 right-0 bottom-0 z-40 overflow-y-auto overflow-x-hidden bg-background border-l border-[#E9E6DF]",
				/* width + opacity transition */
				"transition-[width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
				/* responsive visibility & width */
				"hidden lg:flex lg:flex-col lg:w-72 xl:w-80",
				/* cards close to the top */
				"gap-4 px-4 pt-4",
				className,
			)}
		>
			{/* Call card (dark variant) */}
			<AlertBanner
				variant="sidebarDark"
				layout="responsive"
				title="Parler à un conseiller"
				subtitle="On vous rappelle dans la journée"
				imageSrc="/alertBanner/call.svg"
				imageAlt="Appeler un conseiller"
				imageFill
				visualClassName="h-[64px]"
			/>

			{/* Santé card (default gradient) */}
			<AlertBanner
				variant="default"
				layout="responsive"
				title="On rembourse 10 fois plus de médecines douces que les autres mutuelles"
				subtitle="Ostéopathie, Sophrologie, Psychologie, Acupuncture, Naturopathie, Coaching, et bien plus."
				imageSrc="/alertBanner/girl.svg"
				imageAlt="Santé"
				imageFill
				visualClassName="h-[80px]"
			/>
		</aside>
	);
}
