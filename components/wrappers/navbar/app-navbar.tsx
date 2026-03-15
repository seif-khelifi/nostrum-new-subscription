import { type ReactNode } from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./app-navbar.css";

export interface AppNavbarProps {
	title?: string;
	actions?: ReactNode;
	className?: string;
}

export function AppNavbar({ title, actions, className }: AppNavbarProps) {
	return (
		<header className={cn("app-navbar", className)}>
			<div>{title && <span className="app-navbar__title">{title}</span>}</div>
		</header>
	);
}
