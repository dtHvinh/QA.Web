'use client'

import CommunityCard from "@/components/Community/CommunityCard";
import CreateCommunityDialog from "@/components/Community/CreateCommunityDialog";
import getAuth from "@/helpers/auth-utils";
import { getFetcher } from "@/helpers/request-utils";
import { GetCommunityResponse } from "@/types/types";
import { AddOutlined, PeopleOutline, SearchOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function CommunityPage() {
    const auth = getAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const { data: communities, isLoading } = useSWR<GetCommunityResponse[]>(
        [`/api/community?pageIndex=${pageIndex}&pageSize=20`, auth?.accessToken], getFetcher);
    const router = useRouter();

    const handleCreateCommunity = (name: string) => {
        router.push(`/community/${name}`)
    };

    return (
        <div className="ml-28 page-container">
            <CreateCommunityDialog
                open={open}
                onClose={() => setOpen(false)}
                onCreate={handleCreateCommunity}
            />

            <div>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Communities</h1>
                        <p className="mt-2 text-[var(--text-secondary)]">Join communities to connect with other developers</p>
                    </div>
                    <button
                        onClick={() => setOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-[var(--card-background)] rounded-full border border-[var(--border-color)]
                    hover:bg-[var(--hover-background)] active:bg-[var(--hover-background-darker)]
                    transition-colors gap-2 text-[var(--text-primary)]"
                    >
                        <AddOutlined className="w-5 h-5" />
                        Create
                    </button>
                </div>

                <div className="mb-8">
                    <div className="relative">
                        <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search communities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-[var(--border-color)] rounded-lg bg-[var(--input-background)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {communities?.map((community) => (
                        <CommunityCard key={community.id} community={community} />
                    ))}
                </div>

                {communities?.length === 0 && (
                    <div className="text-center py-12">
                        <PeopleOutline className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No communities found</h3>
                        <p className="text-[var(--text-secondary)]">Try adjusting your search or create a new community</p>
                    </div>
                )}
            </div>
        </div>
    );
}