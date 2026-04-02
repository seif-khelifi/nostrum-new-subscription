"use client";

import { type ReactNode } from "react";
import { VariantProvider } from "@/context/VariantContext";
import { StepperProvider } from "@/context/StepperContext";
import { SituationFormProvider } from "@/context/SituationFormContext";
import { SanteFormProvider } from "@/context/SanteFormContext";
import { VariantIndicator } from "@/components/shared/variant-indicator";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <VariantProvider>
      <VariantIndicator />
      <StepperProvider>
        <SituationFormProvider>
          <SanteFormProvider>{children}</SanteFormProvider>
        </SituationFormProvider>
      </StepperProvider>
    </VariantProvider>
  );
}
