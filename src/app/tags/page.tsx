'use client';

import getAuth from "@/helpers/auth-utils";
import React, { useState } from "react";
import { Pagination, Typography } from "@mui/material";
import { PagedResponse, TagResponse } from "@/types/types";
import notifyError from "@/utilities/ToastrExtensions";
import Link from "next/link";
import { toTagDetail, toWikiPage } from "@/helpers/route-utils";
import FilterBar from "@/components/FilterBar";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import useSWR from "swr";
import TagSkeleton from "@/components/Skeletons/TagSkeleton";

export default function Tags() {
    const auth = getAuth()!;
    const validOrderValue = ['Popular', 'Name'];
    const validOrder = ['Popular', 'Name'];
    const orderDescriptions = ['Order by number of question each tag has', 'Order by ascending alphabetically'];

    const [orderBy, setOrderBy] = useState<string>(validOrderValue[0]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState(12);

    const requestUrl = `/api/tag/${orderBy}?skip=${(pageIndex - 1) * pageSize}&take=${pageSize}`;
    const { data, error, isLoading } = useSWR<PagedResponse<TagResponse>>([requestUrl, auth?.accessToken], getFetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
    });

    const handleOrderByChange = (value: string) => {
        setOrderBy(value);
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-8">
            <div className={'flex col-span-full justify-between items-center'}>
                <div>
                    <Typography variant="h4">All Tags</Typography>
                </div>
                <div>
                    <FilterBar tabs={validOrder}
                        tabValues={validOrderValue}
                        tabDescriptions={orderDescriptions}
                        onFilterValueChange={handleOrderByChange} />
                </div>
            </div>

            {isLoading && (
                <>
                    {[...Array(12)].map((_, index) => (
                        <TagSkeleton key={index} />
                    ))}
                </>
            )}

            {!isLoading && data && data.items.map((tag: TagResponse) => (
                <Link href={toTagDetail(tag.id, tag.name)} key={tag.id} className={'flex flex-col border p-8 rounded-2xl'}>
                    <div className={'flex justify-between text-2xl'}>
                        <div>{tag.name}</div>
                    </div>
                    <div className={'line-clamp-4 my-6 text-md text-gray-500'}>{tag.description}</div>
                </Link>
            ))}

            <div className={'col-span-full flex justify-end mb-6'}>
                <Pagination count={data?.totalPage} onChange={handlePageChange} />
            </div>
        </div>
    );
}