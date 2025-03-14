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
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Your Bookmarks</h1>
                <p className="mt-2 text-[var(--text-secondary)]">Save and organize your favorite questions</p>
            </div>

            {questions.length === 0 ? (
                <div className="text-center py-16 bg-[var(--card-background)] rounded-xl border border-[var(--border-color)]">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)]">No bookmarks yet</h3>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Start saving questions to your bookmarks to find them easily later
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-[var(--text-secondary)]">
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
                        <div className="flex justify-center pt-6 border-t border-[var(--border-color)]">
                            <Pagination
                                count={(data as PagedResponse<unknown>).totalPage}
                                page={pageIndex}
                                onChange={(_, value) => setPageIndex(value)}
                                shape="rounded"
                                size="large"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: 'var(--text-primary)',
                                        borderColor: 'var(--border-color)',
                                        '&:hover': {
                                            backgroundColor: 'var(--hover-background)',
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: 'var(--primary)',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'var(--primary-darker)',
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}