import { DesktopShell } from "@/components/layout/desktop";
import { MobileShell } from "@/components/layout/mobile";
import { DashboardContent } from "@/components/shared";
import { StepNavbar } from "@/components/steps/step-navbar";
import { MobileStepNavbar } from "@/components/steps/mobile-step-navbar";

export default function Home() {
	return (
		<>
			{/* Desktop: sidebar + step navbar layout (hidden below sm/640px) */}
			<DesktopShell customNavbar={<StepNavbar />}>
				<DashboardContent />
			</DesktopShell>

			{/* Mobile: step navbar + bottom nav layout (hidden at sm/640px and above) */}
			<MobileShell customHeader={<MobileStepNavbar />}>
				<DashboardContent />
			</MobileShell>
		</>
	);
}
