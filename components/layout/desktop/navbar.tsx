import { type ReactNode } from "react";
import { AppNavbar } from "@/components/wrappers/navbar";

export interface DesktopNavbarProps {
	title?: string;
	actions?: ReactNode;
}

export function DesktopNavbar({ title, actions }: DesktopNavbarProps) {
	return <AppNavbar title={title} actions={actions} />;
}
