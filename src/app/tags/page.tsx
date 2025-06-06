'use client';

import FilterBar from "@/components/FilterBar";
import PermissionAction from "@/components/PermissionAction";
import TagSkeleton from "@/components/Skeletons/TagSkeleton";
import { getFetcher } from "@/helpers/request-utils";
import { toTagDetail } from "@/helpers/route-utils";
import { scrollToTop } from "@/helpers/utils";
import { PagedResponse, TagResponse } from "@/types/types";
import { Pagination } from "@mui/material";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const getTagKey = (pageIndex: number, pageSize: number, orderBy: string) => {
    return `/api/tag/${orderBy}?skip=${(pageIndex - 1) * pageSize}&take=${pageSize}`;
}

export default function Tags() {
    const router = useRouter();

    const validOrderValue = ['Popular', 'Name', "Newest"];
    const validOrder = ['Popular', 'Name', "Newest"];
    const orderDescriptions = ['Order by number of question each tag has', 'Order by ascending alphabetically', 'Order by creation date'];

    const [orderBy, setOrderBy] = useState<string>(validOrderValue[0]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState(12);

    const { data: tags, isLoading } = useSWR<PagedResponse<TagResponse>>(getTagKey(pageIndex, pageSize, orderBy), getFetcher);

    useEffect(() => {
        scrollToTop();
    }, [pageIndex]);

    const handleOrderByChange = (value: string) => {
        setOrderBy(value);
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    }

    return (
        <div className="page-container mx-auto px-4 space-y-8">
            <div className="flex sm:flex-row justify-between items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Tags</h1>


                </div>
                <div className="flex items-center text-end space-x-1">
                    <FilterBar
                        tabs={validOrder}
                        tabValues={validOrderValue}
                        tabDescriptions={orderDescriptions}
                        onFilterValueChange={handleOrderByChange}
                    />

                    <PermissionAction
                        title={{
                            'text': 'Create tag',
                            'position': 'right',
                            offset: 0
                        }}
                        action="createTag"
                        allowedHref='/tags/create'
                        className="px-4 text-sm mt-0 font-medium rounded-md  transition-colors"
                    >
                        <Plus />
                    </PermissionAction>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="col-span-3">
                    {tags && (
                        <p className="text-[var(--text-secondary)]">{tags.totalCount.toLocaleString()} tags</p>
                    )}
                </div>
                {isLoading && (
                    <TagSkeleton />
                )}
                {tags?.items.map((tag: TagResponse) => (
                    <Link
                        href={toTagDetail(tag.id, tag.name)}
                        key={tag.id}
                        className="group block"
                    >
                        <div className="h-full p-4 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg hover:shadow-lg transition-all duration-200">
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

            {tags && tags.totalPage > 1 && (
                <div className="flex justify-center pt-6 pb-5">
                    <Pagination
                        count={tags.totalPage}
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