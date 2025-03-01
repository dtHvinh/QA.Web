'use client';

import FilterBar from "@/components/FilterBar";
import TagSkeleton from "@/components/Skeletons/TagSkeleton";
import getAuth from "@/helpers/auth-utils";
import { getFetcher } from "@/helpers/request-utils";
import { toTagDetail } from "@/helpers/route-utils";
import { PagedResponse, TagResponse } from "@/types/types";
import { Pagination, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import useSWR from "swr";

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
                <Link href={toTagDetail(tag.id, tag.name)} key={tag.id} className={'flex flex-col shadow hover:shadow-lg p-8 active:shadow-sm rounded-2xl transition-shadow'}>
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