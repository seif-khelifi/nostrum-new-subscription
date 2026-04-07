"use client";

import { type ReactNode } from "react";
import { VariantProvider } from "@/context/VariantContext";
import { StepperProvider } from "@/context/StepperContext";
import { SituationFormProvider } from "@/context/SituationFormContext";
import { SanteFormProvider } from "@/context/SanteFormContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <VariantProvider>
      <StepperProvider>
        <SituationFormProvider>
          <SanteFormProvider>{children}</SanteFormProvider>
        </SituationFormProvider>
      </StepperProvider>
    </VariantProvider>
  );
}
