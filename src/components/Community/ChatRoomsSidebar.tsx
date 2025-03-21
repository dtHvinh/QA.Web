import getAuth from "@/helpers/auth-utils";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { isScrollBottom } from "@/helpers/utils";
import { ChatRoomResponse, CommunityDetailResponse } from "@/types/types";
import { Add, ForumOutlined, Settings } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useRef, useState } from "react";
import UserCommunityInfoBottom from "./UserCommunityInfoBottom";

interface ChatRoomsSidebarProps {
    className?: string;
    rooms: ChatRoomResponse[];
    isOwner: boolean;
    isModerator: boolean;
    communityId: number;
    selectedRoomId: number | null;
    communityDetail: CommunityDetailResponse,
    onRoomClick: (room: ChatRoomResponse) => void;
    onCreateRoomClick: () => void;
    onRoomSettingsClick: (room: ChatRoomResponse) => void;
    onRoomLoaded: (rooms: ChatRoomResponse[]) => void;
}

export default function ChatRoomsSidebar({
    className,
    rooms,
    isOwner,
    isModerator,
    communityId,
    selectedRoomId,
    onRoomClick,
    onCreateRoomClick,
    onRoomSettingsClick,
    communityDetail,
    onRoomLoaded
}: ChatRoomsSidebarProps) {
    const [hasMoreRoom, setHasMoreRoom] = useState(true);
    const [isRoomLoading, setIsRoomLoading] = useState(false);
    const [roomPageIndex, setRoomPageIndex] = useState(3);
    const roomDisplayRef = useRef<HTMLDivElement>(null);
    const auth = getAuth();

    const handleRoomScroll = async () => {
        if (!hasMoreRoom || !roomDisplayRef.current || !isScrollBottom(roomDisplayRef.current)) {
            return;
        }

        setIsRoomLoading(true);
        try {
            const response = await getFetcher([
                `/api/community/room/${communityId}/?pageIndex=${roomPageIndex}&pageSize=${10}`,
                auth!.accessToken
            ]) as ChatRoomResponse[];

            if (!IsErrorResponse(response)) {
                setRoomPageIndex(prev => prev + 1);
                setHasMoreRoom(response.length === 10);
                onRoomLoaded(response);
            }
        } finally {
            setIsRoomLoading(false);
        }
    };

    return (
        <div className={`${className} md:w-80 mr-[var(--community-right-sidebar-width)] bg-[var(--card-background)] border-l 
                        border-[var(--border-color)] flex flex-col
                        h-[calc(100vh-calc(var(--appbar-height)*2))]`}>
            <div className="p-4 border-b border-[var(--border-color)] h-[73px]">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-lg text-[var(--text-primary)]">Chat Rooms</span>
                    {(isOwner || isModerator) && (
                        <Tooltip title="Create Room">
                            <IconButton
                                className="bg-[var(--primary)] hover:bg-[var(--primary-darker)]"
                                onClick={onCreateRoomClick}
                            >
                                <Add className="text-[var(--text-primary)]" />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
            </div>

            <div ref={roomDisplayRef} onScroll={handleRoomScroll} className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-2">
                    {rooms.map(room => (
                        <div key={room.id} className="flex items-center gap-2">
                            <button
                                onClick={() => onRoomClick(room)}
                                className={`flex-1 flex items-center gap-3 px-4 py-2 rounded-md transition-all
                                    ${selectedRoomId === room.id
                                        ? 'text-white bg-[var(--secondary)]'
                                        : 'text-[var(--text-primary)] hover:bg-[var(--hover-background)]'
                                    }`}
                            >
                                <ForumOutlined />
                                <span className="truncate font-medium">{room.name}</span>
                            </button>
                            {(isOwner || isModerator) && room.name !== 'global' && (
                                <IconButton
                                    size="small"
                                    onClick={() => onRoomSettingsClick(room)}
                                    className="text-[var(--text-secondary)] hover:bg-[var(--hover-background)]"
                                >
                                    <Settings fontSize="small" className="text-[var(--text-primary)]" />
                                </IconButton>
                            )}
                        </div>
                    ))}
                    {isRoomLoading && (
                        <div className="flex justify-center py-2 bg-[var(--card-border)] rounded-full">
                            <div className="w-6 h-6 border-2 border-[var(--text-primary)] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>

            <UserCommunityInfoBottom communityDetail={communityDetail} />
        </div>
    );
}