"use client";

import { type ReactNode } from "react";
import { StepperProvider } from "@/context/StepperContext";
import { SituationFormProvider } from "@/context/SituationFormContext";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<StepperProvider>
			<SituationFormProvider>{children}</SituationFormProvider>
		</StepperProvider>
	);
}
