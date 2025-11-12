import { Header } from "@/components/header/header";
import { ConditionalLayout } from "@/components/layout/layout-content";
import { AppSidebar } from "@/components/sidebar/sidebar";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Geist } from "next/font/google";
import Error from "./error";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const defaultUrl = process.env.VERCEL_URL || "http://localhost:3000";

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Deal&Buy",
	description: "Descubre increíbles ofertas y compra más barato en conjunto con la gente",
};

const geistSans = Geist({
	variable: "--font-geist-sans",
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
			<body className={`${geistSans.className} antialiased`}>
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
