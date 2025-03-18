'use client'

import getAuth from "@/helpers/auth-utils";
import { getFetcher } from "@/helpers/request-utils";
import { fromImage } from "@/helpers/utils";
import { GetCommunityResponse } from "@/types/types";
import { ArrowBack, Lock, People } from "@mui/icons-material";
import { Avatar, Button, Chip } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

export default function JoinedCommunitiesPage() {
    const auth = getAuth();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const { data, isLoading } = useSWR<GetCommunityResponse[]>(
        [`/api/community/joined?pageIndex=1&pageSize=${pageSize}`, auth?.accessToken],
        getFetcher
    );
    const [hasMore, setHasMore] = useState(data?.length == pageSize);

    const handleLoadMore = () => {
        setPageSize(pageSize * (pageIndex + 1));
        setPageIndex(pageIndex + 1);
        if (data?.length != pageSize) {
            setHasMore(false);
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center mb-6">
                <Link href="/community" className="mr-4">
                    <Button
                        startIcon={<ArrowBack />}
                        className="text-[var(--text-secondary)]"
                    >
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Your Communities</h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Communities you've joined
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-[var(--card-background)] rounded-xl p-6 border border-[var(--border-color)] animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-[var(--hover-background)]"></div>
                                <div className="flex-1">
                                    <div className="h-5 bg-[var(--hover-background)] rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-[var(--hover-background)] rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : data?.length === 0 ? (
                <div className="text-center py-16 bg-[var(--card-background)] rounded-xl border border-[var(--border-color)]">
                    <div className="text-6xl mb-4">👋</div>
                    <h3 className="text-xl font-medium text-[var(--text-primary)] mb-2">You haven't joined any communities yet</h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                        Join communities to connect with others and share knowledge
                    </p>
                    <Link href="/community">
                        <Button
                            variant="contained"
                            className="bg-[var(--primary)] hover:bg-[var(--primary-darker)]"
                        >
                            Explore Communities
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {data?.map((community) => (
                            <Link
                                key={community.id}
                                href={`/community/${community.name}`}
                                className="block bg-[var(--card-background)] rounded-xl border border-[var(--border-color)] p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        src={fromImage(community.iconImage)}
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            border: '2px solid var(--primary-light)'
                                        }}
                                    >
                                        {community.name.charAt(0).toUpperCase()}
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-[var(--text-primary)] truncate">
                                                {community.name}
                                            </h3>
                                            {community.isPrivate && (
                                                <Lock fontSize="small" className="text-[var(--text-tertiary)]" />
                                            )}
                                        </div>

                                        <div className="flex items-center text-xs text-[var(--text-secondary)] mt-1">
                                            <People fontSize="small" sx={{ fontSize: 14, marginRight: 0.5 }} />
                                            <span>{community.memberCount} members</span>
                                        </div>

                                        {community.description && (
                                            <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">
                                                {community.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <Chip
                                        label="Joined"
                                        color="primary"
                                        size="small"
                                        className="bg-[var(--primary)]"
                                    />
                                </div>
                            </Link>
                        ))}
                        {hasMore && (
                            <button
                                onClick={handleLoadMore}
                                className="bg-[var(--primary)] hover:bg-[var(--primary-darker)] w-[352] h-[162]"
                            >
                                Load More
                            </button>
                        )}
                    </div>
                </>
            )}


        </div>
    );
}