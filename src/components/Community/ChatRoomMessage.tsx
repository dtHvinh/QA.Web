import timeFromNow from "@/helpers/time-utils";
import { fromImage } from "@/helpers/utils";
import { ChatMessageResponse } from "@/types/types";
import { MoreHoriz, Reply } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { useState } from "react";

interface MessageProps {
    message: ChatMessageResponse;
    isCurrentUser: boolean;
    showAvatar: boolean;
}

export default function ChatRoomMessage({ message: msg, isCurrentUser, showAvatar }: MessageProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative px-2 py-2 hover:bg-gray-700 rounded-md transition-colors"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && (
                <div className="absolute right-2 -top-3 flex gap-1 rounded-full bg-[var(--background)] px-4">
                    <IconButton size="small" >
                        <Reply className="text-[var(--text-primary)]" fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                        <MoreHoriz className="text-[var(--text-primary)]" fontSize="small" />
                    </IconButton>
                </div>
            )}

            <div className="flex items-center gap-3 w-full">
                {showAvatar ? (
                    <Avatar
                        src={fromImage(msg.author.profilePicture)}
                        alt={msg.author.username}
                        sx={{
                            width: 38,
                            height: 38,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    />
                ) : (
                    <div className="w-[38px]"></div>
                )}

                <div className="flex-1 min-w-0">
                    {showAvatar && (
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-[var(--text-primary)]">
                                {isCurrentUser ? 'You' : msg.author.username}
                            </span>
                            <span className="text-xs text-[var(--text-tertiary)]">
                                {timeFromNow(msg.createdAt)}
                            </span>
                        </div>
                    )}

                    <div className="text-[var(--text-primary)] whitespace-pre-wrap break-words text-[15px]">
                        {msg.message}
                    </div>
                </div>
            </div>
        </div>
    );
}