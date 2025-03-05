'use client'

import BookmarkItem from "@/app/bookmarks/BookmarkItem";
import Loading from "@/app/loading";
import getAuth from "@/helpers/auth-utils";
import { getFetcher } from "@/helpers/request-utils";
import { BookmarkResponse, PagedResponse } from "@/types/types";
import { Pagination } from "@mui/material";
import React, { useEffect } from "react";
import useSWR from "swr";

export default function BookmarkPage() {
    const auth = getAuth();
    const [pageIndex, setPageIndex] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number>(10);
    const [questions, setQuestions] = React.useState<BookmarkResponse[]>([]);
    const requestUrl = `/api/bookmark/?orderBy=Newest&pageIndex=${pageIndex}&pageSize=${pageSize}`;

    const { data, isLoading } = useSWR([requestUrl, auth?.accessToken], getFetcher);

    useEffect(() => {
        if (data) {
            setQuestions((data as PagedResponse<BookmarkResponse>).items);
        }
    }, [data]);

    if (isLoading) {
        return <Loading />
    }

    const handleDelete = (bookmark: BookmarkResponse) => {
        setQuestions(questions.filter(q => q.id !== bookmark.id));
    }

    return (
        <div className="page-container mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Your Bookmarks</h1>
                <p className="mt-2 text-gray-600">Save and organize your favorite questions</p>
            </div>

            {questions.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No bookmarks yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Start saving questions to your bookmarks to find them easily later
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing {questions.length} bookmark{questions.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {questions.map((bookmark: BookmarkResponse) => (
                            <div key={bookmark.id} className="transition-all">
                                <BookmarkItem
                                    bookmark={bookmark}
                                    onDelete={handleDelete}
                                />
                            </div>
                        ))}
                    </div>

                    {(data as PagedResponse<unknown>).totalPage > 1 && (
                        <div className="flex justify-center pt-6 border-t">
                            <Pagination
                                count={(data as PagedResponse<unknown>).totalPage}
                                page={pageIndex}
                                onChange={(_, value) => setPageIndex(value)}
                                shape="rounded"
                                size="large"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}