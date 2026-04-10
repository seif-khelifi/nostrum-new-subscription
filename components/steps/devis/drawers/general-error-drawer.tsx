"use client";

import { Phone } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerFooter,
	DrawerClose,
} from "@/components/ui/drawer";

interface GeneralErrorDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	message?: string;
	/** When false the phone call button is hidden. Defaults to true. */
	showCallButton?: boolean;
	/** Optional custom primary action — replaces the phone call button when provided. */
	onAction?: () => void;
	/** Label for the custom primary action button. Defaults to "Continuer". */
	actionLabel?: string;
	/** Label for the dismiss button. Defaults to "Fermer". */
	dismissLabel?: string;
}

export function GeneralErrorDrawer({
	open,
	onOpenChange,
	title = "Oops ! Une erreur s\u0027est produite",
	message,
	showCallButton = true,
	onAction,
	actionLabel = "Continuer",
	dismissLabel = "Fermer",
}: GeneralErrorDrawerProps) {
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	return (
		<Drawer
			direction={isDesktop ? "right" : "bottom"}
			open={open}
			onOpenChange={onOpenChange}
		>
			<DrawerContent className={isDesktop ? "sm:max-w-md" : ""}>
				<div className="flex flex-col gap-6 px-6 pt-8 pb-6">
					<DrawerTitle className="font-[family-name:var(--font-inter)] text-2xl font-bold text-[#34266D]">
						{title}
					</DrawerTitle>

					{message && (
						<div className="flex flex-col gap-4 text-sm leading-relaxed text-[#05061D]">
							<p>{message}</p>
						</div>
					)}
				</div>

				<DrawerFooter className="px-6 pb-8 pt-2">
					{onAction ? (
						<Button
							variant="ctaPurple"
							className="w-full rounded-[24px] min-h-[52px] h-auto py-3 px-6 text-sm font-semibold"
							onClick={onAction}
						>
							{actionLabel}
						</Button>
					) : showCallButton ? (
						<Button
							variant="ctaPurple"
							className="w-full rounded-[24px] min-h-[52px] h-auto py-3 px-6 text-sm font-semibold gap-2"
							asChild
						>
							<a href="tel:0162450105">
								<Phone className="h-4 w-4" />
								Appeler le 01 62 45 01 05
							</a>
						</Button>
					) : null}
					<DrawerClose asChild>
						<Button
							variant="ghost"
							className="w-full rounded-[24px] min-h-[48px] h-auto py-3 text-[#490076]"
						>
							{dismissLabel}
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
