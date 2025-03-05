import AlertDialog from "@/components/AlertDialog";
import getAuth from "@/helpers/auth-utils";
import toQuestionDetail from "@/helpers/path";
import { deleteFetcher, IsErrorResponse } from "@/helpers/request-utils";
import timeFromNow from "@/helpers/time-utils";
import { BookmarkResponse } from "@/types/types";
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from "@mui/material";
import Link from "next/link";
import React, { memo } from "react";

const BookmarkItem = memo(function BookmarkItem({ bookmark, onDelete }: Readonly<{
    bookmark: BookmarkResponse,
    onDelete?: (bookmark: BookmarkResponse) => void
}>) {
    const { question } = bookmark;
    const [open, setOpen] = React.useState(false);
    const auth = getAuth();
    const requestUrl = `/api/bookmark/${bookmark.id}`;

    const handleClickClose = () => {
        setOpen(false)
    }

    const handleConfirmDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpen(true);
    }

    const handleDelete = async () => {
        const res = await deleteFetcher([requestUrl, auth!.accessToken]);

        if (!IsErrorResponse(res)) {
            onDelete?.(bookmark);
        }
    }

    return (
        <div className="group relative">
            <AlertDialog
                open={open}
                onClose={handleClickClose}
                title="Remove bookmark?"
                description="This action cannot be undone. The question will be removed from your bookmarks."
                onYes={handleDelete}
            />

            <div className="rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all duration-200">
                <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <Link
                                href={toQuestionDetail(question.id, question.slug)}
                                className="block text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                            >
                                {question.title}
                            </Link>
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                    />
                                </svg>
                                <span>Saved {timeFromNow(bookmark.createdAt)}</span>
                            </div>
                        </div>

                        <Tooltip
                            arrow
                            title="Remove bookmark"
                            placement="left"
                        >
                            <button
                                onClick={handleConfirmDelete}
                                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <DeleteIcon className="w-5 h-5" />
                            </button>
                        </Tooltip>
                    </div>

                    {question.content && (
                        <div className="mt-3">
                            <p
                                dangerouslySetInnerHTML={{ __html: question.content }}
                                className="text-sm text-gray-600 line-clamp-2 prose prose-sm max-w-none"
                            />
                        </div>
                    )}

                    <div className="mt-4 flex items-center gap-3">
                        {question.tags?.map(tag => (
                            <span
                                key={tag.id}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default BookmarkItem;