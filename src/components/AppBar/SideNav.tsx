import useLogout from "@/helpers/logout-hook";
import { Routes } from "@/utilities/Constants";
import { AdminPanelSettings, BookmarksOutlined, ChevronLeft, ChevronRight, CollectionsOutlined, HomeOutlined, Language, Logout, PsychologyOutlined, QuestionMarkSharp, TagOutlined } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AdminPrivilege from "../Privilege/AdminPrivilege";

export default function SideNav() {
    const pathname = usePathname();
    const logOut = useLogout();
    const [isExpanded, setIsExpanded] = useState(true);

    const theme = {
        "selected": 'bg-[var(--hover-background)] font-semibold text-blue-500'
    }

    return (
        <aside
            className={`flex-col 
            hidden md:flex
            items-center text-[var(--text-primary)] h-full
            ${isExpanded ? 'w-[var(--left-nav-expanded-width)]' : 'w-4'} 
            border-r border-[var(--border-color)]
            bg-[var(--nav-background)]
            fixed left-0 top-[var(--appbar-height)]
            z-50`}
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -right-4 top-24 w-8 h-8 rounded-full bg-[var(--nav-background)] 
                border border-[var(--border-color)] flex items-center justify-center
                hover:bg-[var(--hover-background)] transition-colors z-50 shadow-md"
            >
                {isExpanded ? <ChevronLeft /> : <ChevronRight />}
            </button>

            {isExpanded && <>
                <div className="h-20 flex items-center justify-between w-full px-6">
                    <Link href={Routes.Home} className="flex items-center gap-3">
                        <PsychologyOutlined className="text-blue-500" />
                        {isExpanded && <span className="font-semibold text-lg">QA Platform</span>}
                    </Link>
                </div>

                <nav className="w-full flex flex-col p-4 space-y-2">
                    <div className="space-y-1">
                        <Link href={Routes.Home}
                            className={`h-10 px-4 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-colors
                        ${pathname === Routes.Home ? theme.selected : ''}`}>
                            <HomeOutlined fontSize="small" />
                            <span>Home</span>
                        </Link>

                        <Link href={Routes.Questions}
                            className={`h-10 px-4 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-colors
                        ${pathname === Routes.Questions ? theme.selected : ''}`}>
                            <QuestionMarkSharp fontSize="small" />
                            <span>Questions</span>
                        </Link>

                        <Link href={Routes.Tags}
                            className={`h-10 px-4 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-colors
                        ${pathname === Routes.Tags ? theme.selected : ''}`}>
                            <TagOutlined />
                            <span>Tags</span>
                        </Link>
                    </div>

                    <div className="space-y-1 pt-4">
                        <Link href={Routes.Collections}
                            className={`h-10 px-4 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-colors
                        ${pathname === Routes.Collections ? theme.selected : ''}`}>
                            <CollectionsOutlined />
                            <span>Collections</span>
                        </Link>

                        <Link href={Routes.Bookmarks}
                            className={`h-10 px-4 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-colors
                        ${pathname === Routes.Bookmarks ? theme.selected : ''}`}>
                            <BookmarksOutlined fontSize="small" />
                            <span>Bookmarks</span>
                        </Link>

                        <Link href={'/community'}
                            className={`h-10 px-4 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-colors
                        ${pathname === '/community' ? theme.selected : ''}`}>
                            <Language fontSize="small" />
                            <span>Community</span>
                        </Link>
                    </div>

                    <AdminPrivilege>
                        <div className="pt-4">
                            <div className="border-t border-[var(--border-color)] pt-4">
                                <Link href={'/admin'}
                                    className={`h-10 px-4 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-colors
                                ${pathname === '/admin' ? theme.selected : ''}`}>
                                    <AdminPanelSettings fontSize="small" />
                                    <span>Admin</span>
                                </Link>
                            </div>
                        </div>
                    </AdminPrivilege>

                    <div className="mt-auto pt-4">
                        <button onClick={logOut}
                            className="h-10 px-4 flex items-center gap-3 w-full rounded-lg text-red-500 hover:bg-[var(--hover-background)] transition-colors">
                            <Logout fontSize="small" />
                            <span>Logout</span>
                        </button>
                    </div>
                </nav>
            </>}
        </aside>
    );
}