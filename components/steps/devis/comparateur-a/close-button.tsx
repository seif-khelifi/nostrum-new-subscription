"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CloseButton({ onClick }: { onClick: () => void }) {
	return (
		<Button variant="closeComparateur" onClick={onClick}>
			Fermer le comparateur d{"'"}offres
			<span className="flex h-[26px] w-[42px] items-center justify-center rounded-full bg-[#360057] transition-colors hover:bg-[#4a0076]">
				<X className="h-4 w-4 text-[#F3E5FA]" />
			</span>
		</Button>
	);
}
