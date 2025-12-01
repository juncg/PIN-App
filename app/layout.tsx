import { Header } from "@/components/header/header";
import { ConditionalLayout } from "@/components/layout/layout-content";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { SmoothScroll } from "@/components/ui-custom/smooth-scroll";
import { Toaster } from "@/components/ui-custom/sonner";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import Error from "./error";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL || "http://localhost:3000";

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Deal&Buy",
	description: "Descubre increíbles ofertas y compra más barato en conjunto con la gente",
};

const funnelSans = Funnel_Sans({
	variable: "--font-funnel-sans",
	display: "swap",
	subsets: ["latin"],
});

const funnelDisplay = Funnel_Display({
	variable: "--font-funnel-display",
	display: "swap",
	subsets: ["latin"],
});

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${funnelSans.variable} ${funnelDisplay.variable} font-funnel-sans antialiased`}>
				{/*<SmoothScroll /> it is problematic for now*/}
				<ErrorBoundary errorComponent={Error}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						<ConditionalLayout header={<Header />} sidebar={<AppSidebar />}>
							{children}
						</ConditionalLayout>
						<Toaster />
					</ThemeProvider>
				</ErrorBoundary>
			</body>
		</html>
	);
}
