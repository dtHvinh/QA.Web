import { formatTimeString } from "@/helpers/time-utils";
import { fromImage } from "@/helpers/utils";
import { ChatMessageResponse } from "@/types/types";
import { Avatar } from "@mui/material";
import Link from "next/link";

interface MessageProps {
    message: ChatMessageResponse;
    isCurrentUser: boolean;
    showAvatar: boolean;
}

export default function ChatRoomMessage({ message: msg, isCurrentUser, showAvatar }: MessageProps) {

    return (
        <div
            className="group relative px-2 dark:hover:bg-gray-700 hover:bg-gray-200  py-1"
        >
            {/* <div className="hidden [&>*>*]:text-white group-hover:flex absolute right-2 -top-3 gap-1 rounded-full bg-black px-4 z-50">
                <IconButton size="small" >
                    <EmojiEmotions className="text-[var(--text-primary)]" fontSize="small" />
                </IconButton>
                <IconButton size="small">
                    <MoreHoriz className="text-[var(--text-primary)]" fontSize="small" />
                </IconButton>
            </div> */}

            <div className="flex items-center gap-3 w-full">
                {showAvatar ? (
                    <Avatar
                        src={fromImage(msg.author.profilePicture)}
                        alt={msg.author.username}
                        sx={{
                            width: 40,
                            height: 40,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    />
                ) : (
                    <div className="w-[38px]"></div>
                )}

                <div className="flex-1 min-w-0 [&>*]:text-sm">
                    {showAvatar && (
                        <div className="flex items-center gap-2 mb-1">
                            <Link href={`/profile/${msg.author.username}`} className="font-medium text-[var(--text-primary)] hover:underline">
                                {isCurrentUser ? 'You' : msg.author.username}
                            </Link>
                            <span className="text-xs text-[var(--text-tertiary)]">
                                {formatTimeString(msg.createdAt)}
                            </span>
                        </div>
                    )}

                    <div
                        className="text-[var(--text-primary)] whitespace-pre-wrap break-words text-[15px]"
                        dangerouslySetInnerHTML={{ __html: msg.message }}
                    />
                </div>
            </div>
        </div>
    );
}