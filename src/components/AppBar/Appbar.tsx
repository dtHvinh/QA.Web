'use client'

import { TagResponse } from "@/types/types";
import { AppName } from "@/utilities/Constants";
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

    const handleSearch = (searchTerm: string, selectedTag: TagResponse) => {
        if (searchTerm) {
            router.push(`/search?q=${searchTerm}&tag=${selectedTag.id}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-[var(--appbar-height)] gap-4">
                    <div className="flex items-center gap-6">
                        <Link
                            href={'/'}
                            className="text-2xl font-semibold text-gray-900 hover:text-gray-700 transition-colors whitespace-nowrap"
                        >
                            {AppName}
                        </Link>
                    </div>

                    <SearchInput onSearch={handleSearch} />

                    <div className="flex items-center gap-6">
                        <UserDropdown />
                    </div>
                </div>
            </div>
        </header>
    );
}