'use client';

import getAuth from "@/helpers/auth-utils";
import {backendURL} from "@/utilities/Constants";
import React, {useCallback, useEffect, useState} from "react";
import {MenuItem, Pagination, Select, SelectChangeEvent, Typography} from "@mui/material";
import {PagedResponse, TagResponse} from "@/types/types";
import notifyError from "@/utilities/ToastrExtensions";
import Link from "next/link";
import {toTagDetail, toWikiPage} from "@/helpers/route-utils";

export default function Tags() {
    const {accessToken} = getAuth();
    const validOrderValue = ['Popular', 'Name'];
    const validOrder = ['Popular', 'Name'];
    const [orderBy, setOrderBy] = useState<string>(validOrderValue[0]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [data, setData] = useState<PagedResponse<TagResponse>>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState(15);

    const fetchTags = useCallback(async () => {
        setIsLoading(true);

        const requestUrl = `${backendURL}/api/tag/${orderBy}?skip=${(pageIndex - 1) * pageSize}&take=${pageSize}`;

        try {
            const response = await fetch(requestUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                notifyError('Failed to fetch tags');
                return;
            }
            const result = await response.json();

            setData(result);
        } catch {
            notifyError('Failed to fetch your questions');
        } finally {
            setIsLoading(false);
        }
    }, [accessToken, orderBy, pageIndex, pageSize]);

    useEffect(() => {
        fetchTags().then();
    }, [fetchTags]);

    const handleOrderByChange = (event: SelectChangeEvent) => {
        setOrderBy(event.target.value);
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className={'flex col-span-full justify-between items-center'}>
                <div>
                    <Typography variant="h4">All Tags</Typography>

                </div>
                <div>
                    <Select className={'focus:outline-0 focus:border-0'}
                            value={orderBy}
                            onChange={handleOrderByChange}
                            variant={"standard"}
                            disableUnderline={true}
                    >
                        {validOrder.map((order, index) => (
                            <MenuItem key={index} value={validOrderValue[index]}>{order}</MenuItem>
                        ))}
                    </Select>
                </div>
            </div>

            {isLoading && <div>Loading...</div>}
            {!isLoading && data && data.items.map((tag: TagResponse) => (
                <div key={tag.id} className={'flex flex-col'}>
                    <div className={'flex justify-between text-2xl'}>
                        <div>{tag.name}</div>
                        <div className={'flex space-x-2.5'}>
                            <Link href={toWikiPage(tag.id, tag.name)}
                                  className={'hidden md:block text-lg border border-gray-500 p-1 rounded-lg px-2'}>
                                See wiki
                            </Link>

                            <Link href={toTagDetail(tag.id, tag.name)}
                                  className={
                                      'hidden md:block text-lg border p-1 rounded-lg px-2 transition-all bg-blue-400 text-white hover:bg-blue-600'
                                  }>
                                Watch
                            </Link>
                        </div>
                    </div>
                    <div className={'line-clamp-4 my-6 text-md text-gray-500'}>{tag.description}</div>
                    <div className={'w-full mt-auto flex flex-col gap-3'}>
                        <Link href={toTagDetail(tag.id, tag.name)}
                              className={'text-gray-500'}>{tag.questionCount} questions</Link>
                        <Link href={toWikiPage(tag.id, tag.name)}
                              className={'block md:hidden text-lg text-center border p-1 rounded-lg px-2'}>
                            See wiki
                        </Link>

                        <Link href={toWikiPage(tag.id, tag.name)}
                              className={
                                  'block md:hidden text-center text-lg border p-1 rounded-lg px-2 transition-all bg-blue-400 text-white hover:bg-blue-600'
                              }>
                            Watch
                        </Link>
                    </div>
                </div>
            ))}

            <div className={'col-span-full flex justify-end mb-6'}>
                <Pagination count={data?.totalPage} onChange={handlePageChange}/>
            </div>
        </div>
    );
}