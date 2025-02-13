'use client'

import useLogout from "@/helpers/logout-hook";
import {useState} from "react";
import LeftNav from "./LeftNav";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from "next/link";

export default function UserDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const logout = useLogout();

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)}
                    className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95">
                <AccountCircleIcon sx={{width: 32, height: 32}}/>
            </button>
            <div
                className={`${isOpen ? "" : "hidden"} z-10 origin-top-left shadow-xl border-[1px] absolute right-0 md:right-52 mt-2 w-56 rounded-md bg-white ring-1 ring-black ring-opacity-5`}>
                <div role="menu" aria-orientation="vertical" aria-labelledby="dropdown-button">
                    <div className={'px-4 py-2 md:p-0'}>
                        <Link href={'/profile'}
                              className="block p-3 w-full text-left py-2 mb-1 text-sm text-gray-700 rounded-md bg-white hover:bg-gray-100">
                            Profile
                        </Link>
                        <button onClick={logout}
                                className="p-3 w-full text-left py-2 mb-1 text-sm text-gray-700 rounded-md bg-white hover:bg-gray-100"
                                role="menuitem">
                            Logout
                        </button>
                    </div>
                    <hr className="md:hidden mx-4"/>
                    <div className="block md:hidden px-4 py-2 mb-1">
                        <LeftNav/>
                    </div>
                </div>
            </div>
        </div>
    )
}