import Appbar from "@/components/AppBar/Appbar";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { SignalRProvider } from "@/context/SignalRContext";
import { SupabaseProvider } from "@/context/SupabaseClientContext";
import { AppThemeProvider } from '@/context/ThemeContext';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist, Geist_Mono } from "next/font/google";
import React from "react";
import "./globals.css";
import "./globals.scss";
import SubLayout from "./layouts/sub-layout";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Q&A",
    description: "App",
};

export const viewport: Viewport = {
    initialScale: 1,
    width: "device-width",
    viewportFit: "cover"
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script src="https://unpkg.com/react-scan/dist/auto.global.js" async></script>
                <title>A</title>
            </head>
            <body className={`${dmSans.className} ${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
                <AppThemeProvider>
                    <div className="flex flex-col min-h-screen">
                        <header className="sticky top-0 z-50 bg-white shadow-sm">
                            <Appbar />
                        </header>

                        <main className="flex-1">
                            <SignalRProvider>
                                <SupabaseProvider>
                                    <SubLayout>
                                        {children}
                                        <Analytics />
                                        <SpeedInsights />
                                    </SubLayout>
                                </SupabaseProvider>
                            </SignalRProvider>
                            <ScrollToTopButton />
                        </main>
                    </div>
                </AppThemeProvider>
            </body>
        </html>
    );
}
