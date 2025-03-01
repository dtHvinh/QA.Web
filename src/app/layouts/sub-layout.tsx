'use client'

import SideNav from "@/components/AppBar/SideNav";
import ErrorFallback from "@/components/Error/ErrorFallback";
import { theme } from "@/theme/theme";
import { ThemeProvider } from "@emotion/react";
import { usePathname } from "next/navigation";
import { SnackbarProvider } from "notistack";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";

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
        <ErrorBoundary FallbackComponent={ErrorFallback}>
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
                                <div className="hidden md:block fixed left-0 top-[var(--appbar-height)] w-16">
                                    <SideNav />
                                </div>
                                <div className="flex-1 ml-0 md:ml-16 p-4">
                                    {children}
                                </div>
                            </div>
                        </SnackbarProvider>
                    </div>}
            </ThemeProvider>
        </ErrorBoundary>
    );
}

