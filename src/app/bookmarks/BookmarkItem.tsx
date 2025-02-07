import {BookmarkResponse} from "@/types/types";
import React, {memo} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import {Tooltip} from "@mui/material";
import AlertDialog from "@/components/AlertDialog";
import Link from "next/link";
import toQuestionDetail from "@/helpers/path";
import timeFromNow from "@/helpers/time-utils";
import {backendURL} from "@/utilities/Constants";
import {deleteFetcher, IsErrorResponse} from "@/helpers/request-utils";
import getAuth from "@/helpers/auth-utils";
import notifyError from "@/utilities/ToastrExtensions";
import {ErrorResponse} from "@/props/ErrorResponse";

const BookmarkItem = memo(function BookmarkItem(
    {
        bookmark,
        onDelete
    }: Readonly<{
        bookmark: BookmarkResponse,
        onDelete?: (bookmark: BookmarkResponse) => void
    }>) {
    const {question} = bookmark;
    const [open, setOpen] = React.useState(false);
    const {accessToken} = getAuth()!;
    const requestUrl = `${backendURL}/api/bookmark/${bookmark.id}`;

    const handleClickClose = () => {
        setOpen(false)
    }

    const handleConfirmDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpen(true);
    }

    const handleDelete = async () => {
        const res = await deleteFetcher([requestUrl, accessToken]);

        if (IsErrorResponse(res)) {
            notifyError((res as ErrorResponse).title);
            return;
        }

        onDelete?.(bookmark);
    }

    return (
        <div className='flex flex-col'>
            <AlertDialog open={open}
                         onClose={handleClickClose}
                         title={'Do you want to delete this bookmark'}
                         description={'This action can not undone'}
                         onYes={handleDelete}/>

            <div className="rounded-xl border p-3 shadow-md w-full bg-white">
                <div className="flex w-full items-center justify-between border-b pb-3">
                    <div className="flex w-full justify-between items-center">
                        <div className={'flex flex-col'}>
                            <Link href={toQuestionDetail(question.id, question.slug)}
                                  className="text-lg font-bold text-slate-700">{question.title}</Link>
                            <div
                                className="text-xs text-neutral-400">Bookmarked <strong>{timeFromNow(bookmark.createdAt)}</strong>
                            </div>
                        </div>

                        <div>
                            <Tooltip arrow title={'Delete this bookmark'}>
                                <button onClick={handleConfirmDelete}><DeleteIcon/></button>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                <div className="mt-4 mb-2">
                    <p dangerouslySetInnerHTML={{__html: question.content}}
                       className="text-sm text-neutral-400 line-clamp-2">
                    </p>
                </div>
            </div>
        </div>
    );
});

export default BookmarkItem;