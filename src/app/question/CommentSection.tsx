import Comment from "@/app/question/Comment";
import TextEditor from "@/components/TextEditor";
import getAuth from "@/helpers/auth-utils";
import { IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import { CommentResponse, QuestionResponse } from "@/types/types";
import { Apis, backendURL } from "@/utilities/Constants";
import React from "react";


export default function CommentSection({ question, isClosed }: { question: QuestionResponse, isClosed: boolean }) {
    const [currentText, setCurrentText] = React.useState('');
    const [comments, setComments] = React.useState(question.comments ?? []);
    const [isComment, setIsComment] = React.useState(false);
    const [isReset, setIsReset] = React.useState(false);

    const auth = getAuth();
    const requestUrl = `${backendURL}${Apis.Question.CreateComment}/${question.id}/comment`

    const handleTextChange = (text: string) => {
        setCurrentText(text);
    }

    const handleCommentDelete = (commentId: string) => {
        setComments(comments.filter(comment => comment.id !== commentId));
        question.commentCount--;
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

    return (
        <div className="space-y-4">
            {comments.length > 0 && (
                <div className="space-y-2 divide-gray-100">
                    {comments.map(comment => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            onCommentDelete={handleCommentDelete}
                        />
                    ))}
                </div>
            )}

            {!isClosed && (
                <div className="space-y-4">
                    {!isComment ? (
                        <button
                            onClick={() => setIsComment(true)}
                            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                            </svg>
                            Add a comment
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <TextEditor
                                resetFlag={isReset}
                                currentText={currentText}
                                onTextChange={handleTextChange}
                            />
                            <div className="flex justify-end">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsComment(false)}
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
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
