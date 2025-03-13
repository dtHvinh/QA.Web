'use client'

import { TagResponse } from "@/types/types";
import { AppName } from "@/utilities/Constants";
import { Add } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import SearchInput from "../Search/SearchInput";
import UserDropdown from "../UserDropdown";

export default function Appbar() {
    const currentPath = usePathname();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    if (currentPath.startsWith('/auth')) return null;

    const handleSearch = (searchTerm: string, selectedTag?: TagResponse) => {
        if (searchTerm) {
            let url = `/search?q=${searchTerm}&tag=${selectedTag ? selectedTag.id : 0}`;
            router.push(url);
        }
    };

    return (
        <div className="h-[var(--appbar-height)] bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 h-full">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-4">
                        <Link
                            href={'/'}
                            className="text-2xl font-semibold text-gray-900 hover:text-gray-700 transition-colors whitespace-nowrap"
                        >
                            {AppName}
                        </Link>
                    </div>

                    <div className="flex-1 max-w-xl mx-4">
                        <SearchInput onSearch={handleSearch} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Tooltip title='Ask a question'>
                            <Link href={'/new-question'} className="hover:bg-gray-200 p-2 rounded-full transition-colors active:scale-95">
                                <Add />
                            </Link>
                        </Tooltip>
                        <UserDropdown />
                    </div>
                </div>
            </div>
        </div>
    );
}