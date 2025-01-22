'use client'

import LeftNav from "@/components/LeftNav";
import {usePathname} from "next/navigation";

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
                <div className="grid grid-cols-6">
                    <div className="hidden md:flex flex-col gap-2 text-gray-500 divide-y">
                        <LeftNav/>
                    </div>
                    <div className="col-span-6 md:col-span-5">
                        {children}
                    </div>
                </div>
            </div>
    );
}

