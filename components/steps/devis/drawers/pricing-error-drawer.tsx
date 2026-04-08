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

interface PricingErrorDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function PricingErrorDrawer({
	open,
	onOpenChange,
}: PricingErrorDrawerProps) {
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
						Oops ! Une erreur s&apos;est produite
					</DrawerTitle>

					<div className="flex flex-col gap-4 text-sm leading-relaxed text-[#05061D]">
						<p>
							Nous n&apos;avons pas pu afficher nos tarifs pour le
							moment.
						</p>
						<p>
							Pas d&apos;inqui&eacute;tude, notre &eacute;quipe est
							l&agrave; pour vous aider !
						</p>
						<p>
							Vous pouvez nous contacter directement au{" "}
							<a
								href="tel:0162450105"
								className="font-semibold text-[#9000E3] hover:underline"
							>
								01 62 45 01 05
							</a>{" "}
							(appel gratuit, du lundi au vendredi / 9h-19h) pour
							obtenir les informations dont vous avez besoin et
							souscrire en toute simplicit&eacute;.
						</p>
					</div>
				</div>

				<DrawerFooter className="px-6 pb-8 pt-2">
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
					<DrawerClose asChild>
						<Button
							variant="ghost"
							className="w-full rounded-[24px] min-h-[48px] h-auto py-3 text-[#490076]"
						>
							Fermer
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
