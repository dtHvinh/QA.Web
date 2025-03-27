import getAuth from "@/helpers/auth-utils";
import { fromImage } from "@/helpers/utils";
import { CommunityDetailResponse } from "@/types/types";
import { Avatar } from "@mui/material";

export default function UserCommunityInfoBottom({ communityDetail }: { communityDetail: CommunityDetailResponse }) {
    // TODO: Use user endpoint instead of this
    const auth = getAuth();

    return <div className="bottom-0 p-2 px-4 border-t border-[var(--border-color)] bg-[var(--card-background)]">
        <div className="flex items-center gap-4">
            <Avatar
                src={fromImage(auth?.profilePicture)}
                sx={{
                    width: 40,
                    height: 40,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
            <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {auth?.username}
                </div>
                <div className="text-xs mt-0.5">
                    {communityDetail.isOwner ? (
                        <span className="text-[var(--primary)] font-medium">Owner</span>
                    ) : communityDetail.isModerator ? (
                        <span className="text-[var(--secondary)] font-medium">Moderator</span>
                    ) : (
                        <span className="text-[var(--text-secondary)]">Member</span>
                    )}
                </div>
            </div>
        </div>
    </div>;
}