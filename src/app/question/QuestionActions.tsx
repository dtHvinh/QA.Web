import ModeratorButton from "@/components/Admin/ModeratorButton";
import AlertDialog from "@/components/AlertDialog";
import AddToCollection from "@/components/Collection/AddToCollection";
import PermissionAction from "@/components/PermissionAction";
import ModeratorPrivilege from "@/components/Privilege/ModeratorPrivilege";
import { deleteFetcher, IsErrorResponse, postFetcher, putFetcher } from "@/helpers/request-utils";
import { QuestionResponse, VoteResponse } from "@/types/types";
import notifyError, { notifyInfo, notifySucceed } from "@/utilities/ToastrExtensions";
import { BookmarkAdded, BookmarkAddOutlined, Close, Delete, OpenInFull } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function QuestionActions({ question, isClosed, onQuestionClose, onQuestionReopen, className }: {
    question: QuestionResponse,
    onQuestionClose?: () => void,
    onQuestionReopen?: () => void,
    isClosed: boolean,
    className?: string
}) {
    const [currentVote, setCurrentVote] = React.useState<number>(question.score);
    const [isBookmarked, setIsBookmarked] = React.useState<boolean>(question.isBookmarked);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [closeConfirmOpen, setCloseConfirmOpen] = React.useState(false);
    const [isExpand, setIsExpand] = useState(false)
    const router = useRouter();

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

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            notifyInfo('Link copied to clipboard');
        } catch {
            notifyError('Failed to copy link');
        }
    }

    const handleVote = async (isUpvote: boolean) => {
        const requestUrl = `/api/question/${question.id}/${isUpvote ? 'upvote' : 'downvote'}/`;

        const response = await postFetcher(requestUrl);

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
            </div>

            <ModeratorPrivilege>
                <div className="w-full h-px bg-[var(--border-color)] my-2"></div>
                <div className="relative">
                    <ModeratorButton onClick={() => setIsExpand(!isExpand)} />

                    {isExpand && (
                        <div className="absolute left-0 mt-2 w-48 bg-[var(--card-background)] rounded-md shadow-lg py-1 z-50">
                            <Tooltip title="Moderator considered this question should be deleted" arrow placement="right">
                                <button
                                    onClick={() => setDeleteConfirmOpen(true)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-background)]"
                                >
                                    <Delete className="mr-2" /> Delete Question
                                </button>
                            </Tooltip>

                            {!isClosed ? (
                                <Tooltip title="Moderator considered this question should be closed" arrow placement="right">
                                    <button
                                        onClick={() => setCloseConfirmOpen(true)}
                                        className="flex items-center w-full px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-background)]"
                                    >
                                        <Close className="mr-2" /> Close Question
                                    </button>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Moderator considered this question should be re-opened" arrow placement="right">
                                    <button
                                        onClick={handleReOpenQuestion}
                                        className="flex items-center w-full px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-background)]"
                                    >
                                        <OpenInFull className="mr-2" /> Reopen Question
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    )}
                </div>
            </ModeratorPrivilege>

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
        </div>
    );
}