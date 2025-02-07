import {QuestionResponse, VoteResponse} from "@/types/types";
import RoundedButton from "@/components/RoundedButton";
import {Checkbox, Tooltip} from "@mui/material";
import {BookmarkAdded, BookmarkAddOutlined} from "@mui/icons-material";
import QuestionSectionOptions from "@/app/question/QuestionSectionOptions";
import React from "react";
import notifyError, {notifyInfo, notifySucceed} from "@/utilities/ToastrExtensions";
import {backendURL} from "@/utilities/Constants";
import {fetcher, IsErrorResponse, postFetcher} from "@/helpers/request-utils";
import {ErrorResponse} from "@/props/ErrorResponse";
import getAuth from "@/helpers/auth-utils";

export default function QuestionInteractivity(
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

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).title);
        } else {
            const voteResponse = response as VoteResponse;
            setCurrentVote(voteResponse.currentUpvote - voteResponse.currentDownvote);
        }
    }

    const handleBookmarkQuestion = async () => {
        const response = await fetcher([
            'POST',
            `${backendURL}/api/bookmark/${question.id}`,
            auth!.accessToken, '']);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).errors);
        } else {
            notifySucceed('Question bookmarked');
            setIsBookmarked(!isBookmarked);
        }
    }

    const handleQuestionClose = () => {
        onQuestionClose?.();
    }

    return (
        <div
            className={'col-span-2 md:col-span-1 row-span-full justify-items-center space-y-5'}>
            <RoundedButton
                title={'Upvote'}
                svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
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
                          d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
                </svg>}
                onClick={() => handleVote(false)}
            />
            <div>
                <RoundedButton
                    title={'Share'}
                    onClick={handleShare}
                    svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                              className="bi bi-share" viewBox="0 0 16 16">
                        <path
                            d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
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
                            ":hover": {"backgroundColor": "#D1D5DB"}
                        }}
                        icon={<BookmarkAddOutlined/>}
                        checkedIcon={<BookmarkAdded color={'action'}/>}
                        onChange={handleBookmarkQuestion}
                    />
                </Tooltip>
            </div>
            <div>
                <QuestionSectionOptions question={question} onQuestionClose={handleQuestionClose}/>
            </div>
        </div>

    );
}