import AnswerContent from "@/app/question/AnswerContent";
import MarkAcceptedAnswerLabel from "@/app/question/MarkAcceptedAnswerLabel";
import ModeratorButton from "@/components/Admin/ModeratorButton";
import AlertDialog from "@/components/AlertDialog";
import ModeratorPrivilege from "@/components/Privilege/ModeratorPrivilege";
import ResourceOwnerPrivilege from "@/components/Privilege/ResourceOwnerPrivilege";
import RoundedButton from "@/components/RoundedButton";
import TextEditor from "@/components/TextEditor";
import { formatReputation } from "@/helpers/evaluate-utils";
import { deleteFetcher, IsErrorResponse, postFetcher, putFetcher } from "@/helpers/request-utils";
import { formatString } from "@/helpers/string-utils";
import timeFromNow, { DEFAULT_TIME } from "@/helpers/time-utils";
import { fromImage } from "@/helpers/utils";
import { AnswerResponse, QuestionResponse, VoteResponse } from "@/types/types";
import { Apis, backendURL } from "@/utilities/Constants";
import { notifySucceed } from "@/utilities/ToastrExtensions";
import { Check, Delete } from "@mui/icons-material";
import { Avatar, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import React, { memo } from "react";

const Answer = (
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
    }>) => {
    const [currentText, setCurrentText] = React.useState(answer.content);
    const [editText, setEditText] = React.useState(answer.content);
    const [isAnswerAccepted, setIsAnswerAccepted] = React.useState(answer.isAccepted);
    const [currentVote, setCurrentVote] = React.useState(answer.score);
    const [isModMenuOpen, setIsModMenuOpen] = React.useState(false);

    const [delAnsDialog, setDelAnsDialog] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isAllowUpdate, setIsAllowUpdate] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
        const response = await putFetcher(acceptAnswerUrl);

        if (!IsErrorResponse(response)) {
            onAnswerAccepted(answer.id);
            setIsAnswerAccepted(true);
            setIsModMenuOpen(false);
        }
    }

    const handleDelete = async () => {
        const requestUrl = formatString(backendURL + Apis.Answer.Delete, answer.id);

        const response = await deleteFetcher(requestUrl);

        if (!IsErrorResponse(response)) {
            setIsDeleting(true);
            setTimeout(() => {
                onAnswerDelete(answer.id);
            }, 500);
            setIsModMenuOpen(false);
        }
    }

    const handleEdit = async () => {
        const requestUrl = formatString(backendURL + Apis.Answer.Update, answer.id);
        const response = await putFetcher(requestUrl, JSON.stringify({
            content: editText
        }));

        if (!IsErrorResponse(response)) {
            answer = response as AnswerResponse;
            setCurrentText(editText);
            setIsEditing(false);

            notifySucceed('Comment updated successfully');
        }
    }

    const handleVote = async (isUpvote: boolean) => {
        const requestUrl = `${backendURL}/api/answer/${answer.id}/${isUpvote ? 'upvote' : 'downvote'}/`;

        const response = await postFetcher(requestUrl);

        if (!IsErrorResponse(response)) {
            notifySucceed('Done');
            const voteResponse = response as VoteResponse;
            setCurrentVote(voteResponse.score);
        }
    }

    return (
        <div className="border-b last:border-b-0 border-[var(--border-color)]">
            <AlertDialog
                open={delAnsDialog}
                onClose={handleClose}
                onYes={handleDelete}
                title="Delete Answer"
                description="Are you sure you want to delete this answer? This action cannot be undone."
            />

            <div className={`relative grid grid-cols-12 gap-6 p-6 transition-all duration-300
                ${isDeleting ? 'opacity-0 transform' : 'opacity-100'}`}>

                <div className="col-span-1 flex flex-col items-center gap-2">
                    <RoundedButton
                        title="Upvote"
                        className="hover:bg-[var(--primary-light)] active:bg-[var(--primary-lighter)]"
                        svg={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" viewBox="0 0 16 16">
                            <path d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
                        </svg>}
                        onClick={() => handleVote(true)}
                    />
                    <span className="text-lg font-semibold text-[var(--text-secondary)]">{currentVote}</span>
                    <RoundedButton
                        title="Downvote"
                        className="hover:bg-[var(--error)] hover:bg-opacity-10 active:bg-opacity-20"
                        svg={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" viewBox="0 0 16 16">
                            <path d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                        </svg>}
                        onClick={() => handleVote(false)}
                    />

                    {isAnswerAccepted && <MarkAcceptedAnswerLabel />}

                    <ModeratorPrivilege>
                        <div className="relative">
                            <ModeratorButton onClick={(e) => setAnchorEl(e.currentTarget)} />

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                                sx={{
                                    '& .MuiPaper-root': {
                                        bgcolor: 'var(--card-background)',
                                        color: 'var(--text-primary)',
                                        width: 200,
                                    },
                                    '& .MuiMenuItem-root': {
                                        color: 'var(--text-secondary)',
                                        '&:hover': {
                                            bgcolor: 'var(--hover-background)',
                                        },
                                    },
                                }}
                            >
                                {!isAnswerAccepted && (
                                    <MenuItem
                                        onClick={() => {
                                            handleAnswerAccepted();
                                            setAnchorEl(null);
                                        }}
                                        sx={{
                                            color: 'var(--success) !important',
                                            '&:hover': {
                                                bgcolor: 'var(--success-light) !important',
                                            },
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Check className="text-[var(--success)]" />
                                        </ListItemIcon>
                                        <ListItemText>Accept Answer</ListItemText>
                                    </MenuItem>
                                )}
                                <MenuItem
                                    onClick={() => {
                                        handleClickOpen();
                                        setAnchorEl(null);
                                    }}
                                    sx={{
                                        color: 'var(--error) !important',
                                        '&:hover': {
                                            bgcolor: 'var(--error-light) !important',
                                        },
                                    }}
                                >
                                    <ListItemIcon>
                                        <Delete className="text-[var(--error)]" />
                                    </ListItemIcon>
                                    <ListItemText>Delete Answer</ListItemText>
                                </MenuItem>
                            </Menu>
                        </div>
                    </ModeratorPrivilege>
                </div>

                <div className="col-span-11 space-y-4">
                    <div className="flex justify-between items-start">
                        <ResourceOwnerPrivilege resourceRight={answer.resourceRight}>
                            <div className="flex flex-col items-end gap-2">
                                {isEditing ? (
                                    <div className="flex gap-3">
                                        <button className="px-3 py-1.5 text-sm text-[var(--error)] hover:bg-[var(--error)] hover:bg-opacity-10 rounded-md transition-colors"
                                            onClick={handleDiscard}>
                                            Discard
                                        </button>
                                        <button className="px-3 py-1.5 text-sm text-white bg-[var(--primary)] hover:bg-[var(--primary-darker)] rounded-md transition-colors disabled:bg-[var(--disabled-background)]"
                                            disabled={!isAllowUpdate}
                                            onClick={handleEdit}>
                                            Save Changes
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <button className="px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-background)] rounded-md transition-colors"
                                            onClick={handleStartEditing}>
                                            Edit
                                        </button>
                                        <button className="px-3 py-1.5 text-sm text-[var(--error)] hover:bg-[var(--error)] hover:bg-opacity-10 rounded-md transition-colors"
                                            onClick={handleClickOpen}>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </ResourceOwnerPrivilege>
                    </div>

                    <div className="prose max-w-none dark:prose-invert">
                        {isEditing ? (
                            <TextEditor currentText={currentText} onTextChange={handleEditTextChange} />
                        ) : (
                            <AnswerContent content={currentText} />
                        )}
                    </div>

                    <div className="text-sm text-[var(--text-tertiary)] space-y-1">
                        <div>Answered {timeFromNow(answer.createdAt)}</div>
                        {answer.updatedAt !== DEFAULT_TIME && (
                            <div>Edited {timeFromNow(answer.updatedAt)}</div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <div className="flex items-center gap-4 bg-[var(--hover-background)] rounded-lg p-3">
                            <div className="text-right">
                                <div className="text-sm font-medium text-[var(--text-primary)]">
                                    {answer.author?.username}
                                </div>
                                <div className="text-sm text-[var(--text-secondary)]">
                                    Reputation: <span className="font-medium">{formatReputation(answer.author?.reputation)}</span>
                                </div>
                            </div>
                            <Avatar
                                sx={{ width: 40, height: 40 }}
                                src={fromImage(question.author.profilePicture)}
                                className="border-2 border-[var(--card-background)] shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(Answer);