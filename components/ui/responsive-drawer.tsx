"use client";

import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerFooter,
} from "@/components/ui/drawer";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ResponsiveDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Header icon src (defaults to drawer-garanties-b.svg) */
	imageSrc?: string;
	imageAlt?: string;
	title: string;
	description: string;
	/** Main scrollable body */
	children: React.ReactNode;
	/** Footer area rendered below body (e.g. total bar + CTA) */
	footer: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/*                                                                     */
/*  Renders a centered Dialog on desktop (lg+) and a bottom Drawer on  */
/*  mobile. Shared layout: header image → title/description → body →   */
/*  footer.                                                            */
/* ------------------------------------------------------------------ */

export function ResponsiveDrawer({
	open,
	onOpenChange,
	imageSrc = "/drawers/drawer-garanties-b.svg",
	imageAlt = "",
	title,
	description,
	children,
	footer,
}: ResponsiveDrawerProps) {
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	const headerImage = (
		<div className="px-5 pt-5">
			<Image
				src={imageSrc}
				alt={imageAlt}
				width={48}
				height={48}
				className="h-12 w-12"
			/>
		</div>
	);

	const titleSection = (Title: typeof DialogTitle | typeof DrawerTitle) => (
		<div className="px-5 pt-4 pb-2 text-left">
			<Title className="font-[family-name:var(--font-inter)] text-xl font-bold text-[#34266D]">
				{title}
			</Title>
			<p className="mt-1 text-sm text-[#05061D]">{description}</p>
		</div>
	);

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent
					showCloseButton
					className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0"
				>
					{headerImage}
					{titleSection(DialogTitle)}
					{children}
					<div className="px-5 pb-6 pt-2">{footer}</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				{headerImage}
				{titleSection(DrawerTitle)}
				{children}
				<DrawerFooter className="px-5 pb-6 pt-2">
					{footer}
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
