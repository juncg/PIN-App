import { Header } from "@/components/header/header";
import { ConditionalLayout } from "@/components/layout/layout-content";
import { AppSidebar } from "@/components/sidebar/sidebar";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

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
	const headersList = await headers();
	const pathname = headersList.get("x-pathname") || "";
	const isAuthPage = pathname.startsWith("/auth");

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.className} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<ConditionalLayout isAuthPage={isAuthPage} header={<Header />} sidebar={<AppSidebar />}>
						{children}
					</ConditionalLayout>
				</ThemeProvider>
			</body>
		</html>
	);
}
