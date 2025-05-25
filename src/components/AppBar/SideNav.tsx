import useLogout from "@/helpers/logout-hook";
import { Routes } from "@/utilities/Constants";
import { AdminPanelSettings, BookmarksOutlined, BuildOutlined, ChevronLeft, ChevronRight, CollectionsOutlined, HomeOutlined, Language, Logout, PsychologyOutlined, QuestionMarkSharp, TagOutlined } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AdminPrivilege from "../Privilege/AdminPrivilege";
import ModeratorPrivilege from "../Privilege/ModeratorPrivilege";

export default function SideNav() {
    const pathname = usePathname();
    const logOut = useLogout();
    const [isExpanded, setIsExpanded] = useState(true);

    const theme = {
        "selected": 'bg-[var(--hover-background)] font-medium'
    }

    return (
        <aside
            className={`flex-col 
            hidden md:flex
            items-center text-[var(--text-primary)] h-full
            ${isExpanded ? 'w-[var(--left-nav-expanded-width)]' : 'w-4'} 
            border-r border-[var(--border-color)]
            fixed left-0 top-[var(--appbar-height)]
            bg-[var(--nav-background)]
            transition-width
            z-50
            `}
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-[var(--nav-background)] 
                border border-[var(--border-color)] flex items-center justify-center
                hover:bg-[var(--hover-background)] transition-colors z-50 shadow-sm"
            >
                {isExpanded ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
            </button>

            {isExpanded && <>
                <div className="h-14 flex items-center justify-between w-full px-4">
                    <div className="flex items-center gap-2">
                        <PsychologyOutlined className="text-blue-500" fontSize="small" />
                        {isExpanded && <span className="font-medium text-base">QA Platform</span>}
                    </div>
                </div>

                <nav className="w-full flex flex-col p-2 space-y-1">
                    <div className="space-y-0.5 border-white">
                        <Link href={Routes.Home}
                            className={`h-8 px-3 flex items-center gap-2 w-full rounded-md hover:bg-[var(--hover-background)] transition-colors text-sm
                        ${pathname === Routes.Home ? theme.selected : ''}`}>
                            <HomeOutlined fontSize="small" />
                            <span>Home</span>
                        </Link>

                        <Link href={Routes.Questions}
                            className={`h-8 px-3 flex items-center gap-2 w-full rounded-md hover:bg-[var(--hover-background)] transition-colors text-sm
                        ${pathname === Routes.Questions ? theme.selected : ''}`}>
                            <QuestionMarkSharp fontSize="small" />
                            <span>Questions</span>
                        </Link>

                        <Link href={Routes.Tags}
                            className={`h-8 px-3 flex items-center gap-2 w-full rounded-md hover:bg-[var(--hover-background)] transition-colors text-sm
                        ${pathname === Routes.Tags ? theme.selected : ''}`}>
                            <TagOutlined fontSize="small" />
                            <span>Tags</span>
                        </Link>

                        <Link href={Routes.Collections}
                            className={`h-8 px-3 flex items-center gap-2 w-full rounded-md hover:bg-[var(--hover-background)] transition-colors text-sm
                        ${pathname === Routes.Collections ? theme.selected : ''}`}>
                            <CollectionsOutlined fontSize="small" />
                            <span>Collections</span>
                        </Link>

                        <Link href={Routes.Bookmarks}
                            className={`h-8 px-3 flex items-center gap-2 w-full rounded-md hover:bg-[var(--hover-background)] transition-colors text-sm
                        ${pathname === Routes.Bookmarks ? theme.selected : ''}`}>
                            <BookmarksOutlined fontSize="small" />
                            <span>Bookmarks</span>
                        </Link>

                        <Link href={'/community'}
                            className={`h-8 px-3 flex items-center gap-2 w-full rounded-md hover:bg-[var(--hover-background)] transition-colors text-sm
                        ${pathname === '/community' ? theme.selected : ''}`}>
                            <Language fontSize="small" />
                            <span>Community</span>
                        </Link>
                    </div>

                    <AdminPrivilege>
                        <div className="pt-2">
                            <div className="border-t border-[var(--border-color)] pt-2">
                                <Link href={'/admin'}
                                    className={`h-8 px-3 flex items-center gap-2 w-full rounded-md hover:bg-[var(--hover-background)] transition-colors text-sm
                                ${pathname === '/admin' ? theme.selected : ''}`}>
                                    <AdminPanelSettings fontSize="small" />
                                    <span>Admin</span>
                                </Link>
                            </div>
                        </div>
                    </AdminPrivilege>

                    <ModeratorPrivilege>
                        <Link href={'/moderator'}
                            className={`h-8 px-3 flex items-center gap-2 w-full rounded-md hover:bg-[var(--hover-background)] transition-colors text-sm
                                ${pathname === '/moderator' ? theme.selected : ''}`}>
                            <BuildOutlined fontSize="small" />
                            <span>Moderator</span>
                        </Link>
                    </ModeratorPrivilege>

                    <div className="mt-auto pt-2">
                        <button onClick={logOut}
                            className="h-8 px-3 flex items-center gap-2 w-full rounded-md text-red-500 hover:bg-[var(--hover-background)] transition-colors text-sm">
                            <Logout fontSize="small" />
                            <span>Logout</span>
                        </button>
                    </div>
                </nav>
            </>}
        </aside>
    );
}