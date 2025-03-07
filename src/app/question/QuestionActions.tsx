import AlertDialog from "@/components/AlertDialog";
import AddToCollection from "@/components/Collection/AddToCollection";
import PermissionAction from "@/components/PermissionAction";
import ModeratorPrivilege from "@/components/Privilege/ModeratorPrivilege";
import getAuth from "@/helpers/auth-utils";
import { deleteFetcher, IsErrorResponse, postFetcher, putFetcher } from "@/helpers/request-utils";
import { ErrorResponse } from "@/props/ErrorResponse";
import { QuestionResponse, VoteResponse } from "@/types/types";
import notifyError, { notifyInfo, notifySucceed } from "@/utilities/ToastrExtensions";
import { BookmarkAdded, BookmarkAddOutlined, Close, Delete, OpenInFull } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function QuestionActions({ question, onQuestionClose, className }: {
    question: QuestionResponse,
    onQuestionClose?: () => void,
    className?: string
}) {
    const auth = getAuth();
    const [currentVote, setCurrentVote] = React.useState<number>(question.score);
    const [isBookmarked, setIsBookmarked] = React.useState<boolean>(question.isBookmarked);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [closeConfirmOpen, setCloseConfirmOpen] = React.useState(false);
    const [isExpand, setIsExpand] = useState(false)
    const router = useRouter();

    const toggleExpand = () => setIsExpand(!isExpand);

    const handleCloseQuestion = async () => {
        const response = await putFetcher([
            `/api/question/${question.id}/close`,
            auth!.accessToken, '']);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).errors);
        } else {
            notifySucceed('Question closed');
            onQuestionClose?.();
        }
    }

    const handleDeleteQuestion = async () => {
        const response = await deleteFetcher([
            `/api/question/${question.id}`,
            auth!.accessToken]);

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

        const response = await postFetcher([requestUrl, auth!.accessToken, '']);

        if (!IsErrorResponse(response)) {
            const voteResponse = response as VoteResponse;
            setCurrentVote(voteResponse.score);
        }
    }

    const handleBookmarkQuestion = async () => {
        const response = await postFetcher([
            `/api/bookmark/${question.id}`,
            auth!.accessToken, '']);

        if (!IsErrorResponse(response)) {
            notifySucceed('Question bookmarked');
            setIsBookmarked(!isBookmarked);
        }
    }

    const handleReOpenQuestion = async () => {

    }
    return (
        <div className={`${className} flex flex-col items-center gap-2 p-4`}>
            <div className="flex flex-col items-center gap-2">
                <PermissionAction
                    action="upvote"
                    callback={() => handleVote(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                </PermissionAction>

                <span className="text-lg font-semibold text-gray-900">{currentVote}</span>

                <PermissionAction
                    action="downvote"
                    callback={() => handleVote(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </PermissionAction>
            </div>

            <div className="w-full h-px bg-gray-200 my-2"></div>

            <div className="flex flex-col items-center gap-2">
                <button
                    onClick={handleBookmarkQuestion}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title={isBookmarked ? "Remove bookmark" : "Bookmark question"}
                >
                    {isBookmarked ? (
                        <BookmarkAdded className="text-blue-600" />
                    ) : (
                        <BookmarkAddOutlined className="text-gray-700" />
                    )}
                </button>

                <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Share question"
                >
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                </button>

                <AddToCollection questionId={question.id} />

                <button
                    onClick={() => router.push(`/question/history?qid=${question.id}`)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="View history"
                >
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>

            <ModeratorPrivilege>
                <div className="w-full h-px bg-gray-200 my-2"></div>
                <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <Delete />
                </button>

                {!question.isClosed ? (
                    <button
                        onClick={() => setCloseConfirmOpen(true)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <Close />
                    </button>
                ) : (
                    <button
                        onClick={handleReOpenQuestion}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <OpenInFull />
                    </button>
                )}
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