'use client'

import Loading from "@/app/loading";
import ChatRoom from "@/components/Community/ChatRoom";
import CommunityInfo from "@/components/Community/CommunityInfo";
import CommunitySettings from "@/components/Community/CommunitySettings";
import CreateRoomDialog from "@/components/Community/CreateRoomDialog";
import ObjectNotfound from "@/components/Error/ObjectNotFound";
import getAuth from "@/helpers/auth-utils";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { fromImage } from "@/helpers/utils";
import { AuthorResponse } from "@/types/types";
import { Add, Forum, Info, People, Settings } from "@mui/icons-material";
import { Avatar, Badge, Chip, IconButton, Tooltip } from "@mui/material";
import { use, useState } from "react";
import useSWR from "swr";

export interface CommunityDetailResponse {
    id: number;
    name: string;
    description?: string;
    iconImage?: string;
    isPrivate: boolean;
    memberCount: number;
    rooms: ChatRoomResponse[];
    isOwner: boolean;
    isModerator: boolean;
}

export interface ChatRoomResponse {
    id: number;
    name: string;
    messages: ChatMessageResponse[];
}

export interface ChatMessageResponse {
    id: number;
    message: string;
    createdAt: string;
    updatedAt: string;
    user: AuthorResponse;
}

export default function CommunityDetailPage({ params }: { params: Promise<{ name: string }> }) {
    const { name: communityName } = use(params)
    const auth = getAuth();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [createRoomOpen, setCreateRoomOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);

    const { data: communityDetail, isLoading, mutate } = useSWR<CommunityDetailResponse>(
        [`/api/community/detail/${communityName}`, auth?.accessToken],
        getFetcher
    );

    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    // Set the first room as selected when data loads
    if (communityDetail?.rooms.length && selectedRoomId === null) {
        setSelectedRoomId(communityDetail.rooms[0].id);
    }

    if (isLoading) return <Loading />;

    if (!isLoading && IsErrorResponse(communityDetail)) return <ObjectNotfound title="Community not found" message="Community not found" />;

    const selectedRoom = communityDetail?.rooms.find(room => room.id === selectedRoomId);

    const handleCreateRoom = (roomId: number, roomName: string) => {
        if (communityDetail) {
            // Add the new room to the list
            const newRoom: ChatRoomResponse = {
                id: roomId,
                name: roomName,
                messages: []
            };

            mutate({
                ...communityDetail,
                rooms: [...communityDetail.rooms, newRoom]
            }, false);

            // Select the new room
            setSelectedRoomId(roomId);
        }
    };

    const handleCommunityUpdate = (updatedCommunity: Partial<CommunityDetailResponse>) => {
        if (communityDetail) {
            mutate({
                ...communityDetail,
                ...updatedCommunity
            }, false);
        }
    };

    return (
        communityDetail &&
        <div className="ml-[var(--left-nav-expanded-width)]  flex h-[calc(100vh-var(--appbar-height))] -mt-4">
            <div className="flex-1 flex flex-col bg-[var(--background)]">
                <div className="h-16 border-b border-[var(--border-color)] flex items-center bg-[var(--card-background)] px-6">
                    <div className="flex items-center gap-3 flex-1">
                        <Avatar
                            src={fromImage(communityDetail.iconImage)}
                            sx={{
                                width: 40,
                                height: 40,
                                border: '2px solid var(--primary-light)'
                            }}
                        >
                            {communityDetail.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold text-lg text-[var(--text-primary)]">
                                    {communityDetail.name}
                                </h1>
                                {communityDetail.isPrivate && (
                                    <Chip
                                        size="small"
                                        label="Private"
                                        color="primary"
                                        variant="outlined"
                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                    />
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                                    <People fontSize="small" sx={{ fontSize: 14 }} />
                                    {communityDetail.memberCount} members
                                </span>
                                {selectedRoom && (
                                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                                        <span>•</span>
                                        <Forum fontSize="small" sx={{ fontSize: 14 }} />
                                        {selectedRoom.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tooltip title="Community Info">
                            <IconButton
                                size="small"
                                className="text-[var(--text-secondary)]"
                                onClick={() => setInfoOpen(true)}
                            >
                                <Info fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        {communityDetail.isOwner && (
                            <Tooltip title="Community Settings">
                                <IconButton
                                    size="small"
                                    className="text-[var(--text-secondary)]"
                                    onClick={() => setSettingsOpen(true)}
                                >
                                    <Settings fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </div>

                <div className="flex-1 p-6 bg-[var(--background)]">
                    {selectedRoom && <ChatRoom messageInit={selectedRoom.messages} />}
                </div>
            </div>

            <div className="w-80 mr-[var(--community-right-sidebar-width)] bg-[var(--card-background)] border-l border-[var(--border-color)] flex flex-col">
                <div className="p-4 border-b border-[var(--border-color)]">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-[var(--text-primary)]">Chat Rooms</span>
                        {(communityDetail.isOwner || communityDetail.isModerator) && (
                            <Tooltip title="Create Room">
                                <IconButton
                                    size="small"
                                    className="bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                                    onClick={() => setCreateRoomOpen(true)}
                                >
                                    <Add fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-3 space-y-1">
                        {communityDetail.rooms.map(room => (
                            <button
                                onClick={() => setSelectedRoomId(room.id)}
                                key={room.id}
                                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition-all
                                    ${selectedRoomId === room.id
                                        ? 'bg-[var(--primary)] text-white shadow-sm'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--hover-background)]'
                                    }`}
                            >
                                <Forum fontSize="small" />
                                <span className="truncate font-medium">{room.name}</span>
                                {room.messages.length > 0 && (
                                    <Badge
                                        badgeContent={room.messages.length}
                                        color={selectedRoomId === room.id ? "error" : "primary"}
                                        className="ml-auto"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                fontSize: '0.7rem',
                                                height: '18px',
                                                minWidth: '18px'
                                            }
                                        }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="sticky bottom-0 p-4 border-t border-[var(--border-color)] bg-[var(--hover-background)]">
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={auth?.profilePicture}
                            sx={{
                                width: 36,
                                height: 36,
                                border: '2px solid var(--primary-light)'
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                                {auth?.username}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                                {communityDetail.isOwner ? (
                                    <span className="text-[var(--primary)]">Owner</span>
                                ) : communityDetail.isModerator ? (
                                    <span className="text-[var(--secondary)]">Moderator</span>
                                ) : (
                                    <span>Member</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            {communityDetail && (
                <>
                    <CommunitySettings
                        open={settingsOpen}
                        onClose={() => setSettingsOpen(false)}
                        community={communityDetail}
                        onUpdate={handleCommunityUpdate}
                    />

                    <CreateRoomDialog
                        open={createRoomOpen}
                        onClose={() => setCreateRoomOpen(false)}
                        communityId={communityDetail.id}
                        onCreated={handleCreateRoom}
                    />

                    <CommunityInfo
                        open={infoOpen}
                        onClose={() => setInfoOpen(false)}
                        community={communityDetail}
                    />
                </>
            )}
        </div>
    );
}