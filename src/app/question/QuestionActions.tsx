import ModeratorButton from "@/components/Admin/ModeratorButton";
import AlertDialog from "@/components/AlertDialog";
import AddToCollection from "@/components/Collection/AddToCollection";
import PermissionAction from "@/components/PermissionAction";
import ModeratorPrivilege from "@/components/Privilege/ModeratorPrivilege";
import ReportDialog from "@/components/ReportDialog";
import { deleteFetcher, IsErrorResponse, postFetcher, putFetcher } from "@/helpers/request-utils";
import { QuestionResponse, VoteResponse } from "@/types/types";
import notifyError, { notifyInfo, notifySucceed } from "@/utilities/ToastrExtensions";
import { BookmarkAdded, BookmarkAddOutlined, Close, Delete, DeleteForeverOutlined, FileCopyOutlined, OpenInFull, ReportOutlined } from "@mui/icons-material";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function QuestionActions({
    question,
    isClosed,
    isDuplicated,
    onQuestionClose,
    onQuestionReopen,
    onSetDuplicated,
    onRemoveDuplicateFlag,
    className
}: {
    question: QuestionResponse,
    onQuestionClose?: () => void,
    onSetDuplicated?: (duplicateUrl: string) => void,
    onRemoveDuplicateFlag?: () => void,
    onQuestionReopen?: () => void,
    isClosed: boolean,
    isDuplicated: boolean,
    className?: string
}) {
    const [currentVote, setCurrentVote] = React.useState<number>(question.score);
    const [isBookmarked, setIsBookmarked] = React.useState<boolean>(question.isBookmarked);
    const [modDeleteConfirmOpen, setModDeleteConfirmOpen] = React.useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [closeConfirmOpen, setCloseConfirmOpen] = React.useState(false);
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [duplicateUrl, setDuplicateUrl] = useState('');
    const [reportDialogOpen, setReportDialogOpen] = useState(false);

    const handleFlagDuplicate = async () => {
        const response = await putFetcher(`/api/question/duplicate`, JSON.stringify({
            duplicateUrl: duplicateUrl,
            questionId: question.id
        }));

        if (!IsErrorResponse(response)) {
            notifySucceed('Question marked as duplicate');
            handleMenuClose();
            onSetDuplicated?.(duplicateUrl);
        }
    }

    const handleRemoveDuplicateFlag = async () => {
        const response = await putFetcher(`/api/question/${question.id}/remove-duplicate-flag`);

        if (!IsErrorResponse(response)) {
            notifySucceed('Question duplicate flag removed');
            handleMenuClose();
            onRemoveDuplicateFlag?.();
        }
    }

    const handleCloseQuestion = async () => {
        const response = await putFetcher(`/api/question/${question.id}/close`);

        if (!IsErrorResponse(response)) {
            notifySucceed('Question closed');
            onQuestionClose?.();
        }
    }

    const handleDeleteQuestion = async () => {
        const response = await deleteFetcher(`/api/question/${question.id}`);

        if (!IsErrorResponse(response)) {
            notifySucceed('Question deleted');
            window.history.go(-1);
        }
    }

    const handleModDeleteQuestion = async () => {
        const response = await deleteFetcher(`/api/mod/question/${question.id}`);

        if (!IsErrorResponse(response)) {
            notifySucceed('Question deleted');
            window.history.go(-1);
        }
    }

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            notifyInfo('Link copied to clipboard');
        } catch {
            notifyError('Failed to copy link');
        }
    }

    const handleVote = async (isUpvote: boolean) => {
        const response = await postFetcher(`/api/question/${question.id}/${isUpvote ? 'upvote' : 'downvote'}/`);

        if (!IsErrorResponse(response)) {
            const voteResponse = response as VoteResponse;
            setCurrentVote(voteResponse.score);
        }

    }

    const handleBookmarkQuestion = async () => {
        const response = await postFetcher(`/api/bookmark/${question.id}`);

        if (!IsErrorResponse(response)) {
            notifySucceed('Question bookmarked');
            setIsBookmarked(!isBookmarked);
        }
    }

    const handleReOpenQuestion = async () => {
        const response = await putFetcher(`/api/question/${question.id}/re-open`);

        if (!IsErrorResponse(response)) {
            notifySucceed('Done');
            onQuestionReopen?.();
        }
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleReportQuestion = () => {
        setReportDialogOpen(true);
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
        setDuplicateUrl('');
    };

    return (
        <div className={`${className} flex flex-col items-center gap-2 p-4`}>
            <div className="flex flex-col items-center gap-2">
                <PermissionAction
                    action="upvote"
                    callback={() => handleVote(true)}
                    className="p-2 rounded-full hover:bg-[var(--hover-background)] transition-colors"
                >
                    <svg className="w-6 h-6 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                </PermissionAction>

                <span className="text-lg font-semibold text-[var(--text-primary)]">{currentVote}</span>

                <PermissionAction
                    action="downvote"
                    callback={() => handleVote(false)}
                    className="p-2 rounded-full hover:bg-[var(--hover-background)] transition-colors"
                >
                    <svg className="w-6 h-6 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </PermissionAction>
            </div>

            <div className="w-full h-px bg-[var(--border-color)] my-2"></div>

            <div className="flex flex-col items-center gap-2">
                <button
                    onClick={handleBookmarkQuestion}
                    className="p-2 rounded-full hover:bg-[var(--hover-background)] transition-colors"
                    title={isBookmarked ? "Remove bookmark" : "Bookmark question"}
                >
                    {isBookmarked ? (
                        <BookmarkAdded className="text-[var(--primary)]" />
                    ) : (
                        <BookmarkAddOutlined className="text-[var(--text-secondary)]" />
                    )}
                </button>

                <button
                    onClick={handleReportQuestion}
                    className="p-2 rounded-full hover:bg-[var(--hover-background)] transition-colors"
                    title="Report question"
                >
                    <ReportOutlined className="text-[var(--text-secondary)]" />
                </button>

                <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-[var(--hover-background)] transition-colors"
                    title="Share question"
                >
                    <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                </button>

                <AddToCollection questionId={question.id} />

                <button
                    onClick={() => router.push(`/question/history?qid=${question.id}`)}
                    className="p-2 rounded-full hover:bg-[var(--hover-background)] transition-colors"
                    title="View history"
                >
                    <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>

                <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="p-2 rounded-full hover:bg-[var(--hover-background)] transition-colors"
                    title="Delete question"
                >
                    <DeleteForeverOutlined />
                </button>
            </div>

            <ModeratorPrivilege>
                <div className="w-full h-px bg-[var(--border-color)] my-2"></div>
                <ModeratorButton onClick={handleMenuOpen} />

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    sx={{
                        '& .MuiPaper-root': {
                            bgcolor: 'var(--card-background)',
                            color: 'var(--text-primary)',
                            width: 280,
                        },
                        '& .MuiMenuItem-root': {
                            color: 'var(--text-secondary)',
                            '&:hover': {
                                bgcolor: 'var(--hover-background)',
                            },
                        },
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            setModDeleteConfirmOpen(true);
                        }}
                    >
                        <ListItemIcon>
                            <Delete className="text-[var(--text-secondary)]" />
                        </ListItemIcon>
                        <ListItemText>Delete Question</ListItemText>
                    </MenuItem>

                    {!isClosed ? (
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                setCloseConfirmOpen(true);
                            }}
                        >
                            <ListItemIcon>
                                <Close className="text-[var(--text-secondary)]" />
                            </ListItemIcon>
                            <ListItemText>Close Question</ListItemText>
                        </MenuItem>
                    ) : (
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                handleReOpenQuestion();
                            }}
                        >
                            <ListItemIcon>
                                <OpenInFull className="text-[var(--text-secondary)]" />
                            </ListItemIcon>
                            <ListItemText>Reopen Question</ListItemText>
                        </MenuItem>
                    )}

                    <div className="p-5 mt-2">
                        <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] mb-2">
                            <FileCopyOutlined fontSize="small" />
                            Mark as duplicate
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={duplicateUrl}
                                onChange={(e) => setDuplicateUrl(e.target.value)}
                                placeholder="Enter question URL"
                                className="flex-1 px-3 py-1.5 text-sm rounded border border-[var(--border-color)] 
                                        bg-[var(--input-background)] text-[var(--text-primary)] 
                                        placeholder:text-[var(--text-tertiary)] outline-none"
                            />
                            <button
                                onClick={handleFlagDuplicate}
                                className="px-3 py-1.5 text-sm rounded bg-[var(--primary)] text-white 
                                        hover:bg-[var(--primary-darker)] transition-colors"
                            >
                                Set
                            </button>
                        </div>
                    </div>

                    {isDuplicated &&
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                handleRemoveDuplicateFlag();
                            }}
                        >
                            <ListItemIcon>
                                <FileCopyOutlined className="text-[var(--text-primary)]" />
                            </ListItemIcon>
                            <ListItemText>Remove duplicate flag</ListItemText>
                        </MenuItem>
                    }
                </Menu>
            </ModeratorPrivilege>

            <AlertDialog
                open={modDeleteConfirmOpen}
                title="Delete Question"
                description="Are you sure you want to delete this question? This action cannot be undone."
                onClose={() => setModDeleteConfirmOpen(false)}
                onYes={handleModDeleteQuestion}
            />

            <AlertDialog
                open={deleteConfirmOpen}
                title="Delete Question"
                description="Are you sure you want to delete this question? This action cannot be undone."
                onClose={() => setDeleteConfirmOpen(false)}
                onYes={handleDeleteQuestion}
            />

            <AlertDialog
                open={closeConfirmOpen}
                title="Close Question"
                description="Are you sure you want to close this question? This will prevent new answers."
                onClose={() => setCloseConfirmOpen(false)}
                onYes={handleCloseQuestion}
            />

            <ReportDialog
                open={reportDialogOpen}
                onClose={() => setReportDialogOpen(false)}
                targetId={question.id}
                targetType="Question"
            />
        </div >
    );
}