'use client'

import useLogout from "@/helpers/logout-hook";
import React, { useEffect, useState } from "react";
import LeftNav from "./LeftNav";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from "next/link";
import { Avatar, Popover } from "@mui/material";
import AppbarActionButtons from "@/components/AppBar/AppbarActionButtons";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import getAuth from "@/helpers/auth-utils";

export default function UserDropdown() {
    const logout = useLogout();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [profileImage, setProfileImage] = useState('');

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const auth = getAuth();
        if (auth?.profilePicture)
            setProfileImage(auth.profilePicture);
    }, [])

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <button onClick={handleClick}
                className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95">
                <Avatar src={profileImage} alt="Image" sx={{ width: 32, height: 32 }} />
            </button>
            <Popover id={id}
                open={open}
                onClose={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div
                    className={`z-10 md:right-52 w-56 rounded-md`}>
                    <div role="menu" aria-orientation="vertical" aria-labelledby="dropdown-button">
                        <div className={'px-4 py-2 md:p-0'}>
                            <Link href={'/profile'}
                                className="flex items-center p-3 w-full text-left py-2 space-x-2.5 mb-1 text-sm text-gray-700 rounded-md bg-white hover:bg-gray-100">

                                <PersonIcon />
                                <div>Profile</div>
                            </Link>
                            <button onClick={logout}
                                className="flex items-center p-3 space-x-2.5 w-full text-left py-2 mb-1 text-sm text-gray-700 rounded-md bg-white hover:bg-gray-100"
                                role="menuitem">
                                <LogoutIcon />
                                <div>Logout</div>
                            </button>
                        </div>
                        <hr className="md:hidden mx-4" />
                        <div className="block md:hidden px-4 py-2 mb-1">
                            <LeftNav />
                        </div>

                        <AppbarActionButtons className={'flex md:hidden'} />
                    </div>
                </div>
            </Popover>
        </div>
    )
}