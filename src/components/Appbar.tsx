'use client'

import {AppName, Routes} from "@/utilities/Constants";
import Link from "next/link";
import {usePathname} from "next/navigation";
import UserDropdown from "./UserDropdown";
import SearchBar from "@/components/SearchBar";
import {useState} from "react";

export default function Appbar() {
    const currentPath = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

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
                      className="text-sm text-gray-600 hover:bg-gray-300 p-2 rounded-full transition-colors">
                    Ask <div className={'hidden md:inline'}>Question</div>
                </Link>
                <div className="w-full md:w-auto">
                    <button onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="text-sm text-gray-700 hover:bg-gray-300 p-2 rounded-full transition-colors">
                        Search
                    </button>

                    <SearchBar open={isSearchOpen} onClose={() => setIsSearchOpen(false)}/>
                </div>
                <UserDropdown/>
            </div>
        </div>
    )
}