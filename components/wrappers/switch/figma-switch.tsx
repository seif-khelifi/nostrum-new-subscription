import { type ComponentProps } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import "./figma-switch.css";

export function FigmaSwitch({
	className,
	...props
}: ComponentProps<typeof Switch>) {
	return (
		<Switch
			className={cn("figma-switch", className)}
			{...props}
		/>
	);
}
