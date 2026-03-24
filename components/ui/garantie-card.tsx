import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  CVA variant definitions                                            */
/* ------------------------------------------------------------------ */

const garantieCardVariants = cva(
	"flex flex-col gap-2 rounded-2xl p-4",
	{
		variants: {
			colorScheme: {
				purple: "bg-[#F3E5FA]",
				warm: "bg-[#FBF4EA]",
				blue: "bg-[#E8F3F8]",
				transparent: "bg-transparent",
			},
		},
		defaultVariants: {
			colorScheme: "purple",
		},
	},
);

const garantieCardTitleVariants = cva(
	"text-sm font-semibold",
	{
		variants: {
			colorScheme: {
				purple: "text-[#490076]",
				warm: "text-[#490076]",
				blue: "text-[#490076]",
				transparent: "text-[#490076]",
			},
		},
		defaultVariants: {
			colorScheme: "purple",
		},
	},
);

const garantieCardDescriptionVariants = cva(
	"text-xs leading-relaxed",
	{
		variants: {
			colorScheme: {
				purple: "text-[#8B62A4]",
				warm: "text-[#8B62A4]",
				blue: "text-[#8B62A4]",
				transparent: "text-[#8B62A4]",
			},
		},
		defaultVariants: {
			colorScheme: "purple",
		},
	},
);

/* ------------------------------------------------------------------ */
/*  Component types                                                    */
/* ------------------------------------------------------------------ */

export type GarantieCardColorScheme = "purple" | "warm" | "blue" | "transparent";

export interface GarantieCardProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof garantieCardVariants> {
	title: string;
	description: string;
	/** Icon src — defaults to the Alert14 illustration */
	iconSrc?: string;
}

/* ------------------------------------------------------------------ */
/*  GarantieCard                                                       */
/* ------------------------------------------------------------------ */

function GarantieCard({
	className,
	colorScheme = "purple",
	title,
	description,
	iconSrc = "/garanties/illustration=Alert14.svg",
	...props
}: GarantieCardProps) {
	return (
		<div
			data-slot="garantie-card"
			className={cn(garantieCardVariants({ colorScheme }), className)}
			{...props}
		>
			<div className="flex items-center gap-2">
				<Image
					src={iconSrc}
					alt=""
					width={24}
					height={24}
					className="h-6 w-6 shrink-0"
				/>
				<span className={cn(garantieCardTitleVariants({ colorScheme }))}>
					{title}
				</span>
			</div>
			<p className={cn(garantieCardDescriptionVariants({ colorScheme }))}>
				{description}
			</p>
		</div>
	);
}

export { GarantieCard, garantieCardVariants };
