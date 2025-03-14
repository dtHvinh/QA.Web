import useLogout from "@/helpers/logout-hook";
import { Routes } from "@/utilities/Constants";
import { AdminPanelSettings, BookmarksOutlined, CollectionsOutlined, HomeOutlined, Language, Logout, PsychologyOutlined, QuestionMarkSharp, TagOutlined } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminPrivilege from "../Privilege/AdminPrivilege";

export default function SideNav() {
    const pathname = usePathname();
    const logOut = useLogout();

    const theme = {
        "selected": 'bg-[var(--hover-background)] font-semibold text-blue-500'
    }

    return (
        <aside className="flex flex-col 
            items-center text-[var(--text-primary)] h-full
            w-64
            border-r border-[var(--border-color)]
            bg-[var(--nav-background)]
            fixed left-0 top-[var(--appbar-height)]
            overflow-y-auto
            z-50
            max-h-[calc(100vh-var(--appbar-height))]">
            <div className="h-20 flex items-center w-full px-6 border-b border-[var(--border-color)]">
                <Link href={Routes.Home} className="flex items-center gap-3">
                    <PsychologyOutlined className="text-blue-500" />
                    <span className="font-semibold text-lg">QA Platform</span>
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
        </aside>
    );
}