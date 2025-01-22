'use client'

import {AuthContext} from "@/context/AuthContextProvider";
import {AppName, Routes} from "@/utilities/Constants";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useContext} from "react";
import UserDropdown from "./UserDropdown";

export default function Appbar() {
    const authContext = useContext(AuthContext);
    const currentPath = usePathname();

    return (
        !currentPath.startsWith('/auth') &&
        <div className="flex flex-col md:flex-row items-center justify-between py-4 w-full">
            <div className="gap-4 flex items-center w-full md:w-auto justify-between md:justify-start">
                <Link href={'/'} className="text-2xl">
                    {AppName}
                </Link>
                <div className="ml-0 md:ml-8 gap-8 text-sm flex items-center text-gray-700">
                    <Link href={Routes.YourQuestions} className="hover:bg-gray-300 p-2 rounded-full transition-colors">
                        Your Questions
                    </Link>
                </div>
            </div>

            <div className="flex gap-4 items-center mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                <Link href={Routes.NewQuestion}
                      className="text-sm text-gray-700 hover:bg-gray-300 p-2 rounded-full transition-colors">
                    Ask <div className={'hidden md:inline'}>Question</div>
                </Link>
                <div className="w-full md:w-auto">
                    <input type="text" placeholder="Search..."
                           className="w-full md:w-auto text-gray-500 border p-2 outline-none rounded-full focus:border-black transition-colors"/>
                </div>
                <UserDropdown profilePicture={authContext?.profilePicture}/>
            </div>
        </div>
    )
}