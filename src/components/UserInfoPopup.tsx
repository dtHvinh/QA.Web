import {AuthorResponse} from "@/types/types";
import React from "react";
import {Avatar, Popover} from "@mui/material";

export default function UserInfoPopup({user, className}: { user: AuthorResponse, className?: string }) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <div className={className}>
            <div
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}>
                {user.username}
            </div>

            <Popover
                id="mouse-over-popover"
                sx={{pointerEvents: 'none'}}
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
                <div className="p-3">
                    <div className="flex items-center justify-between mb-2 min-w-[300px]">
                        <div>
                            <Avatar src={user.profilePicture}/>
                        </div>
                    </div>
                    <div className="text-base font-semibold leading-none">
                        <div>{user.username}</div>
                    </div>
                    <div className="my-4 text-sm">Reputation: {user.reputation}
                    </div>
                </div>
            </Popover>
        </div>
    );
}