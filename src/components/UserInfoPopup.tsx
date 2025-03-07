import { AuthorResponse } from "@/types/types";
import { Avatar, Popover } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function UserInfoPopup({ user, className, element = 'a' }: { user: AuthorResponse, className?: string, element?: string }) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const Inner = (
        <>
            <div
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                className="text-blue-600 hover:text-blue-800 cursor-pointer">
                {user.username}
            </div>

            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                    '& .MuiPaper-root': {
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <div className="p-6 min-w-[320px]">
                    <div className="flex items-center gap-4 mb-4">
                        <Avatar
                            src={user.profilePicture}
                            sx={{ width: 64, height: 64 }}
                        />
                        <div>
                            <div className="text-lg font-semibold">{user.username}</div>
                            <div className="text-sm text-gray-600 mt-1">Member</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium">
                            <div className="text-gray-900">{user.reputation}</div>
                            <div className="text-gray-500">Reputation</div>
                        </div>
                    </div>
                </div>
            </Popover>
        </>
    )

    return (
        <>
            {element === 'a' ? (
                <Link href={`/profile/${user.username}`} className={className}>
                    {Inner}
                </Link>)
                : React.createElement(element, {
                    className: className
                }, Inner)}
        </>
    );
}