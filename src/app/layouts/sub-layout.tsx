'use client'

import LeftNav from "@/components/LeftNav";
import {usePathname} from "next/navigation";
import React from "react";

export default function SubLayout({
                                      children,
                                  }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        usePathname().startsWith('/auth') ?
            <div>
                {children}
            </div>
            :
            <div>
                <div className="grid grid-cols-12">
                    <div className="hidden md:flex col-span-2 flex-col gap-2 text-gray-500 divide-y">
                        <LeftNav/>
                    </div>
                    <div className="col-span-full md:col-span-10">
                        {children}
                    </div>
                </div>
            </div>
    );
}

