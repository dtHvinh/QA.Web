import { AnswerResponse, QuestionResponse, VoteResponse } from "@/types/types";
import React from "react";
import getAuth from "@/helpers/auth-utils";
import { formatString } from "@/helpers/string-utils";
import { Apis, backendURL } from "@/utilities/Constants";
import { deleteFetcher, IsErrorResponse, postFetcher, putFetcher } from "@/helpers/request-utils";
import notifyError, { notifySucceed } from "@/utilities/ToastrExtensions";
import { ErrorResponse } from "@/props/ErrorResponse";
import AlertDialog from "@/components/AlertDialog";
import timeFromNow, { DEFAULT_TIME } from "@/helpers/time-utils";
import TextEditor from "@/components/TextEditor";
import RoundedButton from "@/components/RoundedButton";
import AnswerContent from "@/app/question/AnswerContent";
import { Avatar } from "@mui/material";
import { formatReputation } from "@/helpers/evaluate-utils";
import MarkAcceptedAnswerLabel from "@/app/question/MarkAcceptedAnswerLabel";
import ModeratorPrivilege from "@/components/Privilege/ModeratorPrivilege";
import ResourceOwnerPrivilege from "@/components/Privilege/ResourceOwnerPrivilege";

export default function Answer(
    {
        answer,
        question,
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
        <div className="border-b last:border-b-0">
            <AlertDialog
                open={delAnsDialog}
                onClose={handleClose}
                onYes={handleDelete}
                title="Delete Answer"
                description="Are you sure you want to delete this answer? This action cannot be undone."
            />

            <div className={`relative grid grid-cols-12 gap-6 p-6 bg-white transition-all duration-300
                ${isDeleting ? 'opacity-0 transform translate-x-full' : 'opacity-100'}`}>

                {/* Vote Section */}
                <div className="col-span-1 flex flex-col items-center gap-2">
                    <RoundedButton
                        title="Upvote"
                        className="hover:bg-blue-50 active:bg-blue-100"
                        svg={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
                        </svg>}
                        onClick={() => handleVote(true)}
                    />
                    <span className="text-lg font-semibold text-gray-700">{currentVote}</span>
                    <RoundedButton
                        title="Downvote"
                        className="hover:bg-red-50 active:bg-red-100"
                        svg={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                        </svg>}
                        onClick={() => handleVote(false)}
                    />

                    {isAnswerAccepted && <MarkAcceptedAnswerLabel />}

                    <ModeratorPrivilege>
                        {!isAnswerAccepted && (
                            <RoundedButton
                                onClick={handleAnswerAccepted}
                                title="Mark as answer"
                                className="bg-green-100 text-green-700 hover:bg-green-200 active:bg-green-300"
                                svg={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                </svg>}
                            />
                        )}
                    </ModeratorPrivilege>
                </div>

                {/* Content Section */}
                <div className="col-span-11 space-y-4">
                    <div className="flex justify-between items-start">
                        <ResourceOwnerPrivilege resourceRight={answer.resourceRight}>
                            <div className="flex flex-col items-end gap-2">
                                {isEditing ? (
                                    <div className="flex gap-3">
                                        <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            onClick={handleDiscard}>
                                            Discard
                                        </button>
                                        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:bg-gray-300"
                                            disabled={!isAllowUpdate}
                                            onClick={handleEdit}>
                                            Save Changes
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                            onClick={handleStartEditing}>
                                            Edit
                                        </button>
                                        <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            onClick={handleClickOpen}>
                                            Delete
                                        </button>
                                    </div>
                                )}
                                <div className="text-sm text-gray-500 space-y-1">
                                    <div>Answered {timeFromNow(answer.createdAt)}</div>
                                    {answer.updatedAt !== DEFAULT_TIME && (
                                        <div>Edited {timeFromNow(answer.updatedAt)}</div>
                                    )}
                                </div>
                            </div>
                        </ResourceOwnerPrivilege>
                    </div>

                    <div className="prose max-w-none">
                        {isEditing ? (
                            <TextEditor currentText={currentText} onTextChange={handleEditTextChange} />
                        ) : (
                            <AnswerContent content={currentText} />
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">
                                    {answer.author?.username}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Reputation: <span className="font-medium">{formatReputation(answer.author?.reputation)}</span>
                                </div>
                            </div>
                            <Avatar
                                sx={{ width: 40, height: 40 }}
                                src={answer.author?.profilePicture}
                                className="border-2 border-white shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}