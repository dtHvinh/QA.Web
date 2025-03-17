import { GetCommunityResponse } from "@/types/types";
import { Groups } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import Link from "next/link";

export default function CommunityCard({ community }: { community: GetCommunityResponse }) {
    const handleJoinClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // Add join logic here
    };

    const handleRequestClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // Add request logic here
    };

    return (
        <Link
            href={`/community/${community.name}`}
            className="block bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl
                hover:bg-[var(--hover-background)] hover:shadow-md 
                transition-all duration-200 ease-in-out
                group"
        >
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <Avatar
                        src="/default.png"
                        sx={{
                            width: 48,
                            height: 48,
                            bgcolor: 'var(--primary)',
                            fontSize: '1.5rem'
                        }}
                    >
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <h3 className="font-semibold text-lg text-[var(--text-primary)] truncate">
                                    {community.name}
                                </h3>
                            </div>
                            {!community.isJoined && <button
                                onClick={community.isPrivate ? handleRequestClick : handleJoinClick}
                                className="text-white text-sm bg-blue-600 hover:bg-blue-700 transition-colors rounded-full px-4 py-1"
                            >
                                {community.isPrivate ? 'Request' : 'Join'}
                            </button>}
                        </div>
                        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                            <Groups className="text-[var(--text-tertiary)]" fontSize="small" />
                            <span className="text-sm">{community.memberCount.toLocaleString()} members</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 border-[var(--border-color)]">
                    <p className="text-[var(--text-secondary)] text-sm mt-1 line-clamp-2">
                        {community.description}
                    </p>
                </div>
            </div>
        </Link>
    );
}