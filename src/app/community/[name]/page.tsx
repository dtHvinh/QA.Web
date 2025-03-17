'use client'

import Loading from "@/app/loading";
import ObjectNotfound from "@/components/Error/ObjectNotFound";
import getAuth from "@/helpers/auth-utils";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { fromImage } from "@/helpers/utils";
import { AuthorResponse } from "@/types/types";
import { Add, Forum, Settings } from "@mui/icons-material";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use } from "react";
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

    const pathName = usePathname();

    const { data: communityDetail, isLoading } = useSWR<CommunityDetailResponse>(
        [`/api/community/detail/${communityName}`, auth?.accessToken],
        getFetcher
    );

    if (isLoading) return <Loading />;

    if (!isLoading && IsErrorResponse(communityDetail)) return <ObjectNotfound title="Community not found" message="Community not found" />;

    return (
        communityDetail &&
        <div className="flex h-[calc(100vh-var(--appbar-height))] -mt-4">
            <div className="flex-1 flex flex-col bg-[var(--background)]">
                <div className="h-14 border-b border-[var(--border-color)] flex items-center bg-[var(--card-background)]">
                    <div className="flex items-center gap-3 flex-1 ml-8">
                        <Avatar
                            src={fromImage(communityDetail.iconImage)}
                            sx={{ width: 32, height: 32 }}
                        />
                        <div>
                            <h1 className="font-semibold text-[var(--text-primary)]">
                                {communityDetail.name}
                            </h1>
                            <span className="text-xs text-[var(--text-secondary)]">
                                {communityDetail.memberCount} members
                            </span>
                        </div>
                    </div>
                    {communityDetail.isOwner && (
                        <Tooltip title="Community Settings">
                            <IconButton size="small">
                                <Settings fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>

                <div className="flex-1 p-6">
                </div>
            </div>

            <div className="w-80 bg-[var(--card-background)] border-l border-[var(--border-color)] h-screen flex flex-col">
                <div className="p-3 border-b border-[var(--border-color)]">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--text-primary)]">Chat Rooms</span>
                        {(communityDetail.isOwner || communityDetail.isModerator) && (
                            <Tooltip title="Create Room">
                                <IconButton size="small">
                                    <Add fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-2 space-y-0.5">
                        {communityDetail.rooms.map(room => (
                            <Link
                                href={`/community/${communityName}/${room.name}`}
                                key={room.id}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm
                                    ${pathName === room.name
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--hover-background)]'
                                    }`}
                            >
                                <Forum fontSize="small" />
                                <span className="truncate">{room.name}</span>
                                {room.messages.length > 0 && (
                                    <span className="ml-auto text-xs bg-[var(--hover-background)] px-2 py-0.5 rounded-full">
                                        {room.messages.length}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="sticky bottom-0 p-3 border-t border-[var(--border-color)] bg-[var(--hover-background)]">
                    <div className="flex items-center gap-2">
                        <Avatar sx={{ width: 32, height: 32 }} />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                                {auth?.username}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                                {communityDetail.isOwner ? 'Owner' :
                                    communityDetail.isModerator ? 'Moderator' : 'Member'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}