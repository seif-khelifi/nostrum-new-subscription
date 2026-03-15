"use client";

import { type ReactNode } from "react";
import { StepperProvider } from "@/context/StepperContext";

export function Providers({ children }: { children: ReactNode }) {
	return <StepperProvider>{children}</StepperProvider>;
}
