'use client'

import { usePathname } from "next/navigation";
import React from "react";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/theme/theme";
import SideNav from "@/components/AppBar/SideNav";

export default function SubLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const noLayoutPathPrefix = [
        '/auth',
        '/admin'
    ];

    return (
        <ThemeProvider theme={theme}>
            {noLayoutPathPrefix.some(prefix => usePathname().startsWith(prefix)) ?
                <div>
                    <SnackbarProvider autoHideDuration={6000}>
                        {children}
                    </SnackbarProvider>
                </div>
                :
                <div>
                    <SnackbarProvider autoHideDuration={6000}>
                        <div className="flex">
                            <div className="hidden md:block fixed left-0 top-[var(--appbar-height)] w-16 border-r">
                                <SideNav />
                            </div>
                            <div className="flex-1 ml-0 md:ml-16 p-4">
                                {children}
                            </div>
                        </div>
                    </SnackbarProvider>
                </div>}
        </ThemeProvider>
    );
}

