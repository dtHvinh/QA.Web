'use client'

import getAuth from "@/helpers/auth-utils";
import { getFetcher } from "@/helpers/request-utils";
import { fromImage } from "@/helpers/utils";
import { GetCommunityResponse } from "@/types/types";
import { Avatar, Tooltip } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
    const auth = getAuth();
    const [pageIndex, setPageIndex] = useState(1);

    const { data: communityJoined, isLoading: isLoading } = useSWR<GetCommunityResponse[]>(
        [`/api/community/joined?pageIndex=${pageIndex}&pageSize=10`, auth?.accessToken],
        getFetcher
    );

    return (
        <div className="relative flex min-h-[calc(100vh-var(--appbar-height))]">
            <div className="ml-[var(--left-nav-expanded-width)] flex-1">
                {children}
            </div>

            <div className="fixed right-0 top-[var(--appbar-height)] bottom-0 
                w-[var(--community-right-sidebar-width)]
                border-l border-[var(--border-color)] bg-[var(--card-background)] 
                p-2 flex flex-col gap-2 overflow-y-auto h-screen">
                {communityJoined?.map((community) => (
                    <Tooltip
                        key={community.id}
                        title={community.name}
                        placement="left"
                        arrow
                    >
                        <Link className="border transition rounded-full border-[var(--border-color)]" href={`/community/${community.name}`}>
                            <Avatar
                                src={fromImage(community.iconImage)}
                                sx={{
                                    width: 48,
                                    height: 48,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    }
                                }}
                            >
                                {community.name.charAt(0).toUpperCase()}
                            </Avatar>
                        </Link>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
}