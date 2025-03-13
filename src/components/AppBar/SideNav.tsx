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
        "selected": 'bg-blue-100 font-semibold text-blue-500'
    }

    return (
        <>
            <aside className="flex flex-col 
                items-center text-gray-700 h-full
                rounded-r-3xl
                w-56
                max-h-[calc(100vh-var(--appbar-height)*2)]">
                <div className="h-16 flex items-center w-full px-4">
                    <Link href={Routes.Home} className="flex items-center gap-3">
                        <PsychologyOutlined />
                        <span className="font-medium">QA Platform</span>
                    </Link>
                </div>

                <ul className="w-full flex flex-col h-[calc(100vh-var(--appbar-height)-4rem)]">
                    <li>
                        <Link href={Routes.Home}
                            className={`h-12 px-4 flex items-center gap-3 w-full hover:bg-gray-100 
                            ${pathname === Routes.Home ? theme.selected : ''}`}>
                            <HomeOutlined fontSize="small" />
                            <span>Home</span>
                        </Link>
                    </li>

                    <li>
                        <Link href={Routes.Questions}
                            className={`h-12 px-4 flex items-center gap-3 w-full hover:bg-gray-100
                            ${pathname === Routes.Questions ? theme.selected : ''}`}>
                            <QuestionMarkSharp fontSize="small" />
                            <span>Questions</span>
                        </Link>
                    </li>

                    <li>
                        <Link href={Routes.Tags}
                            className={`h-12 px-4 flex items-center gap-3 w-full hover:bg-gray-100
                            ${pathname === Routes.Tags ? theme.selected : ''}`}>
                            <TagOutlined />
                            <span>Tags</span>
                        </Link>
                    </li>

                    <li>
                        <Link href={Routes.Collections}
                            className={`h-12 px-4 flex items-center gap-3 w-full hover:bg-gray-100
                            ${pathname === Routes.Collections ? theme.selected : ''}`}>
                            <CollectionsOutlined />
                            <span>Collections</span>
                        </Link>
                    </li>

                    <li>
                        <Link href={Routes.Bookmarks}
                            className={`h-12 px-4 flex items-center gap-3 w-full hover:bg-gray-100
                            ${pathname === Routes.Bookmarks ? theme.selected : ''}`}>
                            <BookmarksOutlined fontSize="small" />
                            <span>Bookmarks</span>
                        </Link>
                    </li>

                    <li>
                        <Link href={'/community'}
                            className={`h-12 px-4 flex items-center gap-3 w-full hover:bg-gray-100
                            ${pathname === '/community' ? theme.selected : ''}`}>
                            <Language fontSize="small" />
                            <span>Community</span>
                        </Link>
                    </li>

                    <AdminPrivilege>
                        <hr className="mx-4" />
                        <li>
                            <Link href={'/admin'}
                                className={`h-12 px-4 flex items-center gap-3 w-full hover:bg-gray-100
                                ${pathname === 'admin' ? theme.selected : ''}`}>
                                <AdminPanelSettings fontSize="small" />
                                <span>Admin</span>
                            </Link>
                        </li>
                    </AdminPrivilege>

                    <li className="mt-auto border-t">
                        <button onClick={logOut}
                            className="h-12 px-4 flex items-center gap-3 w-full text-red-500 hover:bg-gray-100">
                            <Logout fontSize="small" />
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </aside>
        </>
    );
}