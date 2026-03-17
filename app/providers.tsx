"use client";

import { type ReactNode } from "react";
import { StepperProvider } from "@/context/StepperContext";
import { SituationFormProvider } from "@/context/SituationFormContext";
import { SanteFormProvider } from "@/context/SanteFormContext";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<StepperProvider>
			<SituationFormProvider>
				<SanteFormProvider>{children}</SanteFormProvider>
			</SituationFormProvider>
		</StepperProvider>
	);
}
