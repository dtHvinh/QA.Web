import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { isScrollBottom } from "@/helpers/utils";
import { ChatRoomResponse, CommunityDetailResponse } from "@/types/types";
import { Add, Settings } from "@mui/icons-material";
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

    const handleRoomScroll = async () => {
        if (!hasMoreRoom || !roomDisplayRef.current || !isScrollBottom(roomDisplayRef.current)) {
            return;
        }

        setIsRoomLoading(true);
        try {
            const response = await getFetcher(`/api/community/room/${communityId}/?pageIndex=${roomPageIndex}&pageSize=${10}`) as ChatRoomResponse[];

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
        <div className={`md:w-60 mr-[var(--community-right-sidebar-width)] bg-[var(--card-background)] border-l 
                        border-[var(--border-color)] flex flex-col
                        h-[calc(100vh-calc(var(--appbar-height)))] ${className}`}>
            <div className="p-4 border-b border-[var(--border-color)] h-[59px] flex items-center">
                <div className="flex-1 flex items-center justify-between gap-4">
                    <span className="font-medium text-lg text-[var(--text-primary)]">Chat Rooms</span>
                    {(isOwner || isModerator) && (
                        <Tooltip title="Create Room">
                            <IconButton
                                size="small"
                                className="bg-[var(--primary)] hover:bg-[var(--primary-darker)]"
                                onClick={onCreateRoomClick}
                            >
                                <Add className="text-[var(--text-primary)]" />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
            </div>

            <div ref={roomDisplayRef} onScroll={handleRoomScroll} className="flex-1 overflow-y-auto text-sm">
                <div className="p-4 space-y-2">
                    {rooms.map(room => (
                        <div key={room.id} className="flex items-center gap-2">
                            <button
                                onClick={() => onRoomClick(room)}
                                className={`flex-1 flex items-center gap-2 px-4 h-8 rounded-md transition-all
                                    ${selectedRoomId === room.id
                                        ? 'text-white bg-violet-500'
                                        : 'text-[var(--text-primary)] hover:bg-[var(--hover-background)]'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
                                </svg>
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