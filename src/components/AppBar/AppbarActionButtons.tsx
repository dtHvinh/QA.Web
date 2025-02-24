import { AdminPanelSettings, AutoStories } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { SvgIcon, Tooltip } from "@mui/material";
import Link from "next/link";
import ChatBot from "../ChatBot";
import AdminPrivilege from "../Privilege/AdminPrivilege";

export default function AppbarActionButtons({ className }: { className?: string }) {
    return (
        <div className={`${className} flex-grow gap-5`}>
            <AdminPrivilege>
                <Tooltip title={'Admin Panel'}>
                    <Link href={'/admin'}
                        className="text-sm text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors active:scale-95">
                        <AdminPanelSettings />
                    </Link>
                </Tooltip>
            </AdminPrivilege>

            <Tooltip title={'New Question'}>
                <Link href={'/new-question'}
                    className="text-sm text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors active:scale-95">
                    <AddIcon />
                </Link>
            </Tooltip>

            <Tooltip title={'Search'}>
                <Link href={'/search'}
                    className="text-sm block text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors active:scale-95">
                    <SearchIcon />
                </Link>
            </Tooltip>

            <Tooltip title={'Ask ai'}>
                <ChatBot className="text-sm block text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors active:scale-95" />
            </Tooltip>

            <Tooltip title={'Your questions'}>
                <Link href={'/your-questions'}
                    className="text-sm block text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors active:scale-95">
                    <AutoStories />
                </Link>
            </Tooltip>

            <Tooltip title={'Your Collections'}>
                <Link href={'/your-collections'}
                    className="text-sm block text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors active:scale-95">
                    <SvgIcon fontSize={'medium'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path
                                d="M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3m2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1" />
                        </svg>
                    </SvgIcon>
                </Link>
            </Tooltip>
        </div>
    );
}