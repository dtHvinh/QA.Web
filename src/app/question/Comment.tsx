import AlertDialog from "@/components/AlertDialog";
import UserInfoPopup from "@/components/UserInfoPopup";
import { deleteFetcher, IsErrorResponse, putFetcher } from "@/helpers/request-utils";
import { formatString } from "@/helpers/string-utils";
import timeFromNow, { DEFAULT_TIME } from "@/helpers/time-utils";
import { fromImage } from "@/helpers/utils";
import { ErrorResponse } from "@/props/ErrorResponse";
import { CommentResponse } from "@/types/types";
import { Apis, backendURL } from "@/utilities/Constants";
import notifyError, { notifySucceed } from "@/utilities/ToastrExtensions";
import { Avatar, TextField } from "@mui/material";
import React from "react";

interface CommentComponentProps {
    comment: CommentResponse;
    onCommentDelete: (commentId: string) => void;
}

const Comment = ({ comment, onCommentDelete }: Readonly<CommentComponentProps>) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [currentText, setCurrentText] = React.useState(comment.content);
    const [editText, setEditText] = React.useState(comment.content);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isSaveAllow, setIsSaveAllow] = React.useState(false);

    const handleClickOpen = () => {
        setDeleteDialogOpen(true);
    };

    const handleClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleDiscard = () => {
        setIsEditing(false);
        setEditText(currentText);
    }

    const handleStartEditing = () => {
        setIsEditing(true);
    }

    const handleEditTextChange = (text: string) => {
        setEditText(text);
        setIsSaveAllow(true);
    }

    const handleDelete = async () => {
        const requestUrl = formatString(Apis.Comment.Delete, comment.id);

        const response = await deleteFetcher(requestUrl);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).title);
        } else {
            setIsDeleting(true);
            setTimeout(() => {
                onCommentDelete(comment.id);
            }, 500);
        }
    }

    const handleUpdate = async () => {
        const requestUrl = formatString(backendURL + Apis.Comment.Update, comment.id);

        const response = await putFetcher(requestUrl, JSON.stringify({
            content: editText
        }));

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).title);
        } else {
            comment = response as CommentResponse;
            setCurrentText(editText);
            setIsEditing(false);

            notifySucceed('Comment updated successfully');
        }
    }

    return (
        <div className={`relative p-2 mb-2 rounded-md ${isDeleting ? 'element-exit element-exit-active' : ''}`}>
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <Avatar
                        src={fromImage(comment.author?.profilePicture)}
                        alt={comment.author?.username}
                    />
                </div>

                <div className="flex-grow space-y-1">
                    <div className="flex items-center gap-2">
                        <UserInfoPopup
                            user={comment.author!}
                            className="text-xs font-medium text-[var(--text-primary)]"
                        />
                        <span className="text-xs text-[var(--text-tertiary)]">
                            {comment.updatedAt == DEFAULT_TIME ?
                                timeFromNow(comment.createdAt) :
                                `(edited ${timeFromNow(comment.updatedAt)})`
                            }
                        </span>
                    </div>

                    {isEditing ? (
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            size="small"
                            value={editText}
                            onChange={(e) => handleEditTextChange(e.target.value)}
                            sx={{
                                '& .MuiInputBase-root': {
                                    color: 'var(--text-primary)',
                                    backgroundColor: 'var(--input-background)',
                                    fontSize: '0.875rem',
                                    '& fieldset': {
                                        borderColor: 'var(--border-color)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'var(--primary)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'var(--primary)',
                                    },
                                },
                            }}
                        />
                    ) : (
                        <div className="text-xs text-[var(--text-primary)]"
                            dangerouslySetInnerHTML={{ __html: currentText as TrustedHTML }}>
                        </div>
                    )}

                    {comment.resourceRight == 'Owner' && (
                        <div className="flex gap-2 text-xs">
                            {isEditing ? (
                                <>
                                    <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]" onClick={handleDiscard}>
                                        Cancel
                                    </button>
                                    <button
                                        className="text-[var(--primary)] hover:text-[var(--primary-darker)] disabled:text-[var(--disabled-background)]"
                                        disabled={!isSaveAllow}
                                        onClick={handleUpdate}
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]" onClick={handleStartEditing}>
                                        Edit
                                    </button>
                                    <button className="text-[var(--error)] hover:opacity-80" onClick={handleClickOpen}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog
                open={deleteDialogOpen}
                onClose={handleClose}
                onYes={handleDelete}
                title={'Do you want to delete this comment?'}
                description={'This action cannot be undone'}
            />
        </div>
    );
}

export default Comment;