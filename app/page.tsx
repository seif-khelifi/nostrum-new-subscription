import { DesktopShell } from "@/components/layout/desktop";
import { MobileShell } from "@/components/layout/mobile";
import { DashboardContent } from "@/components/shared";

export default function Home() {
	return (
		<>
			{/* Desktop: sidebar + navbar layout (hidden below sm/640px) */}
			<DesktopShell title="Dashboard">
				<DashboardContent />
			</DesktopShell>

			{/* Mobile: header + bottom nav layout (hidden at sm/640px and above) */}
			<MobileShell>
				<DashboardContent />
			</MobileShell>
		</>
	);
}
