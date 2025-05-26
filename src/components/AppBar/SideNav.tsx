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
        "selected": 'bg-[var(--primary-light)] text-[var(--primary)] font-semibold shadow-sm'
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
            transition-all duration-300 ease-in-out
            z-50
            shadow-lg
            `}
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -right-3 top-6 w-7 h-7 rounded-full bg-[var(--nav-background)] 
                border-2 border-[var(--border-color)] flex items-center justify-center
                hover:bg-[var(--hover-background)] hover:border-[var(--primary)] transition-all duration-200 z-50 shadow-md
                hover:scale-105"
            >
                {isExpanded ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
            </button>

            {isExpanded && (
                <div className="w-full h-full flex flex-col">
                    {/* Header */}
                    <div className="h-16 flex items-center justify-center w-full px-4 border-b border-[var(--border-color)] bg-gradient-to-r from-[var(--primary-light)] to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-sm">
                                <PsychologyOutlined className="text-white" fontSize="small" />
                            </div>
                            <span className="font-bold text-lg text-[var(--text-primary)]">
                                QA Platform
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="w-full flex flex-col p-3 space-y-2 flex-1">
                        <div className="space-y-1">
                            <div className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider px-3 py-2">
                                Main
                            </div>

                            <Link href={Routes.Home}
                                className={`h-10 px-3 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-all duration-200 text-sm group
                            ${pathname === Routes.Home ? theme.selected : 'hover:translate-x-1'}`}>
                                <HomeOutlined fontSize="small" className="group-hover:scale-110 transition-transform" />
                                <span>Home</span>
                            </Link>

                            <Link href={Routes.Questions}
                                className={`h-10 px-3 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-all duration-200 text-sm group
                            ${pathname === Routes.Questions ? theme.selected : 'hover:translate-x-1'}`}>
                                <QuestionMarkSharp fontSize="small" className="group-hover:scale-110 transition-transform" />
                                <span>Questions</span>
                            </Link>

                            <Link href={Routes.Tags}
                                className={`h-10 px-3 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-all duration-200 text-sm group
                            ${pathname === Routes.Tags ? theme.selected : 'hover:translate-x-1'}`}>
                                <TagOutlined fontSize="small" className="group-hover:scale-110 transition-transform" />
                                <span>Tags</span>
                            </Link>

                            <Link href={Routes.Collections}
                                className={`h-10 px-3 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-all duration-200 text-sm group
                            ${pathname === Routes.Collections ? theme.selected : 'hover:translate-x-1'}`}>
                                <CollectionsOutlined fontSize="small" className="group-hover:scale-110 transition-transform" />
                                <span>Collections</span>
                            </Link>

                            <Link href={Routes.Bookmarks}
                                className={`h-10 px-3 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-all duration-200 text-sm group
                            ${pathname === Routes.Bookmarks ? theme.selected : 'hover:translate-x-1'}`}>
                                <BookmarksOutlined fontSize="small" className="group-hover:scale-110 transition-transform" />
                                <span>Bookmarks</span>
                            </Link>

                            <Link href={'/community'}
                                className={`h-10 px-3 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-all duration-200 text-sm group
                            ${pathname === '/community' ? theme.selected : 'hover:translate-x-1'}`}>
                                <Language fontSize="small" className="group-hover:scale-110 transition-transform" />
                                <span>Community</span>
                            </Link>
                        </div>

                        {/* Admin Section */}
                        <AdminPrivilege>
                            <div className="pt-4">
                                <div className="border-t border-[var(--border-color)] pt-4">
                                    <div className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider px-3 py-2">
                                        Administration
                                    </div>
                                    <Link href={'/admin'}
                                        className={`h-10 px-3 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-all duration-200 text-sm group
                                    ${pathname === '/admin' ? theme.selected : 'hover:translate-x-1'}`}>
                                        <AdminPanelSettings fontSize="small" className="group-hover:scale-110 transition-transform" />
                                        <span>Admin Panel</span>
                                    </Link>
                                </div>
                            </div>
                        </AdminPrivilege>

                        {/* Moderator Section */}
                        <ModeratorPrivilege>
                            <div className={`${pathname.startsWith('/admin') ? '' : 'pt-4 border-t border-[var(--border-color)]'}`}>
                                {!pathname.startsWith('/admin') && (
                                    <div className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider px-3 py-2">
                                        Moderation
                                    </div>
                                )}
                                <Link href={'/moderator'}
                                    className={`h-10 px-3 flex items-center gap-3 w-full rounded-lg hover:bg-[var(--hover-background)] transition-all duration-200 text-sm group
                                    ${pathname === '/moderator' ? theme.selected : 'hover:translate-x-1'}`}>
                                    <BuildOutlined fontSize="small" className="group-hover:scale-110 transition-transform" />
                                    <span>Moderator Tools</span>
                                </Link>
                            </div>
                        </ModeratorPrivilege>

                        {/* Logout Section */}
                        <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
                            <button onClick={logOut}
                                className="h-10 px-3 flex items-center gap-3 w-full rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-sm group hover:translate-x-1">
                                <Logout fontSize="small" className="group-hover:scale-110 transition-transform" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </aside>
    );
}