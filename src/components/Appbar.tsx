'use client'

import {AppName, Routes} from "@/utilities/Constants";
import Link from "next/link";
import {usePathname} from "next/navigation";
import UserDropdown from "./UserDropdown";
import AdminPrivilege from "@/components/AdminPrivilege";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import {Tooltip} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import {AutoAwesome} from "@mui/icons-material";

export default function Appbar() {
    const currentPath = usePathname();

    return (
        !currentPath.startsWith('/auth') &&
        <div className="flex flex-col md:flex-row items-center justify-between py-4 w-full md:h-[var(--appbar-height)]">
            <div className="gap-4 flex items-center w-full md:w-auto justify-between md:justify-start">
                <Link href={'/'} className="text-2xl">
                    {AppName}
                </Link>
            </div>

            <div className="flex gap-4 items-center mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                <AdminPrivilege>
                    <Tooltip title={'You are an admin'}>
                        <AdminPanelSettingsIcon/>
                    </Tooltip>
                </AdminPrivilege>

                <Link href={Routes.NewQuestion}
                      className="text-sm text-gray-600 hover:bg-gray-300 p-2 rounded-full transition-colors active:scale-95">
                    <AddIcon/>
                </Link>

                <Tooltip title={'Search'}>
                    <Link href={'/search'}
                          className="text-sm block text-gray-700 hover:bg-gray-300 p-2 rounded-full transition-colors active:scale-95">
                        <SearchIcon/>
                    </Link>
                </Tooltip>

                <Tooltip title={'Ask ai'}>
                    <Link href={'/chatbot'}
                          className="text-sm block text-gray-700 hover:bg-gray-300 p-2 rounded-full transition-colors active:scale-95">
                        <AutoAwesome/>
                    </Link>
                </Tooltip>

                <UserDropdown/>
            </div>
        </div>
    )
}