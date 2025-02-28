'use client'

import { AppName } from "@/utilities/Constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserDropdown from "../UserDropdown";

export default function Appbar() {
    const currentPath = usePathname();

    return (
        !currentPath.startsWith('/auth') &&
        <div
            className="flex justify-between md:py-4 w-full md:flex-row items-center md:h-[var(--appbar-height)]">
            <div className="gap-4 flex items-center w-full md:w-auto justify-between md:justify-start">
                <Link href={'/'} className="text-2xl">
                    {AppName}
                </Link>
            </div>

            <div className="flex gap-7 items-center mt-4 md:mt-0 md:w-auto justify-between md:justify-end">
                <UserDropdown />
            </div>
        </div>
    )
}