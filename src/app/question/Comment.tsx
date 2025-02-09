import React from "react";
import {CommentResponse} from "@/types/types";
import TextEditor from "@/components/TextEditor";
import AlertDialog from "@/components/AlertDialog";
import timeFromNow, {DEFAULT_TIME} from "@/helpers/time-utils";
import {Apis, backendURL} from "@/utilities/Constants";
import {formatString} from "@/helpers/string-utils";
import {deleteFetcher, IsErrorResponse, putFetcher} from "@/helpers/request-utils";
import {ErrorResponse} from "@/props/ErrorResponse";
import notifyError, {notifySucceed} from "@/utilities/ToastrExtensions";
import getAuth from "@/helpers/auth-utils";

interface CommentComponentProps {
    comment: CommentResponse;
    onCommentDelete: (commentId: string) => void;
}

export default function Comment({comment, onCommentDelete}: Readonly<CommentComponentProps>) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [currentText, setCurrentText] = React.useState(comment.content);
    const [editText, setEditText] = React.useState(comment.content);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isSaveAllow, setIsSaveAllow] = React.useState(false);
    const auth = getAuth();

    const handleClickOpen = () => {
        setDeleteDialogOpen(true);
    };

    const handleClose = () => {
        setDeleteDialogOpen(false);
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
        setIsSaveAllow(true);
    }

    const handleDelete = async () => {
        const requestUrl = formatString(backendURL + Apis.Comment.Delete, comment.id);

        const response = await deleteFetcher([requestUrl, auth!.accessToken]);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).title);
        } else {
            setIsDeleting(true);
            setTimeout(() => {
                onCommentDelete(comment.id);
            }, 500);
        }
    }

    const handleUpdate = async () => {
        const requestUrl = formatString(backendURL + Apis.Comment.Update, comment.id);

        const response = await putFetcher([requestUrl, auth!.accessToken, JSON.stringify({
            content: editText
        })]);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).title);
        } else {
            comment = response as CommentResponse;
            setCurrentText(editText);
            setIsEditing(false);

            notifySucceed('Comment updated successfully');
        }
    }

    return (
        <div
            className={`relative grid gap-1 grid-cols-1 p-2 mb-4 rounded-lg bg-white ${isDeleting ? 'element-exit element-exit-active' : ''}`}>
            <hr/>

            <AlertDialog open={deleteDialogOpen}
                         onClose={handleClose}
                         onYes={handleDelete}
                         title={'Do you want to delete this comment?'}
                         description={'This action cannot be undone'}/>

            <div className={'transition-all duration-300 ease-in-out'}>
                {isEditing
                    ? <TextEditor currentText={currentText as string} onTextChange={handleEditTextChange}/>
                    :
                    <div>
                        <div className="text-black text-sm"
                             dangerouslySetInnerHTML={{__html: currentText as TrustedHTML}}></div>
                        <div className="text-gray-400 inline text-xs">
                            Commented by {comment.author?.username},
                            {comment.updatedAt == DEFAULT_TIME ?
                                <span className="text-gray-400 text-xs"> {timeFromNow(comment.createdAt)}</span> :
                                <span className="text-gray-400 text-xs">(Edited) {timeFromNow(comment.updatedAt)}</span>
                            }
                        </div>
                    </div>
                }

                <div className="relative justify-between flex gap-2">
                    {comment.resourceRight == 'Owner'
                        &&
                        <div className={'flex flex-col'}>
                            <div className={'flex justify-end'}>
                                {isEditing
                                    ?
                                    <div className={'flex gap-2'}>
                                        <button className={'text-red-500'} onClick={handleDiscard}>
                                            Discard
                                        </button>
                                        <button className={'text-blue-500 disabled:text-gray-500'}
                                                disabled={!isSaveAllow}
                                                onClick={handleUpdate}>
                                            Save
                                        </button>
                                    </div>
                                    :
                                    <div className={'flex gap-2'}>
                                        <button type={"button"} onClick={handleStartEditing}>
                                            Edit
                                        </button>
                                        <button type={"button"} className={'text-red-500'} onClick={handleClickOpen}>
                                            Delete
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}