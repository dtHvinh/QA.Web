'use client'

import ChatRoom from "@/components/Community/ChatRoom";
import ChatRoomsSidebar from "@/components/Community/ChatRoomsSidebar";
import CommunityInfo from "@/components/Community/CommunityInfo";
import CommunitySettings from "@/components/Community/CommunitySettings";
import CreateRoomDialog from "@/components/Community/CreateRoomDialog";
import RoomSettings from "@/components/Community/RoomSettings";
import DeleteConfirmDialog from "@/components/Dialog/DeleteConfirmDialog";
import GenericDialog from "@/components/Dialog/GenericDialog";
import { deleteFetcher, getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { fromImage } from "@/helpers/utils";
import { theme } from "@/theme/theme";
import { ChatRoomResponse, CommunityDetailResponse } from "@/types/types";
import { notifySucceed } from "@/utilities/ToastrExtensions";
import { ChatBubbleOutlineRounded, Forum, InfoOutlined, People, SettingsOutlined } from "@mui/icons-material";
import { Avatar, Chip, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import { use, useState } from "react";
import useSWR from "swr";

export default function CommunityDetailPage({ params }: { params: Promise<{ name: string }> }) {
    const { name: communityName } = use(params)
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [createRoomOpen, setCreateRoomOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [roomSettingsOpen, setRoomSettingsOpen] = useState(false);
    const [genericDialogOpen, setGenericDialogOpen] = useState(false);
    const [selectedRoomForSettings, setSelectedRoomForSettings] = useState<ChatRoomResponse | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [chatRoomOpen, setChatRoomOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoomResponse | null>(null);
    const [roomDeleteConfirmOpen, setRoomDeleteConfirmOpen] = useState(false);
    const [isRoomDeleting, setIsRoomDeleting] = useState(false);
    const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const { data: communityDetail, isLoading, mutate } = useSWR<CommunityDetailResponse>(`/api/community/detail/${communityName}`, getFetcher);

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

            setSelectedRoom(newRoom);
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
            setIsRoomDeleting(true);
            const res = await deleteFetcher(`/api/community/${communityDetail.id}/room/${roomId}`);

            if (!IsErrorResponse(res)) {
                mutate({
                    ...communityDetail,
                    rooms: communityDetail.rooms.filter(room => room.id !== roomId)
                }, false);

                if (selectedRoomId === roomId) {
                    const firstRoom = communityDetail.rooms.find(room => room.id !== roomId);
                    setSelectedRoomId(firstRoom?.id ?? null);
                }

                notifySucceed("Room deleted");
            }
            setIsRoomDeleting(false);
            setRoomDeleteConfirmOpen(false)
        }
    };

    const handleRoomLoaded = async (rooms: ChatRoomResponse[]) => {
        if (communityDetail)
            mutate({
                ...communityDetail,
                rooms: [...communityDetail.rooms, ...rooms]
            }, false);
    }

    const handleClickBack = () => {
        setChatRoomOpen(false);
        setSelectedRoom(null);
    };

    const handleRoomClick = (room: ChatRoomResponse) => {
        setSelectedRoom(room);
        setSelectedRoomId(room.id);
        setChatRoomOpen(true);
    };

    return (
        communityDetail &&
        <div className="lg:ml-[var(--left-nav-expanded-width)] flex h-[calc(100vh-var(--appbar-height))] -mt-4">
            <div className="flex-1 flex flex-col bg-[var(--background)]">
                <div className={`${!isHeaderExpanded && 'hidden'} border-b border-[var(--border-color)] flex items-center bg-[var(--card-background)] 
                border-l rounded-bl-2xl px-6 shadow-sm h-[59]`}>
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
                                <h1 className="font-semibold text-md text-[var(--text-primary)]">
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
                                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                                    <People sx={{ fontSize: 16 }} />
                                    {communityDetail.memberCount} members
                                </span>
                                {selectedRoom && (
                                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                                        <span>•</span>
                                        <Forum sx={{ fontSize: 16 }} />
                                        {selectedRoom.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mr-16 md:mr-0">
                        <Tooltip title="Community Info">
                            <IconButton
                                className="text-[var(--text-secondary)] hover:bg-[var(--hover-background)]"
                                onClick={() => setInfoOpen(true)}
                            >
                                <InfoOutlined fontSize="small" className=" text-[var(--text-primary)]" />
                            </IconButton>
                        </Tooltip>
                        <div className="flex md:hidden">
                            <Tooltip title="Chat rooms">
                                <IconButton
                                    className="text-[var(--text-secondary)] hover:bg-[var(--hover-background)]"
                                    onClick={() => setGenericDialogOpen(true)}
                                >
                                    <ChatBubbleOutlineRounded fontSize="small" className=" text-[var(--text-primary)]" />
                                </IconButton>
                            </Tooltip>
                        </div>
                        {communityDetail.isOwner && (
                            <Tooltip title="Community Settings">
                                <IconButton
                                    className="text-[var(--text-secondary)] hover:bg-[var(--hover-background)]"
                                    onClick={() => setSettingsOpen(true)}
                                >
                                    <SettingsOutlined fontSize="small" className=" text-[var(--text-primary)]" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </div>

                <div id="community-main-content" className="flex-1 bg-[var(--background)] overflow-hidden mr-[var(--community-right-sidebar-width)] md:mr-0">
                    {chatRoomOpen &&
                        selectedRoom &&
                        <div className="h-full p-2">
                            <ChatRoom
                                onBack={handleClickBack}
                                messageInit={selectedRoom.messages}
                            />
                        </div>
                    }
                </div>
            </div>

            <div className="hidden md:flex">
                <ChatRoomsSidebar
                    rooms={communityDetail.rooms}
                    isOwner={communityDetail.isOwner}
                    isModerator={communityDetail.isModerator}
                    communityId={communityDetail.id}
                    selectedRoomId={selectedRoomId}
                    onRoomClick={handleRoomClick}
                    onCreateRoomClick={() => setCreateRoomOpen(true)}
                    onRoomLoaded={handleRoomLoaded}
                    onRoomSettingsClick={(room) => {
                        setSelectedRoomForSettings(room);
                        setRoomSettingsOpen(true);
                    }}
                    communityDetail={communityDetail}
                />
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
                        onDelete={() => setRoomDeleteConfirmOpen(true)}
                    />

                    <DeleteConfirmDialog
                        open={roomDeleteConfirmOpen}
                        onClose={() => setRoomDeleteConfirmOpen(false)}
                        itemName={selectedRoomForSettings?.name ?? "NAN"}
                        itemType="room"
                        onConfirm={() => handleRoomDelete(selectedRoomForSettings!.id)}
                        isDeleting={isRoomDeleting}
                    />

                    <GenericDialog
                        open={genericDialogOpen}
                        onClose={() => setGenericDialogOpen(false)}
                        fullScreen={fullScreen}
                        children={
                            <div>
                                <ChatRoomsSidebar
                                    className="-mr-[var(--community-right-sidebar-width)]"
                                    rooms={communityDetail.rooms}
                                    isOwner={communityDetail.isOwner}
                                    isModerator={communityDetail.isModerator}
                                    communityId={communityDetail.id}
                                    selectedRoomId={selectedRoomId}
                                    onRoomClick={(room) => {
                                        handleRoomClick(room);
                                        setGenericDialogOpen(false);
                                    }}
                                    onCreateRoomClick={() => setCreateRoomOpen(true)}
                                    onRoomLoaded={handleRoomLoaded}
                                    onRoomSettingsClick={(room) => {
                                        setSelectedRoomForSettings(room);
                                        setRoomSettingsOpen(true);
                                    }}
                                    communityDetail={communityDetail}
                                />
                            </div>
                        }
                    />
                </>
            )}
        </div>
    );
}

