'use client'

import LeftNav from "@/components/LeftNav";
import {usePathname} from "next/navigation";
import React from "react";
import {SnackbarProvider} from "notistack";

export default function SubLayout({
                                      children,
                                  }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        usePathname().startsWith('/auth') ?
            <div>
                <SnackbarProvider autoHideDuration={6000}>
                    {children}
                </SnackbarProvider>
            </div>
            :
            <div>
                <SnackbarProvider autoHideDuration={6000}>
                    <div className="grid grid-cols-12 gap-5">
                        <div
                            className="hidden md:flex col-span-2 flex-col text-gray-500 divide-y border-r min-h-[calc(100vh-var(--appbar-height))]">
                            <LeftNav/>
                        </div>
                        <div className="col-span-full md:col-span-10 mt-2">
                            {children}
                        </div>
                    </div>
                </SnackbarProvider>
            </div>
    );
}

