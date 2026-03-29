"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerFooter,
	DrawerClose,
} from "@/components/ui/drawer";

export interface OptionDetails {
	id: string;
	title: string;
	price: string;
	description: string;
	detailedDescription: string;
}

interface OptionDetailsDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	option: OptionDetails | null;
	selectedOptions: string[];
	onToggle: (id: string, checked: boolean) => void;
}

export function OptionDetailsDrawer({
	open,
	onOpenChange,
	option,
	selectedOptions,
	onToggle,
}: OptionDetailsDrawerProps) {
	if (!option) return null;

	const isSelected = selectedOptions.includes(option.id);

	const handleAddOrRemove = () => {
		onToggle(option.id, !isSelected);
		onOpenChange(false);
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				<div className="px-5 pt-5 pb-4">
					<Image
						src="/options/Frame 48096305.svg"
						alt="Option icon"
						width={48}
						height={48}
						className="h-12 w-12"
						onError={(e) => {
							// fallback if image not found
							e.currentTarget.style.display = 'none';
						}}
					/>
				</div>

				<div className="px-5 pb-2 text-left">
					<DrawerTitle className="font-[family-name:var(--font-inter)] text-xl font-bold text-[#34266D] mb-3">
						{option.title}
					</DrawerTitle>
					<p className="text-sm text-[#05061D] leading-relaxed">
						{option.detailedDescription}
					</p>
				</div>
                
				<div className="mt-4 px-5">
					<div className="flex items-end gap-1 mb-2">
						<span className="font-bold tracking-tight text-[#9000E3] text-[2rem] leading-none">
							{option.price}
						</span>
						<span className="font-semibold text-[#490076] text-sm mb-0.5">
							/mois
						</span>
					</div>
				</div>

				<DrawerFooter className="px-5 pb-6 pt-4">
					<Button
						variant={isSelected ? "outline" : "ctaPurple"}
						className={`w-full rounded-[24px] h-[52px] px-6 text-sm font-semibold ${isSelected ? 'border-[#490076] text-[#490076]' : ''}`}
						onClick={handleAddOrRemove}
					>
						{isSelected ? "Retirer cette protection" : "Ajouter cette protection"}
						{!isSelected && <Check className="ml-2 h-5 w-5" />}
					</Button>
					<DrawerClose asChild>
						<Button
							variant="ghost"
							className="w-full rounded-[24px] h-[48px] text-[#490076]"
						>
							Annuler
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
