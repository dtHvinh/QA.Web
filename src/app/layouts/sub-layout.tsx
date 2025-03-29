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
        '/banned'
    ];

    const pathname = usePathname();
    const shouldShowSidebar = !noLayoutPathPrefix.some(prefix => pathname.startsWith(prefix));

    return (
        <ThemeProvider theme={theme}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <SnackbarProvider autoHideDuration={6000}>
                    <div className="flex flex-col min-h-[calc(100vh-var(--appbar-height))]">
                        {shouldShowSidebar ? (
                            <div className="flex flex-1">
                                <SideNav />
                                <div className="flex-1 pt-4">
                                    {children}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1">
                                {children}
                            </div>
                        )}
                    </div>
                </SnackbarProvider>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

