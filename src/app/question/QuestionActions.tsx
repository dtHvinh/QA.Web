import AlertDialog from "@/components/AlertDialog";
import AddToCollection from "@/components/Collection/AddToCollection";
import ModeratorPrivilege from "@/components/Privilege/ModeratorPrivilege";
import RoundedButton from "@/components/RoundedButton";
import getAuth from "@/helpers/auth-utils";
import { deleteFetcher, IsErrorResponse, postFetcher, putFetcher } from "@/helpers/request-utils";
import { ErrorResponse } from "@/props/ErrorResponse";
import { QuestionResponse, VoteResponse } from "@/types/types";
import { backendURL, Routes } from "@/utilities/Constants";
import notifyError, { notifyInfo, notifySucceed } from "@/utilities/ToastrExtensions";
import { BookmarkAdded, BookmarkAddOutlined, Expand, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Checkbox, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { use, useState } from "react";

export default function QuestionActions(
    {
        question,
        onQuestionClose,
    }: {
        question: QuestionResponse,
        onQuestionClose?: () => void
    }) {
    const auth = getAuth();
    const [currentVote, setCurrentVote] = React.useState<number>(question.upvote - question.downvote);
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

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).errors);
        } else {
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
        const requestUrl = `${backendURL}/api/question/${question.id}/${isUpvote ? 'upvote' : 'downvote'}/`;

        const response = await postFetcher([requestUrl, auth!.accessToken, '']);

        if (!IsErrorResponse(response)) {
            const voteResponse = response as VoteResponse;
            setCurrentVote(voteResponse.currentUpvote - voteResponse.currentDownvote);
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
        <div
            className={'col-span-2 md:col-span-1 row-span-full justify-items-center space-y-5'}>
            <AlertDialog open={deleteConfirmOpen}
                title={'Do you want to delete this question'}
                description={'This action cannot be undone'}
                onClose={() => setDeleteConfirmOpen(false)}
                onYes={handleDeleteQuestion} />

            <AlertDialog open={closeConfirmOpen}
                title={'Do you want to close this question'}
                description={'This action cannot be undone'}
                onClose={() => setCloseConfirmOpen(false)}
                onYes={handleCloseQuestion} />


            <RoundedButton
                title={'Upvote'}
                svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                </svg>}
                onClick={() => handleVote(true)}
            />
            <div>{currentVote}</div>
            <RoundedButton
                title={'Downvote'}
                svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                        d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8" />
                </svg>}
                onClick={() => handleVote(false)}
            />
            <hr className="w-1/2"></hr>

            {!isExpand &&
                <div>
                    <button onClick={toggleExpand}><ExpandMore /></button>
                </div>}

            {isExpand && (<>
                <div>
                    <RoundedButton
                        title={'Share'}
                        onClick={handleShare}
                        svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            className="bi bi-share" viewBox="0 0 16 16">
                            <path
                                d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
                        </svg>}
                    />
                </div>
                <div>
                    <RoundedButton
                        href={`/question/history?qid=${question.id}`}
                        title={'History'}
                        svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            className="bi bi-clock-history" viewBox="0 0 16 16">
                            <path
                                d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
                            <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
                            <path
                                d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
                        </svg>}
                    />
                </div>
                <div>
                    <Tooltip title={'Bookmark this question'}>
                        <Checkbox
                            checked={isBookmarked}
                            sx={{
                                "padding": ".75rem",
                                "borderRadius": "9999px",
                                "backgroundColor": "#f3f4f6",
                                "transitionProperty": "all",
                                "transitionTimingFunction": "cubic-bezier(0.4, 0, 0.2, 1)",
                                "transitionDuration": "300ms",
                                ":hover": { "backgroundColor": "#D1D5DB" }
                            }}
                            icon={<BookmarkAddOutlined />}
                            checkedIcon={<BookmarkAdded color={'action'} />}
                            onChange={handleBookmarkQuestion}
                        />
                    </Tooltip>
                </div>
                <div>
                    <AddToCollection questionId={question.id} />
                </div>

                {isExpand &&
                    <div>
                        <button onClick={toggleExpand}><ExpandLess /></button>
                    </div>}
            </>
            )}
            <hr className="w-1/2"></hr>
            <div>
                <ModeratorPrivilege>
                    <RoundedButton
                        title={'Delete this question'}
                        className="flex w-full items-center gap-2 p-2 mb-1 text-sm bg-red-100 text-red-700 hover:bg-red-200"
                        onClick={() => setDeleteConfirmOpen(true)}
                        svg={
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                className="bi bi-trash3" viewBox="0 0 16 16">
                                <path
                                    d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                            </svg>
                        }>
                    </RoundedButton>
                </ModeratorPrivilege>
            </div>

            <div>
                <ModeratorPrivilege>
                    {!question.isClosed &&
                        <RoundedButton
                            title={'Close this question'}
                            onClick={() => setCloseConfirmOpen(true)}
                            svg={
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                </svg>
                            }>
                        </RoundedButton>
                        ||
                        <RoundedButton
                            title={'Reopen this question'}
                            onClick={handleReOpenQuestion}
                            svg={
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                        d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
                                    <path
                                        d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
                                </svg>
                            }>
                        </RoundedButton>
                    }
                </ModeratorPrivilege>
            </div>
        </div>

    );
}