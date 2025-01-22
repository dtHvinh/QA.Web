import Appbar from "@/components/Appbar";
import AuthContextProvider from "@/context/AuthContextProvider";
import type {Metadata} from "next";
import {DM_Sans, Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import "./globals.scss";
import SubLayout from "./layouts/sub-layout";
import {ToastContainer} from "react-toastify";
import React from "react";

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
        <div className="container mx-auto px-4">
            <AuthContextProvider>
                <Appbar/>
                <SubLayout>
                    <ToastContainer/>
                    {children}
                </SubLayout>
            </AuthContextProvider>
        </div>
        </body>
        </html>
    );
}
