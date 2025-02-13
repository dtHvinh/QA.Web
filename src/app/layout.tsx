import Appbar from "@/components/Appbar";
import type {Metadata} from "next";
import {DM_Sans, Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import "./globals.scss";
import SubLayout from "./layouts/sub-layout";
import {ToastContainer} from "react-toastify";
import React from "react";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import {SupabaseProvider} from "@/context/SupabaseClientContext";
import {Analytics} from "@vercel/analytics/react"
import {SpeedInsights} from "@vercel/speed-insights/next"

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

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${dmSans.className} ${geistSans.variable} ${geistMono.variable} bg-white text-black antialiased`}
        >
        <div className="container mx-auto px-4 min-h-screen">
            <Appbar/>
            <SupabaseProvider>
                <SubLayout>
                    <ToastContainer/>
                    {children}
                    <Analytics/>
                    <SpeedInsights/>
                </SubLayout>
            </SupabaseProvider>
            <ScrollToTopButton/>
        </div>
        <footer className="bg-gray-800 text-white py-4 mt-5">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Q&A App. All rights reserved.</p>
            </div>
        </footer>
        </body>
        </html>
    );
}
