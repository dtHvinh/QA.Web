import { Routes } from "@/utilities/Constants";
import { Bookmark, Logout, Psychology, PsychologyOutlined, QuestionMarkSharp } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LightTooltip } from "../LightToolTip";
import AlertDialog from "../AlertDialog";
import useLogout from "@/helpers/logout-hook";
import { useState } from "react";

export default function SideNav() {
    const pathname = usePathname();
    const logOut = useLogout();

    const theme = {
        "selected": 'bg-gray-200 font-semibold'
    }

    return (
        <>
            <aside className="flex flex-col 
                items-center bg-white text-gray-700 h-full border-gray-300
                shadow-lg
                rounded-r-3xl
                max-h-[calc(100vh-var(--appbar-height)*2)]">
                <div className="h-16 flex items-center w-full">
                    <Link href={Routes.Home} className="h-6 w-6 mx-auto">
                        <PsychologyOutlined />
                    </Link>
                </div>

                <ul className="w-full flex flex-col h-[calc(100vh-var(--appbar-height)-4rem)]">
                    <li>
                        <Tooltip title='Home' placement="right" arrow>
                            <Link href={Routes.Home}
                                className={`h-16 px-6 flex justify-center items-center w-full hover:bg-gray-100 
                        ${pathname === Routes.Home ? theme.selected : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                                </svg>
                            </Link>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip title='Question' placement="right" arrow>
                            <Link href={Routes.Questions}
                                className={`h-16 px-6 flex justify-center items-center w-full hover:bg-gray-100
                        ${pathname === Routes.Questions ? theme.selected : ''}`}>
                                <QuestionMarkSharp fontSize="small" />
                            </Link>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip title='Tags' placement="right" arrow>
                            <Link href={Routes.Tags}
                                className={`h-16 px-6 flex justify-center items-center w-full hover:bg-gray-100
                            ${pathname === Routes.Tags ? theme.selected : ''}`}>
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M9.24 1a3 3 0 0 0-2.12.88l-5.7 5.7a2 2 0 0 0-.38 2.31 3 3 0 0 1 .67-1.01l6-6A3 3 0 0 1 9.83 2H14a3 3 0 0 1 .79.1A2 2 0 0 0 13 1z" opacity=".4"></path>
                                    <path d="M9.83 3a2 2 0 0 0-1.42.59l-6 6a2 2 0 0 0 0 2.82L6.6 16.6a2 2 0 0 0 2.82 0l6-6A2 2 0 0 0 16 9.17V5a2 2 0 0 0-2-2zM12 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4"></path>
                                </svg>
                            </Link>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip title='Collections' placement="right" arrow>
                            <Link href={Routes.Collections}
                                className={`h-16 px-6 flex justify-center items-center w-full hover:bg-gray-100
                        ${pathname === Routes.Collections ? theme.selected : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3m2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1" />
                                </svg>
                            </Link>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip title='Bookmarks' placement="right" arrow>
                            <Link href={Routes.Bookmarks}
                                className={`h-16 px-6 flex justify-center items-center w-full hover:bg-gray-100
                                ${pathname === Routes.Bookmarks ? theme.selected : ''}`}>
                                <Bookmark fontSize="small" />
                            </Link>
                        </Tooltip>
                    </li>

                    <li className="mt-auto border-t">
                        <Tooltip title='Leave' placement="right" arrow>
                            <button onClick={logOut} className="h-16 px-6 flex justify-center items-center w-full text-red-500 hover:bg-red-200">
                                <Logout fontSize="small" />
                            </button>
                        </Tooltip>
                    </li>
                </ul>
            </aside>
        </>
    );
}