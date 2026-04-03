"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export function SectionDots({
	activeIndex,
	total,
	onDotClick,
}: {
	activeIndex: number;
	total: number;
	onDotClick: (index: number) => void;
}) {
	return (
		<div className="flex items-center justify-center gap-3 py-2">
			{Array.from({ length: total }).map((_, i) => (
				<button
					key={i}
					type="button"
					onClick={() => onDotClick(i)}
					className={cn(
						"transition-all duration-200",
						i === activeIndex
							? "w-5 h-5"
							: "w-2 h-2 rounded-full bg-[#CE99FF]/40 hover:bg-[#CE99FF]/60",
					)}
				>
					{i === activeIndex ? (
						<Image
							src="/comparateur/diamond.svg"
							alt="Section active"
							width={20}
							height={20}
						/>
					) : null}
				</button>
			))}
		</div>
	);
}
