'use client'

import ViewOptionsButton from "@/components/Common/ViewOptionsButton";
import CommunityCard from "@/components/Community/CommunityCard";
import CreateCommunityDialog from "@/components/Community/CreateCommunityDialog";
import { getFetcher } from "@/helpers/request-utils";
import { GetCommunityResponse, ViewOptions } from "@/types/types";
import { Add, Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

export default function CommunityPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [view, setView] = useState<ViewOptions>('compact');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [debounceSearchTerm] = useDebounce(searchTerm, 500);

    const { data: joinedCommunities, isLoading: isLoadingJoined } = useSWR<GetCommunityResponse[]>(
        `/api/community/joined?pageIndex=1&pageSize=4`, getFetcher
    );

    const { data: popularCommunities, isLoading: isLoadingPopular } = useSWR<GetCommunityResponse[]>(
        `/api/community/popular?pageIndex=1&pageSize=8`,
        getFetcher
    );

    const { data: searchResults, isLoading: isLoadingSearch } = useSWR<GetCommunityResponse[]>(
        debounceSearchTerm.length > 2 ? `/api/community/search/${debounceSearchTerm}/?pageIndex=1&pageSize=20` : null,
        getFetcher
    );

    const handleCreateSuccess = (newCommunity: GetCommunityResponse) => {
        window.location.href = `/community/${newCommunity.name}`;
    };

    return (
        <div className="page-container mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Communities</h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Join communities to connect with others and share knowledge
                    </p>
                </div>

                <button
                    onClick={() => setCreateDialogOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Add /> Create Community
                </button>
            </div>

            <div className="mb-8">
                <TextField
                    fullWidth
                    placeholder="Search communities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    slotProps={{
                        htmlInput: {
                            startadorment: (
                                <InputAdornment position="start">
                                    <Search className="text-[var(--text-tertiary)]" />
                                </InputAdornment>
                            ),
                            sx: {
                                backgroundColor: 'var(--input-background)',
                                borderRadius: '12px',
                                '& fieldset': {
                                    borderColor: 'var(--border-color)'
                                },
                                color: 'var(--text-primary)'
                            }
                        }
                    }}
                />
            </div>

            {debounceSearchTerm.length > 2 ? (
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
                        Search Results for "{debounceSearchTerm}"
                    </h2>

                    {isLoadingSearch ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    ) : searchResults?.length === 0 ? (
                        <div className="text-center py-12">
                            <Search />
                            <h3 className="text-xl font-medium text-[var(--text-primary)] mb-2">No communities found</h3>
                            <p className="text-[var(--text-secondary)]">
                                Try a different search term or create a new community
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {searchResults?.map((community) => (
                                <CommunityCard key={community.id} community={community} compact={view} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {joinedCommunities && joinedCommunities.length > 0 && (
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                    Your Communities
                                </h2>
                                <Link href="/community/joined" className="text-[var(--primary)] text-sm hover:underline">
                                    View all
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {joinedCommunities.map((community) => (
                                    <CommunityCard key={community.id} community={community} compact={view} />
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                Popular Communities
                            </h2>

                            <ViewOptionsButton view={view} onChange={setView} />
                        </div>

                        {isLoadingPopular ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <div key={i} className="bg-[var(--card-background)] rounded-xl p-6 border border-[var(--border-color)] animate-pulse">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[var(--hover-background)]"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-[var(--hover-background)] rounded w-3/4 mb-2"></div>
                                                <div className="h-3 bg-[var(--hover-background)] rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {popularCommunities?.map((community) => (
                                    <CommunityCard key={community.id} community={community} compact={view} />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            <CreateCommunityDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onCreated={handleCreateSuccess}
            />
        </div>
    );
}
