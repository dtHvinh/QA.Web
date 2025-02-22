'use client'

import {AppName} from "@/utilities/Constants";
import Link from "next/link";
import {usePathname} from "next/navigation";
import UserDropdown from "../UserDropdown";
import AppbarActionButtons from "@/components/AppBar/AppbarActionButtons";

export default function Appbar() {
    const currentPath = usePathname();

    return (
        !currentPath.startsWith('/auth') &&
        <div
            className="flex justify-between py-4 w-full items-baseline md:flex-row md:items-center md:h-[var(--appbar-height)]">
            <div className="gap-4 flex items-center w-full md:w-auto justify-between md:justify-start">
                <Link href={'/public'} className="text-2xl">
                    {AppName}
                </Link>
            </div>

            <div className="flex gap-7 items-center mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                <AppbarActionButtons className={'hidden md:flex'}/>

                <UserDropdown/>
            </div>
        </div>
    )
}