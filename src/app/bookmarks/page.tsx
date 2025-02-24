'use client'

import getAuth from "@/helpers/auth-utils";
import { backendURL } from "@/utilities/Constants";
import useSWR from "swr";
import { getFetcher } from "@/helpers/request-utils";
import Loading from "@/app/loading";
import { BookmarkResponse, PagedResponse } from "@/types/types";
import React, { useEffect } from "react";
import { Pagination, Typography } from "@mui/material";
import BookmarkItem from "@/app/bookmarks/BookmarkItem";

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
        <div className={'flex flex-col gap-5'}>
            <div>
                <Typography typography={'h4'}>Bookmarks</Typography>
            </div>

            {questions.length === 0 && <div>No Bookmark found!</div>}

            <div className={'flex flex-col gap-5'}>
                {questions.map((bookmark: BookmarkResponse) => (
                    <BookmarkItem key={bookmark.id}
                        bookmark={bookmark}
                        onDelete={handleDelete} />
                ))}
            </div>

            {questions.length !== 0 &&
                <div className={'flex justify-end'}>
                    <Pagination count={(data as PagedResponse<unknown>).totalPage} page={pageIndex}
                        onChange={(event, value) => setPageIndex(value)} />
                </div>
            }
        </div>
    );
}