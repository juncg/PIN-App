"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface ConditionalLayoutProps {
	children: ReactNode;
	header: ReactNode;
	sidebar: ReactNode;
}

export function ConditionalLayout({ children, header, sidebar }: ConditionalLayoutProps) {
	const pathname = usePathname();
	const isAuthPage = pathname.startsWith("/auth");

	if (isAuthPage) {
		return (
			<div className="flex flex-col min-h-screen w-full">
				<main className="flex-1 overflow-auto w-full">
					<div className="max-w-7xl mx-auto">{children}</div>
				</main>
			</div>
		);
	}

	return (
		<SidebarProvider>
			<div className="flex flex-col min-h-screen w-full">
				{header}

				<div className="flex flex-1 relative overflow-hidden">
					{sidebar}

					<main className="flex-1 p-6 md:p-8 overflow-auto w-full">
						<div className="mx-auto px-32">{children}</div>
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
