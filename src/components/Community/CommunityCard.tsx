import { fromImage } from "@/helpers/utils";
import { GetCommunityResponse } from "@/types/types";
import { Lock, People } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useState } from "react";


interface CommunityCardProps {
    community: GetCommunityResponse;
    compact?: boolean;
}

function CommunityCard({ community, compact = false }: CommunityCardProps) {
    const [isJoined, setIsJoined] = useState(community.isJoined);

    const handleJoinCommunity = async () => {

    }

    return (
        <div
            className="flex justify-between place-items-start bg-[var(--card-background)] rounded-xl border border-[var(--border-color)] p-4 hover:bg-[var(--hover-background)] "
        >
            <div className="flex items-center gap-3">
                <Avatar
                    src={fromImage(community.iconImage)}
                    sx={{
                        width: compact ? 48 : 64,
                        height: compact ? 48 : 64,
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

                    {!compact && community.description && (
                        <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">
                            {community.description}
                        </p>
                    )}
                </div>
            </div>

            {!isJoined && <div className="mt-4 flex">
                <button
                    onClick={handleJoinCommunity}
                    className={`border px-4 py-1 rounded-full text-sm font-semibold text-[var(--primary)] border-[var(--primary)] hover:bg-[var(--primary-light)]`}
                >
                    Join
                </button>
            </div>}
        </div>
    );
}

export default CommunityCard;