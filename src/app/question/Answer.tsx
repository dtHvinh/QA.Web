import {AnswerResponse} from "@/types/types";
import React from "react";
import getAuth from "@/helpers/auth-utils";
import {formatString} from "@/helpers/string-utils";
import {Apis, backendURL} from "@/utilities/Constants";
import {deleteFetcher, IsErrorResponse, putFetcher} from "@/helpers/request-utils";
import notifyError, {notifySucceed} from "@/utilities/ToastrExtensions";
import {ErrorResponse} from "@/props/ErrorResponse";
import AlertDialog from "@/components/AlertDialog";
import {Avatar} from "@mui/material";
import timeFromNow, {DEFAULT_TIME} from "@/helpers/time-utils";
import TextEditor from "@/components/TextEditor";
import RoundedButton from "@/components/RoundedButton";
import AnswerContent from "@/app/question/AnswerContent";

export default function Answer(
    {
        answer,
        questionId,
        isAnyAnswerAccepted,
        onAnswerDelete,
        onAnswerAccepted
    }: Readonly<{
        answer: AnswerResponse,
        questionId: string,
        onAnswerDelete: (id: string) => void,
        isAnyAnswerAccepted: boolean,
        onAnswerAccepted: (id: string) => void,
    }>) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [currentText, setCurrentText] = React.useState(answer.content);
    const [editText, setEditText] = React.useState(answer.content);
    const [delAnsDialog, setDelAnsDialog] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isAllowUpdate, setIsAllowUpdate] = React.useState(false);
    const auth = getAuth();
    const acceptAnswerUrl = formatString(backendURL + Apis.Question.AcceptAnswer, questionId, answer.id);

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

    const handleAccept = async () => {
        const response = await putFetcher([acceptAnswerUrl, auth!.accessToken, '']);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).title);
            return;
        }

        onAnswerAccepted(answer.id);
        answer.isAccepted = true;
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

    const handleUpdate = async () => {
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

    return (
        <>
            <AlertDialog open={delAnsDialog}
                         onClose={handleClose}
                         onYes={handleDelete}
                         title={'Do you want to delete this answer ?'}
                         description={'This action can not undo'}/>


            <div
                className={`relative grid grid-cols-6 gap-4 p-4 mb-8 rounded-lg bg-white 
            ${isDeleting ? 'comment-exit comment-exit-active' : ''}`}>

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
                        />
                    </div>
                    <div>{answer.upvote - answer.downvote}</div>
                    <div>
                        <RoundedButton
                            title={'Downvote'}
                            svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                      fill="currentColor"
                                      viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                      d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
                            </svg>}
                        />
                    </div>
                    {!isAnyAnswerAccepted &&
                        <div>
                            <RoundedButton
                                onClick={handleAccept}
                                title={'Mark as answer'}
                                className={'bg-green-300 text-black hover:bg-green-400 active:bg-green-500'}
                                svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                          className="bi bi-check2" viewBox="0 0 16 16">
                                    <path
                                        d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
                                </svg>}
                            />
                        </div>}
                </div>

                <div className={'col-span-5 row-span-full'}>
                    <div className="relative justify-between flex gap-4">
                        <div className="flex items-center gap-4">
                            <Avatar alt={answer.author?.username} src={answer.author?.profilePicture}/>
                            <div className="flex flex-col w-full">
                                <div className="flex flex-row justify-between">
                                    <p className="relative text-xl whitespace-nowrap truncate overflow-hidden">
                                        {answer.author?.username}
                                    </p>
                                </div>
                                <div className="text-gray-400 text-sm font-bold">
                                    {answer.author?.reputation}
                                </div>
                            </div>
                        </div>
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
                                                    onClick={handleUpdate}>
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
                                        className="text-gray-400 text-sm">Created: {timeFromNow(answer.createdAt)}</span>
                                    {answer.updatedAt !== DEFAULT_TIME &&
                                        <span
                                            className="text-gray-400 text-sm">Edited: {timeFromNow(answer.updatedAt)}</span>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                    <div className={'mt-5'}>
                        {isEditing
                            ? <TextEditor currentText={currentText} onTextChange={handleEditTextChange}/>
                            :
                            <AnswerContent content={currentText}/>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}