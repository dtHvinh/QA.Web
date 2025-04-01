'use client'

import { TagResponse } from "@/types/types";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SearchInput from "../Search/SearchInput";
import ThemeToggle from '../ThemeToggle';
import UserDropdown from "../UserDropdown";

export default function Appbar() {
    const currentPath = usePathname();
    const router = useRouter();

    const noLayoutPathPrefix = [
        '/auth',
        '/banned'
    ];

    const shouldHideAppbar = noLayoutPathPrefix.some(path => currentPath.startsWith(path));

    if (shouldHideAppbar) return null;

    const handleSearch = (searchTerm: string, selectedTag?: TagResponse) => {
        if (searchTerm) {
            let url = `/search?q=${searchTerm}&tag=${selectedTag ? selectedTag.id : 0}`;
            router.push(url);
        }
    };

    return (
        <div className="h-[var(--appbar-height)] bg-[var(--nav-background)] border-b border-[var(--border-color)]">
            <div className="max-w-7xl mx-auto px-4 h-full">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-4">
                        <Link
                            href={'/'}
                            className="text-2xl font-semibold text-[var(--text-primary)] hover:text-[var(--text-primary-dark)] transition-colors whitespace-nowrap">
                            QA Platform
                        </Link>
                    </div>

                    <div className="hidden md:block max-w-xl mx-4">
                        <SearchInput onSearch={handleSearch} />
                    </div>

                    <div className="flex items-center gap-4 -ml-2">
                        <div className="w-10">
                            <ThemeToggle />
                        </div>
                        <UserDropdown />
                    </div>
                </div>
            </div>
        </div>
    );
}