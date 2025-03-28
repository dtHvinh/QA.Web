'use client';

import FilterBar from "@/components/FilterBar";
import PermissionAction from "@/components/PermissionAction";
import TagSkeleton from "@/components/Skeletons/TagSkeleton";
import { getFetcher } from "@/helpers/request-utils";
import { toTagDetail } from "@/helpers/route-utils";
import { PagedResponse, TagResponse } from "@/types/types";
import { Pagination } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";

export default function Tags() {
    const router = useRouter();

    const validOrderValue = ['Popular', 'Name', "Newest"];
    const validOrder = ['Popular', 'Name', "Newest"];
    const orderDescriptions = ['Order by number of question each tag has', 'Order by ascending alphabetically', 'Order by creation date'];

    const [orderBy, setOrderBy] = useState<string>(validOrderValue[0]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState(12);

    const requestUrl = `/api/tag/${orderBy}?skip=${(pageIndex - 1) * pageSize}&take=${pageSize}`;
    const { data, error, isLoading } = useSWR<PagedResponse<TagResponse>>(requestUrl, getFetcher);

    const handleOrderByChange = (value: string) => {
        setOrderBy(value);
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    }

    return (
        <div className="page-container mx-auto px-4 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Tags</h1>

                    {data && (
                        <p className="text-[var(--text-secondary)]">{data.totalCount.toLocaleString()} tags</p>
                    )}

                    <PermissionAction
                        action="createTag"
                        allowedHref='/tags/create'
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Create Tag
                    </PermissionAction>
                </div>
                <FilterBar
                    tabs={validOrder}
                    tabValues={validOrderValue}
                    tabDescriptions={orderDescriptions}
                    onFilterValueChange={handleOrderByChange}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading && (
                    <>
                        {[...Array(12)].map((_, index) => (
                            <TagSkeleton key={index} />
                        ))}
                    </>
                )}
                {data?.items.map((tag: TagResponse) => (
                    <Link
                        href={toTagDetail(tag.id, tag.name)}
                        key={tag.id}
                        className="group block"
                    >
                        <div className="h-full p-4 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg hover:border-blue-500 hover:shadow-sm transition-all duration-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-medium text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">
                                    {tag.name}
                                </h3>
                                <span className="text-xs text-[var(--text-secondary)]">
                                    {tag.questionCount || 0} questions
                                </span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                                {tag.description}
                            </p>
                            <div className="mt-3 pt-2 border-t border-[var(--border-color)]">
                                <span className="text-xs text-blue-500 group-hover:text-blue-600 transition-colors">
                                    View questions →
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {data && data.totalPage > 1 && (
                <div className="flex justify-center pt-6 pb-5">
                    <Pagination
                        count={data.totalPage}
                        page={pageIndex}
                        onChange={handlePageChange}
                        size="large"
                        color="primary"
                    />
                </div>
            )}
        </div>
    );
}