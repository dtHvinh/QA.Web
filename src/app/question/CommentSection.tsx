import Comment from "@/app/question/Comment";
import PermissionAction from "@/components/PermissionAction";
import getAuth from "@/helpers/auth-utils";
import { getFetcher, IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import { CommentResponse, QuestionResponse } from "@/types/types";
import { Apis } from "@/utilities/Constants";
import { Box, TextField, Typography } from "@mui/material";
import React, { useMemo } from "react";


export default function CommentSection({ question, isClosed }: { question: QuestionResponse, isClosed: boolean }) {
    const [currentText, setCurrentText] = React.useState('');
    const [comments, setComments] = React.useState(question.comments ?? []);
    const [isComment, setIsComment] = React.useState(false);
    const [isReset, setIsReset] = React.useState(false);
    const [pageIndex, setPageIndex] = React.useState(2);
    const [hasMore, setHasMore] = React.useState(true);

    const auth = getAuth();
    const requestUrl = `${Apis.Question.CreateComment}/${question.id}/comment`

    const handleTextChange = (text: string) => {
        setCurrentText(text);
    }

    const handleCommentDelete = (commentId: string) => {
        setComments(comments.filter(comment => comment.id !== commentId));
        question.commentCount--;
    }

    const fetchMoreComment = async () => {
        const response = await getFetcher([
            `/api/question/${question.id}/comments?pageIndex=${pageIndex}&pageSize=10`, auth!.accessToken])

        if (!IsErrorResponse(response)) {
            setComments([...comments, ...(response as CommentResponse[])]);

            if (response.length == 0)
                setHasMore(false)

            setPageIndex(pageIndex + 1);
        }
    }

    const handleSend = async () => {
        const response = await postFetcher([
            requestUrl,
            auth!.accessToken,
            JSON.stringify({
                content: currentText
            })]);

        if (!IsErrorResponse(response)) {
            setComments([...comments, response as CommentResponse]);
            setCurrentText('');
            question.commentCount++;
        }

        setIsReset(!isReset);
    }

    const memoizedComments = useMemo(() => (
        comments.map(comment => (
            <Comment
                key={comment.id}
                comment={comment}
                onCommentDelete={handleCommentDelete}
            />
        ))
    ), [comments]);

    return (
        <Box className="p-4">
            <div className="flex items-center gap-2 text-gray-900 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                    <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                </svg>
                <Typography typography={'h5'}>Comments</Typography>
                <span className="text-sm text-gray-500">({question.commentCount})</span>
            </div>

            {comments.length > 0 && (
                <div className="px-5 space-y-4">
                    <div className="space-y-4">
                        {memoizedComments}
                    </div>

                    {hasMore && (
                        <button
                            onClick={fetchMoreComment}
                            className="w-full py-2 text-sm text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors"
                        >
                            Load More Comments
                        </button>
                    )}
                </div>
            )}

            {!isClosed && (
                <div className="space-y-4">
                    {!isComment ? (
                        <div className="flex justify-end">
                            <PermissionAction
                                action="comment"
                                callback={() => setIsComment(true)}
                                className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>
                                Add a comment
                            </PermissionAction>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <TextField
                                fullWidth
                                minRows={2}
                                multiline
                                placeholder="Write your comment..."
                                value={currentText}
                                onChange={(e) => handleTextChange(e.target.value)}
                                size="small"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": {
                                            borderColor: "black"
                                        }
                                    }
                                }}
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setIsComment(false);
                                        setCurrentText('');
                                    }}
                                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={currentText.length === 0}
                                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                                    </svg>
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Box>
    );
}
