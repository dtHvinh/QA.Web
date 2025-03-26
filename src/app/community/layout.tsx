'use client'

import CreateCommunityDialog from "@/components/Community/CreateCommunityDialog";
import getAuth from "@/helpers/auth-utils";
import { getFetcher } from "@/helpers/request-utils";
import { fromImage } from "@/helpers/utils";
import { GetCommunityResponse } from "@/types/types";
import { Add } from "@mui/icons-material";
import { Avatar, Tooltip } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
    const auth = getAuth();
    const [pageIndex, setPageIndex] = useState(1);
    const pathname = usePathname();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);

    const { data: communityJoined, isLoading, mutate } = useSWR<GetCommunityResponse[]>(`/api/community/joined?pageIndex=${pageIndex}&pageSize=10`, getFetcher);

    const isCommunityPage = pathname.startsWith('/community/') &&
        pathname !== '/community/joined' &&
        pathname !== '/community';

    const communityName = isCommunityPage ? pathname.split('/')[2] : null;

    const handleCreateSuccess = (newCommunity: GetCommunityResponse) => {
        if (communityJoined) {
            mutate([newCommunity, ...communityJoined], false);
        }

        window.location.href = `/community/${newCommunity.name}`;
    };

    return (
        <div className="h-[calc(100vh-calc(var(--appbar-height)*2))]">
            <div className="flex-1">
                {children}
            </div>

            <div className="fixed right-0 top-[var(--appbar-height)] bottom-0 
                w-[var(--community-right-sidebar-width)]
                border-l border-[var(--border-color)] bg-[var(--card-background)] 
                p-2 flex flex-col gap-2 overflow-y-auto
                h-[calc(100vh-calc(var(--appbar-height)))]">

                <Tooltip title="Create Community" placement="left" arrow>
                    <div className="flex justify-center">
                        <Avatar
                            sx={{
                                width: 'var(--riw)',
                                height: 'var(--riw)',
                                bgcolor: 'var(--primary-light)',
                                color: 'var(--primary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                border: '1px solid var(--border-color)',
                                '&:hover': {
                                    bgcolor: 'var(--primary)',
                                    color: 'white',
                                    border: '2px solid var(--primary)'
                                }
                            }}
                            onClick={() => setCreateDialogOpen(true)}
                        >
                            <Add />
                        </Avatar>
                    </div>
                </Tooltip>

                {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div
                            key={i}
                            className="w-12 h-12 mx-auto rounded-full bg-[var(--hover-background)] animate-pulse"
                        />
                    ))
                ) : communityJoined?.length === 0 ? (
                    <div className="text-center py-4 px-2">
                        <p className="text-xs text-[var(--text-tertiary)] mb-2">
                            You haven't joined any yet
                        </p>
                    </div>
                ) : (
                    communityJoined?.map((community) => (
                        <Tooltip
                            key={community.id}
                            title={community.name}
                            placement="left"
                            arrow
                        >
                            <Link
                                className="flex justify-center items-center relative group"
                                href={`/community/${community.name}`}
                            >
                                <Avatar
                                    variant={`${communityName === community.name ? 'rounded' : 'circular'}`}
                                    src={fromImage(community.iconImage)}
                                    sx={{
                                        width: 'var(--riw)',
                                        height: 'var(--riw)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        border: communityName === community.name
                                            ? '2px solid var(--primary)'
                                            : '2px solid transparent',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            borderColor: 'var(--primary)',
                                        }
                                    }}
                                >
                                    {community.name}
                                </Avatar>
                                <div className="absolute bottom-0 right-[8px] w-4 h-4 bg-[var(--success)] rounded-full text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span>{community.memberCount > 99 ? '99+' : community.memberCount}</span>
                                </div>

                                {communityName === community.name && (
                                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary)] rounded-r-full"></div>
                                )}
                            </Link>
                        </Tooltip>
                    ))
                )}

                <Tooltip title="Join via Invitation" placement="left" arrow>
                    <div className="flex justify-center">
                        <Avatar
                            sx={{
                                width: 'var(--riw)',
                                height: 'var(--riw)',
                                bgcolor: 'var(--success-light)',
                                color: 'var(--success)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                border: '1px solid var(--border-color)',
                                '&:hover': {
                                    bgcolor: 'var(--success)',
                                    color: 'white',
                                    border: '2px solid var(--success)'
                                }
                            }}
                            onClick={() => setJoinDialogOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Avatar>
                    </div>
                </Tooltip>
            </div>

            <CreateCommunityDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onCreated={handleCreateSuccess}
            />
        </div>
    );
}