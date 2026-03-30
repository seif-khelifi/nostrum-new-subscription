"use client";

import { type ReactNode } from "react";
import { MobileNav } from "./mobile-nav";
import { useStepper } from "@/context/StepperContext";

export interface MobileShellProps {
  /** Custom header element (e.g., MobileStepNavbar) */
  customHeader?: ReactNode;
  /** Bottom navigation items — nav bar hidden when omitted */
  navItems?: ReactNode;
  /** Main page content */
  children: ReactNode;
}

/**
 * Mobile layout shell.
 * Renders an optional top header and a fixed bottom navigation,
 * with the page content scrollable between them.
 *
 * Hidden on viewports >= sm breakpoint (640px).
 *
 * On the onboarding step (group 1) the custom header is hidden
 * and the main area padding is removed so the onboarding hero
 * can render edge-to-edge as a full-page experience.
 */
export function MobileShell({
  customHeader,
  navItems,
  children,
}: MobileShellProps) {
  const { currentGroup } = useStepper();

  /* Hide header + remove padding on the onboarding step */
  const isOnboarding = currentGroup.id === 1;

  return (
    <div className="flex flex-col h-screen sm:hidden">
      {!isOnboarding && customHeader}

      <main
        data-slot="mobile-main"
        className={`flex-1 overflow-y-auto${isOnboarding ? "" : " p-4"}${navItems && !isOnboarding ? " pb-14" : ""}`}
      >
        {children}
      </main>

      {navItems && !isOnboarding && <MobileNav>{navItems}</MobileNav>}
    </div>
  );
}
