'use client'

import Loading from "@/app/loading";
import ChatRoom from "@/components/Community/ChatRoom";
import CommunityInfo from "@/components/Community/CommunityInfo";
import CommunitySettings from "@/components/Community/CommunitySettings";
import CreateRoomDialog from "@/components/Community/CreateRoomDialog";
import RoomSettings from "@/components/Community/RoomSettings";
import ObjectNotfound from "@/components/Error/ObjectNotFound";
import getAuth from "@/helpers/auth-utils";
import { deleteFetcher, getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { fromImage, isScrollBottom } from "@/helpers/utils";
import { AuthorResponse } from "@/types/types";
import { Add, Forum, ForumOutlined, Info, People, Settings } from "@mui/icons-material";
import { Avatar, Chip, IconButton, Tooltip } from "@mui/material";
import { use, useRef, useState } from "react";
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
    const [roomSettingsOpen, setRoomSettingsOpen] = useState(false);
    const [selectedRoomForSettings, setSelectedRoomForSettings] = useState<ChatRoomResponse | null>(null);
    const [hasMoreRoom, setHasMoreRoom] = useState(true);
    const [isRoomLoading, setIsRoomLoading] = useState(false);
    const [roomPageIndex, setRoomPageIndex] = useState(3);
    const roomDisplayRef = useRef<HTMLDivElement>(null);

    const { data: communityDetail, isLoading, mutate } = useSWR<CommunityDetailResponse>(
        [`/api/community/detail/${communityName}`, auth?.accessToken],
        getFetcher
    );

    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    if (isLoading) return <Loading />;

    if (!isLoading && IsErrorResponse(communityDetail)) return <ObjectNotfound title="Error" message="Community not found or you have not joined this community yet!" />;

    if (communityDetail?.rooms.length && selectedRoomId === null) {
        setSelectedRoomId(communityDetail.rooms[0].id);
    }

    const selectedRoom = communityDetail?.rooms.find(room => room.id === selectedRoomId);

    const handleCreateRoom = (roomId: number, roomName: string) => {
        if (communityDetail) {
            const newRoom: ChatRoomResponse = {
                id: roomId,
                name: roomName,
                messages: []
            };

            mutate({
                ...communityDetail,
                rooms: [...communityDetail.rooms, newRoom]
            }, false);

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

    const handleRoomUpdate = (updatedRoom: ChatRoomResponse) => {
        if (communityDetail)
            mutate({
                ...communityDetail,
                rooms: communityDetail.rooms.map(room =>
                    room.id === updatedRoom.id ? updatedRoom : room
                )
            }, false);
    }

    const handleRoomDelete = async (roomId: number) => {
        if (communityDetail) {
            const res = await deleteFetcher([`/api/community/${communityDetail.id}/room/${roomId}`, auth!.accessToken]);

            if (!IsErrorResponse(res)) {
                mutate({
                    ...communityDetail,
                    rooms: communityDetail.rooms.filter(room => room.id !== roomId)
                }, false);

                if (selectedRoomId === roomId) {
                    const firstRoom = communityDetail.rooms.find(room => room.id !== roomId);
                    setSelectedRoomId(firstRoom?.id ?? null);
                }
            }
        }
    };

    const handleRoomScroll = async () => {
        if (hasMoreRoom && roomDisplayRef.current && isScrollBottom(roomDisplayRef.current)) {
            setIsRoomLoading(true);

            const response = (await getFetcher([
                `/api/community/room/${communityDetail!.id}/?pageIndex=${roomPageIndex}&pageSize=${10}`,
                auth!.accessToken
            ])) as ChatRoomResponse[]

            if (communityDetail && !IsErrorResponse(response)) {
                setRoomPageIndex(roomPageIndex + 1)
                setHasMoreRoom(response.length === 10)
                mutate({
                    ...communityDetail,
                    rooms: [...communityDetail.rooms, ...response as ChatRoomResponse[]]
                }, false);
            }
            setIsRoomLoading(false);
        }
    }

    return (
        communityDetail &&
        <div className="ml-[var(--left-nav-expanded-width)] flex h-[calc(100vh-var(--appbar-height))] -mt-4">
            <div className="flex-1 flex flex-col bg-[var(--background)]">
                <div className="h-16 border-b border-[var(--border-color)] flex items-center bg-[var(--card-background)] 
                border-l rounded-bl-2xl px-6 shadow-sm">
                    <div className="flex items-center gap-4 flex-1">
                        <Avatar
                            src={fromImage(communityDetail.iconImage)}
                            sx={{
                                width: 44,
                                height: 44,
                                border: '2px solid var(--primary-light)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            {communityDetail.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold text-xl text-[var(--text-primary)]">
                                    {communityDetail.name}
                                </h1>
                                {communityDetail.isPrivate && (
                                    <Chip
                                        size="small"
                                        label="Private"
                                        color="primary"
                                        sx={{
                                            height: 22,
                                            fontSize: '0.75rem',
                                            backgroundColor: 'var(--primary-light)',
                                            color: 'var(--primary)',
                                            '& .MuiChip-label': {
                                                px: 1
                                            }
                                        }}
                                    />
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
                                    <People sx={{ fontSize: 16 }} />
                                    {communityDetail.memberCount} members
                                </span>
                                {selectedRoom && (
                                    <span className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
                                        <span>•</span>
                                        <Forum sx={{ fontSize: 16 }} />
                                        {selectedRoom.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tooltip title="Community Info">
                            <IconButton
                                className="text-[var(--text-secondary)] hover:bg-[var(--hover-background)]"
                                onClick={() => setInfoOpen(true)}
                            >
                                <Info className=" text-[var(--text-primary)]" />
                            </IconButton>
                        </Tooltip>
                        {communityDetail.isOwner && (
                            <Tooltip title="Community Settings">
                                <IconButton
                                    className="text-[var(--text-secondary)] hover:bg-[var(--hover-background)]"
                                    onClick={() => setSettingsOpen(true)}
                                >
                                    <Settings className=" text-[var(--text-primary)]" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </div>

                <div className="flex-1 p-6 bg-[var(--background)]">
                    {selectedRoom && <ChatRoom messageInit={selectedRoom.messages} />}
                </div>
            </div>

            <div className="w-80 mr-[var(--community-right-sidebar-width)] bg-[var(--card-background)] border-l border-[var(--border-color)] flex flex-col shadow-lg">
                <div className="p-4 border-b border-[var(--border-color)]">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-lg text-[var(--text-primary)]">Chat Rooms</span>
                        {(communityDetail.isOwner || communityDetail.isModerator) && (
                            <Tooltip title="Create Room">
                                <IconButton
                                    className="bg-[var(--primary)]hover:bg-[var(--primary-darker)]"
                                    onClick={() => setCreateRoomOpen(true)}
                                >
                                    <Add className=" text-[var(--text-primary)]" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </div>

                <div ref={roomDisplayRef} onScroll={handleRoomScroll} className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-2" >
                        {communityDetail.rooms.map(room => (
                            <div key={room.id} className="flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedRoomId(room.id)}
                                    className={`flex-1 flex items-center gap-3 px-4 py-2 rounded-md transition-all
                                        ${selectedRoomId === room.id
                                            ? 'text-white bg-[var(--primary)]'
                                            : 'text-[var(--text-primary)] hover:bg-[var(--hover-background)]'
                                        }`}
                                >
                                    <ForumOutlined />
                                    <span className="truncate font-medium">{room.name}</span>
                                </button>
                                {(communityDetail.isOwner || communityDetail.isModerator) && room.name !== 'global' && (
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setSelectedRoomForSettings(room);
                                            setRoomSettingsOpen(true);
                                        }}
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

                <div className="sticky bottom-0 p-4 border-t border-[var(--border-color)] bg-[var(--card-background)]">
                    <div className="flex items-center gap-4">
                        <Avatar
                            src={auth?.profilePicture}
                            sx={{
                                width: 40,
                                height: 40,
                                border: '2px solid var(--primary-light)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
                                {auth?.username}
                            </div>
                            <div className="text-xs mt-0.5">
                                {communityDetail.isOwner ? (
                                    <span className="text-[var(--primary)] font-medium">Owner</span>
                                ) : communityDetail.isModerator ? (
                                    <span className="text-[var(--secondary)] font-medium">Moderator</span>
                                ) : (
                                    <span className="text-[var(--text-secondary)]">Member</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

                    <RoomSettings
                        open={roomSettingsOpen}
                        communityId={communityDetail.id}
                        onClose={() => setRoomSettingsOpen(false)}
                        onUpdate={handleRoomUpdate}
                        room={selectedRoomForSettings}
                        onDelete={handleRoomDelete}
                    />
                </>
            )}
        </div>
    );
}