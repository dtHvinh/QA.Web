import {AnswerResponse, QuestionResponse, VoteResponse} from "@/types/types";
import React from "react";
import getAuth from "@/helpers/auth-utils";
import {formatString} from "@/helpers/string-utils";
import {Apis, backendURL} from "@/utilities/Constants";
import {deleteFetcher, IsErrorResponse, postFetcher, putFetcher} from "@/helpers/request-utils";
import notifyError, {notifySucceed} from "@/utilities/ToastrExtensions";
import {ErrorResponse} from "@/props/ErrorResponse";
import AlertDialog from "@/components/AlertDialog";
import timeFromNow, {DEFAULT_TIME} from "@/helpers/time-utils";
import TextEditor from "@/components/TextEditor";
import RoundedButton from "@/components/RoundedButton";
import AnswerContent from "@/app/question/AnswerContent";
import {Avatar} from "@mui/material";
import {formatReputation} from "@/helpers/evaluate-utils";
import MarkAcceptedAnswerLabel from "@/app/question/MarkAcceptedAnswerLabel";
import AdminPrivilege from "@/components/Privilege/AdminPrivilege";

export default function Answer(
    {
        answer,
        question,
        isQuestionSolved,
        onAnswerDelete,
        onAnswerAccepted
    }: Readonly<{
        answer: AnswerResponse,
        question: QuestionResponse,
        isQuestionSolved: boolean,
        onAnswerDelete: (id: string) => void,
        onAnswerAccepted: (id: string) => void,
    }>) {
    const [currentText, setCurrentText] = React.useState(answer.content);
    const [editText, setEditText] = React.useState(answer.content);
    const [isAnswerAccepted, setIsAnswerAccepted] = React.useState(answer.isAccepted);
    const [currentVote, setCurrentVote] = React.useState(answer.upvote - answer.downvote);

    const [delAnsDialog, setDelAnsDialog] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isAllowUpdate, setIsAllowUpdate] = React.useState(false);

    const auth = getAuth();
    const acceptAnswerUrl = formatString(backendURL + Apis.Question.AcceptAnswer, question.id, answer.id);

    const handleClickOpen = () => {
        setDelAnsDialog(true);
    };

    const handleClose = () => {
        setDelAnsDialog(false);
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
        setIsAllowUpdate(true);
    }

    const handleAnswerAccepted = async () => {
        const response = await putFetcher([acceptAnswerUrl, auth!.accessToken, '']);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).title);
            return;
        }

        onAnswerAccepted(answer.id);
        setIsAnswerAccepted(true);
    }

    const handleDelete = async () => {
        const requestUrl = formatString(backendURL + Apis.Answer.Delete, answer.id);

        const response = await deleteFetcher([requestUrl, auth!.accessToken]);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).title);
        } else {
            setIsDeleting(true);
            setTimeout(() => {
                onAnswerDelete(answer.id);
            }, 500);
        }
    }

    const handleEdit = async () => {
        const requestUrl = formatString(backendURL + Apis.Answer.Update, answer.id);
        const response = await putFetcher([requestUrl, auth!.accessToken, JSON.stringify({
            content: editText
        })]);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).title);
        } else {
            answer = response as AnswerResponse;
            setCurrentText(editText);
            setIsEditing(false);

            notifySucceed('Comment updated successfully');
        }
    }

    const handleVote = async (isUpvote: boolean) => {
        const requestUrl = `${backendURL}/api/answer/${answer.id}/${isUpvote ? 'upvote' : 'downvote'}/`;

        const response = await postFetcher([requestUrl, auth!.accessToken, '']);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).title);
        } else {
            notifySucceed('Done');
            const voteResponse = response as VoteResponse;
            setCurrentVote(voteResponse.currentUpvote - voteResponse.currentDownvote);
        }
    }

    return (
        <div className={'border-b'}>
            <AlertDialog open={delAnsDialog}
                         onClose={handleClose}
                         onYes={handleDelete}
                         title={'Do you want to delete this answer ?'}
                         description={'This action can not undo'}/>


            <div
                className={`relative grid grid-cols-6 gap-4 p-4 mb-8 rounded-lg bg-white 
            ${isDeleting ? 'element-exit element-exit-active' : ''}`}>

                <div className={'col-span-1 row-span-full justify-items-center space-y-3'}>
                    <div>
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
                    </div>
                    <div>{currentVote}</div>
                    <div>
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
                    </div>
                    {isAnswerAccepted &&
                        <MarkAcceptedAnswerLabel/>
                    }
                    <AdminPrivilege>
                        {!isAnswerAccepted &&
                            <div>
                                <RoundedButton
                                    onClick={handleAnswerAccepted}
                                    title={'Mark as answer'}
                                    className={'bg-green-300 text-black hover:bg-green-400 active:bg-green-500'}
                                    svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                              fill="currentColor"
                                              className="bi bi-check2" viewBox="0 0 16 16">
                                        <path
                                            d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
                                    </svg>}
                                />
                            </div>
                        }
                    </AdminPrivilege>
                </div>

                <div className={'col-span-5 row-span-full'}>
                    <div className="relative justify-end flex gap-4">
                        {answer.resourceRight == 'Owner'
                            &&
                            <div className={'flex flex-col'}>
                                <div className={'flex justify-end'}>
                                    {isEditing
                                        ?
                                        <div className={'flex gap-4'}>
                                            <button className={'text-red-500'} onClick={handleDiscard}>
                                                Discard
                                            </button>
                                            <button className={'text-blue-500 disabled:text-gray-500'}
                                                    disabled={!isAllowUpdate}
                                                    onClick={handleEdit}>
                                                Save
                                            </button>
                                        </div>
                                        :
                                        <div className={'flex gap-4'}>
                                            <button type={"button"} onClick={handleStartEditing}>
                                                Edit
                                            </button>
                                            <button type={"button"} className={'text-red-500'}
                                                    onClick={handleClickOpen}>
                                                Delete
                                            </button>
                                        </div>
                                    }
                                </div>
                                <div className={'flex flex-col text-right'}>
                                    <span
                                        className="text-gray-400 text-sm">Answered {timeFromNow(answer.createdAt)}</span>
                                    {answer.updatedAt !== DEFAULT_TIME &&
                                        <span
                                            className="text-gray-400 text-sm">Edited {timeFromNow(answer.updatedAt)}</span>
                                    }
                                </div>
                            </div>
                        }
                    </div>

                    <div>
                        {isEditing
                            ? <TextEditor currentText={currentText} onTextChange={handleEditTextChange}/>
                            :
                            <AnswerContent content={currentText}/>
                        }
                    </div>

                    <div className={'flex justify-end'}>
                        <div className={'p-4 gap-4 flex text-sm items-center'}>
                            <div>
                                <div className={'text-gray-500'}>
                                    {answer.author?.username}
                                </div>
                                <div className={'text-gray-500'}>
                                    Reputation: <span
                                    className={'font-bold'}>{formatReputation(answer.author?.reputation)}</span>
                                </div>
                            </div>
                            <div>
                                <Avatar sx={{width: 32, height: 32}} src={answer.author?.profilePicture}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}