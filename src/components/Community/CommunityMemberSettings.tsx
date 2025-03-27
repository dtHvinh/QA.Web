import { deleteFetcher, IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import { fromImage } from "@/helpers/utils";
import { CommunityDetailResponse, TextResponse } from "@/types/types";
import { notifySucceed } from "@/utilities/ToastrExtensions";
import { Build, BuildOutlined, DeleteForeverOutlined } from "@mui/icons-material";
import { Avatar, Tooltip } from "@mui/material";
import { useState } from "react";
import DeleteConfirmDialog from "../Dialog/DeleteConfirmDialog";
import { CommunityMemberResponse, CommunityOwner } from "./CommunitySettings";

export default function CommunityMemberSettings({
    members,
    community,
    onRemoveMember,
    onGrantModerator,
    onRevokeModerator,
}: {
    members: CommunityMemberResponse[],
    community: CommunityDetailResponse,
    onRemoveMember?: (memberId: string) => void,
    onGrantModerator?: (memberId: string) => void,
    onRevokeModerator?: (memberId: string) => void,
}) {
    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<CommunityMemberResponse>();

    const handleRemoveMember = async (member: CommunityMemberResponse) => {
        const response = await deleteFetcher(`/api/community/${community.id}/member/${member.id}`);

        if (!IsErrorResponse(response)) {
            notifySucceed((response as TextResponse).message);
            onRemoveMember?.(member.id);
            setIsDeleteConfirmDialogOpen(false);
        }
    }

    const handleGrantModerator = async (member: CommunityMemberResponse) => {
        const response = await postFetcher(`/api/community/${community.id}/mod/grant/${member.id}`);

        if (!IsErrorResponse(response)) {
            notifySucceed((response as TextResponse).message);
            onGrantModerator?.(member.id);
        }
    }

    const handleRevokeModerator = async (member: CommunityMemberResponse) => {
        const response = await postFetcher(`/api/community/${community.id}/mod/revoke/${member.id}`);

        if (!IsErrorResponse(response)) {
            notifySucceed((response as TextResponse).message);
            onRevokeModerator?.(member.id);
        }
    }

    const handleDeleteConfirm = (member: CommunityMemberResponse) => {
        setIsDeleteConfirmDialogOpen(true);
        setMemberToDelete(member);
    }

    return (
        <div>
            {members.map((member) => (
                <div key={member.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--hover-background)] transition-colors">
                    <Avatar
                        src={fromImage(member.profileImage)}
                        sx={{ width: 40, height: 40 }}
                    >
                        {member.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="flex-1">
                        <div className="font-medium text-[var(--text-primary)]">
                            {member.username}
                        </div>
                        {member.isOwner ?
                            <div className="text-sm text-[var(--primary)]">
                                Owner
                            </div> : member.isModerator && (
                                <div className="text-sm text-[var(--primary)]">
                                    Moderator
                                </div>
                            )}
                    </div>
                    {community.isOwner && (
                        member.isModerator ? (
                            <Tooltip title="Revoke mod">
                                <button onClick={() => handleRevokeModerator(member)}>
                                    <Build className="text-blue-400" />
                                </button>
                            </Tooltip>
                        ) : (
                            <Tooltip title="Make mod">
                                <button onClick={() => handleGrantModerator(member)}>
                                    <BuildOutlined />
                                </button>
                            </Tooltip>
                        )
                    )}
                    <CommunityOwner isOwner={community.isOwner} >
                        <Tooltip title="Remove member">
                            <button onClick={() => handleDeleteConfirm(member)}>
                                <DeleteForeverOutlined />
                            </button>
                        </Tooltip>
                    </CommunityOwner>
                </div>
            ))}

            {memberToDelete &&
                <DeleteConfirmDialog
                    itemName={memberToDelete.username}
                    itemType="user"
                    onClose={() => setIsDeleteConfirmDialogOpen(false)}
                    open={isDeleteConfirmDialogOpen}
                    onConfirm={() => handleRemoveMember(memberToDelete)}
                />
            }
        </div>
    )
}