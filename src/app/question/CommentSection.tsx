import {CommentResponse, QuestionResponse} from "@/types/types";
import TextEditor from "@/components/TextEditor";
import React, {useContext} from "react";
import {Apis, backendURL} from "@/utilities/Constants";
import {fetcher, IsErrorResponse} from "@/helpers/request-utils";
import {AuthContext} from "@/context/AuthContextProvider";
import notifyError from "@/utilities/ToastrExtensions";
import {ErrorResponse} from "@/props/ErrorResponse";
import Comment from "@/app/question/Comment";

export default function CommentSection({question}: { question: QuestionResponse }) {
    const [currentText, setCurrentText] = React.useState('');
    const [comments, setComments] = React.useState(question.comments);

    const auth = useContext(AuthContext);
    const requestUrl = `${backendURL}${Apis.Question.CreateComment}/${question.id}/comment`

    const onTextChange = (text: string) => {
        setCurrentText(text);
    }

    const handleCommentDelete = (commentId: string) => {
        setComments(comments.filter(comment => comment.id !== commentId));
    }

    const handleSend = async () => {

        const response = await fetcher<CommentResponse>([
            'POST',
            requestUrl,
            auth!.accessToken,
            JSON.stringify({
                content: currentText
            })]);

        if (IsErrorResponse(response)) {
            console.log(response as ErrorResponse);
            notifyError((response as ErrorResponse).title);
        } else {
            setComments([...comments, response as CommentResponse]);
        }
    }

    return (
        <div className={'flex flex-col gap-2'}>
            <div>
                Comments ({question.commentCount})
            </div>

            {question.comments.length == 0 &&
                <div className={'text-gray-500'}>No comments yet</div>}

            <div>
                {comments.map(comment => (
                    <Comment key={comment.id} comment={comment} onCommentDelete={handleCommentDelete}/>
                ))}
            </div>

            <div>
                <TextEditor currentText={''} onTextChange={onTextChange}/>
                <div className={'w-full text-end pr-4'}>
                    <button onClick={handleSend}
                            className={'space-x-3 p-2 bg-gray-200 rounded-b-xl hover:bg-gray-300 active:scale-95'}>
                        <div className={'inline-block mt-1'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 viewBox="0 0 16 16">
                                <path
                                    d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                            </svg>
                        </div>

                        <span className={'inline-block'}>Send</span>
                    </button>
                </div>
            </div>
        </div>
    )
}