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
                    <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
                    <p className="mt-2 text-gray-600">Join communities to connect with other developers</p>
                </div>
                <button
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-500
                    hover:bg-gray-100 active:bg-gray-200
                    transition-colors gap-2"
                >
                    <AddOutlined className="w-5 h-5" />
                    Create
                </button>
            </div>

            <div className="mb-8">
                <div className="relative">
                    <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search communities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    />
                </div>
            </div>

            <div >
                {communities.map((community) => (
                    <Link
                        href={`/community/${community.id}`}
                        key={community.id}
                        className="flex items-center justify-between bg-white border-b 
                                 hover:bg-gray-50 hover:shadow-sm active:bg-gray-100 
                                 transition-all duration-200 ease-in-out p-4 last:border-b-0
                                 relative group"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-1">
                                <h3 className="font-semibold text-lg text-gray-700 
                                           group-hover:text-black transition-colors">
                                    {community.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <PeopleOutline className="w-4 h-4" />
                                    <span>{community.memberCount} members</span>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-1">
                                {community.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {communities.length === 0 && (
                <div className="text-center py-12">
                    <PeopleOutline className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No communities found</h3>
                    <p className="text-gray-500">Try adjusting your search or create a new community</p>
                </div>
            )}
        </div>
    );
}