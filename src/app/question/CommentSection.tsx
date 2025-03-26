import Comment from "@/app/question/Comment";
import PermissionAction from "@/components/PermissionAction";
import { getFetcher, IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import { CommentResponse, QuestionResponse } from "@/types/types";
import { Apis } from "@/utilities/Constants";
import { CommentOutlined } from "@mui/icons-material";
import { Box, TextField, Typography } from "@mui/material";
import React, { useMemo } from "react";


export default function CommentSection({ question, isClosed }: { question: QuestionResponse, isClosed: boolean }) {
    const [currentText, setCurrentText] = React.useState('');
    const [comments, setComments] = React.useState(question.comments ?? []);
    const [isComment, setIsComment] = React.useState(false);
    const [isReset, setIsReset] = React.useState(false);
    const [pageIndex, setPageIndex] = React.useState(2);
    const [hasMore, setHasMore] = React.useState(true);

    const requestUrl = `${Apis.Question.CreateComment}/${question.id}/comment`

    const handleTextChange = (text: string) => {
        setCurrentText(text);
    }

    const handleCommentDelete = (commentId: string) => {
        setComments(comments.filter(comment => comment.id !== commentId));
        question.commentCount--;
    }

    const fetchMoreComment = async () => {
        const response = await getFetcher(`/api/question/${question.id}/comments?pageIndex=${pageIndex}&pageSize=10`)

        if (!IsErrorResponse(response)) {
            setComments([...comments, ...(response as CommentResponse[])]);

            if (response.length == 0)
                setHasMore(false)

            setPageIndex(pageIndex + 1);
        }
    }

    const handleSend = async () => {
        const response = await postFetcher(
            requestUrl,
            JSON.stringify({
                content: currentText
            }));

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
        <Box className="p-3">
            <div className="flex items-center gap-1.5 text-[var(--text-primary)] font-medium mb-3">
                <CommentOutlined />
                <Typography variant="h6">Comments</Typography>
                <span className="text-xs text-[var(--text-secondary)]">({question.commentCount})</span>
            </div>

            {comments.length > 0 && (
                <div className="px-3 space-y-3">
                    <div className="space-y-2">
                        {memoizedComments}
                    </div>

                    {hasMore && (
                        <button
                            onClick={fetchMoreComment}
                            className="w-full py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--hover-background)] bg-[var(--hover-background)] bg-opacity-50 rounded-md transition-colors"
                        >
                            Load More Comments
                        </button>
                    )}
                </div>
            )}

            {!isClosed && (
                <div className="space-y-3 mt-5">
                    {!isComment ? (
                        <div className="flex justify-end">
                            <PermissionAction
                                action="comment"
                                callback={() => setIsComment(true)}
                                className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors text-xs font-medium"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>
                                Add a comment
                            </PermissionAction>
                        </div>
                    ) : (
                        <div className="space-y-3">
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
                                        color: 'var(--text-primary)',
                                        backgroundColor: 'var(--input-background)',
                                        fontSize: '0.875rem',
                                        '& fieldset': {
                                            borderColor: 'var(--border-color)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--primary)',
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "var(--primary)"
                                        }
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: 'var(--text-tertiary)',
                                    },
                                }}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setIsComment(false);
                                        setCurrentText('');
                                    }}
                                    className="px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--hover-background)] rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={currentText.length === 0}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-darker)] disabled:bg-[var(--disabled-background)] disabled:text-[var(--text-tertiary)] transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
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
