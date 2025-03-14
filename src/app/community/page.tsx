'use client'

import CreateCommunityDialog from "@/components/Community/CreateCommunityDialog";
import { AddOutlined, PeopleOutline, SearchOutlined } from "@mui/icons-material";
import Link from "next/link";
import { useState } from "react";

interface Community {
    id: number;
    name: string;
    description: string;
    memberCount: number;
}

export default function CommunityPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [communities, setCommunities] = useState<Community[]>([
        {
            id: 1,
            name: "qa/javascript-developer",
            description: "A community for JavaScript developers to share knowledge and best practices.",
            memberCount: 1234,
        },
    ]);

    const handleCreateCommunity = (name: string, description: string) => {
        console.log(name, description);
    };

    return (
        <div className="page-container mx-auto px-4 py-8">
            <CreateCommunityDialog
                open={open}
                onClose={() => setOpen(false)}
                onCreate={handleCreateCommunity}
            />

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

            <div>
                {communities.map((community) => (
                    <Link
                        href={`/community/${community.name.substring(2)}`}
                        key={community.id}
                        className="flex items-center justify-between bg-[var(--card-background)] border-b border-[var(--border-color)]
                                 hover:bg-[var(--hover-background)] hover:shadow-sm 
                                 transition-all duration-200 ease-in-out p-4 last:border-b-0
                                 relative group"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-1">
                                <h3 className="font-semibold text-lg text-[var(--text-secondary)]
                                           group-hover:text-[var(--text-primary)] transition-colors">
                                    {community.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
                                    <PeopleOutline className="w-4 h-4" />
                                    <span>{community.memberCount} members</span>
                                </div>
                            </div>
                            <p className="text-[var(--text-secondary)] text-sm line-clamp-1">
                                {community.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {communities.length === 0 && (
                <div className="text-center py-12">
                    <PeopleOutline className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No communities found</h3>
                    <p className="text-[var(--text-secondary)]">Try adjusting your search or create a new community</p>
                </div>
            )}
        </div>
    );
}