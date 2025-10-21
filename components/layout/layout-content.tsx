"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface ConditionalLayoutProps {
	children: ReactNode;
	isAuthPage: boolean;
	header: ReactNode;
	sidebar: ReactNode;
}

export function ConditionalLayout({ children, isAuthPage, header, sidebar }: ConditionalLayoutProps) {
	if (isAuthPage) {
		return (
			<div className="flex flex-col min-h-screen w-full">
				<main className="flex-1 p-6 md:p-8 overflow-auto w-full">
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
						<div className="max-w-7xl mx-auto">{children}</div>
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
