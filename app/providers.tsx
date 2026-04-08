"use client";

import { type ReactNode } from "react";
import { VariantProvider } from "@/context/VariantContext";
import { StepperProvider } from "@/context/StepperContext";
import { SituationFormProvider } from "@/context/SituationFormContext";
import { SanteFormProvider } from "@/context/SanteFormContext";
import type { VariantKey } from "@/config";

interface ProvidersProps {
  children: ReactNode;
  variant?: VariantKey;
}

export function Providers({ children, variant }: ProvidersProps) {
  return (
    <VariantProvider variant={variant}>
      <StepperProvider>
        <SituationFormProvider>
          <SanteFormProvider>{children}</SanteFormProvider>
        </SituationFormProvider>
      </StepperProvider>
    </VariantProvider>
  );
}
