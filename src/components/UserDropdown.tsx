'use client'

import getAuth from "@/helpers/auth-utils";
import { Routes } from "@/utilities/Constants";
import { Add, AutoStories } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, Popover, SvgIcon } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ChatBot from "./ChatBot";

export default function UserDropdown() {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [profileImage, setProfileImage] = useState('');
    const buttonStyle = "flex gap-2 items-center text-sm py-2 px-4 rounded-l-lg hover:bg-[var(--hover-background)] transition";
    const selectedStyle = "text-[var(--text-primary)] font-semibold bg-[var(--hover-background)]";
    const pathname = usePathname();
    const auth = getAuth();

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
                className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95 text-[var(--text-primary)]">
                <AccountCircleIcon fontSize="large" />
            </button>
            <Popover id={id}
                open={open}
                onClose={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '8px',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                        marginTop: '8px',
                        backgroundColor: 'var(--card-background)',
                    }
                }}
            >
                <div className="w-[280px] py-2 divide-y divide-[var(--border-color)]">
                    <div className="px-2 py-2">
                        <Link onClick={handleClose} href={'/profile'}
                            className="flex items-center p-2 rounded-lg hover:bg-[var(--hover-background)] transition-colors">
                            <Avatar src={profileImage} alt="Profile" sx={{ width: 40, height: 40 }} />
                            <div className="ml-3">
                                {auth &&
                                    <div className="font-semibold text-[15px] text-[var(--text-primary)]">{auth?.username}</div>
                                }
                                <div className="text-sm text-[var(--text-secondary)]">View your profile</div>
                            </div>
                        </Link>
                    </div>

                    <div className="block md:hidden px-2 py-2">
                        {/* Navigation links - update classes */}
                        <Link onClick={handleClose} href={Routes.Home}
                            className={`${buttonStyle} ${pathname === Routes.Home ? selectedStyle : "text-[var(--text-primary)]"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path
                                    d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                            </svg>
                            Home
                        </Link>
                        <Link onClick={handleClose} href={Routes.Questions}
                            className={`${buttonStyle} ${pathname === Routes.Questions ? selectedStyle : "text-[var(--text-primary)]"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path
                                    d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
                            </svg>
                            Questions
                        </Link>
                        <Link onClick={handleClose} href={Routes.Tags} className={`${buttonStyle} ${pathname === Routes.Tags ? selectedStyle : "text-[var(--text-primary)]"}`}>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 18 18">
                                <path
                                    d="M9.24 1a3 3 0 0 0-2.12.88l-5.7 5.7a2 2 0 0 0-.38 2.31 3 3 0 0 1 .67-1.01l6-6A3 3 0 0 1 9.83 2H14a3 3 0 0 1 .79.1A2 2 0 0 0 13 1z"
                                    opacity=".4"></path>
                                <path
                                    d="M9.83 3a2 2 0 0 0-1.42.59l-6 6a2 2 0 0 0 0 2.82L6.6 16.6a2 2 0 0 0 2.82 0l6-6A2 2 0 0 0 16 9.17V5a2 2 0 0 0-2-2zM12 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4"></path>
                            </svg>
                            Tags
                        </Link>
                        <Link onClick={handleClose} href={Routes.Collections}
                            className={`${buttonStyle} ${pathname === Routes.Collections ? selectedStyle : "text-[var(--text-primary)]"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path
                                    d="M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3m2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1" />
                            </svg>
                            Collections
                        </Link>

                        <Link onClick={handleClose} href={Routes.Bookmarks}
                            className={`${buttonStyle} ${pathname === Routes.Bookmarks ? selectedStyle : "text-[var(--text-primary)]"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path
                                    d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                            </svg>
                            Bookmarks
                        </Link>
                        <hr className="mt-4 border-[var(--border-color)]" />
                    </div>

                    <div className="block px-4 py-2 mb-1">
                        <Link onClick={handleClose} href={"/new-question"}
                            className={`${buttonStyle} ${pathname === "/new-question" ? selectedStyle : "text-[var(--text-primary)]"}`}>
                            <Add className="text-[var(--text-primary)]" />
                            <div>New Question</div>
                        </Link>

                        <Link onClick={handleClose} href={"/your-questions"}
                            className={`${buttonStyle} ${pathname === "/your-questions" ? selectedStyle : "text-[var(--text-primary)]"}`}>
                            <AutoStories />
                            <div>Your Questions</div>
                        </Link>

                        <Link onClick={handleClose} href={"/your-collections"}
                            className={`${buttonStyle} ${pathname === "/your-collections" ? selectedStyle : "text-[var(--text-primary)]"}`}>
                            <SvgIcon fontSize={"medium"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" fill="currentColor"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3m2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1" />
                                </svg>
                            </SvgIcon>
                            <div>Your Collections</div>
                        </Link>

                        <div className={`${buttonStyle} hidden`}>
                            <ChatBot className="flex items-center gap-2" />
                        </div>
                    </div>
                </div>
            </Popover >
        </div >
    )
}