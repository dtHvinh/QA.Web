'use client'

import NoCollection from '@/components/Collection/NoCollection';
import CollectionItem from '@/components/CollectionItem';
import CreateCollectionDialog from "@/components/CreateCollectionDialog";
import FilterBar from '@/components/FilterBar';
import { getFetcher, IsErrorResponse } from '@/helpers/request-utils';
import { scrollToTop } from '@/helpers/utils';
import { GetCollectionResponse, PagedResponse } from '@/types/types';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Pagination, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';

export default function CollectionsPage() {
    const [open, setOpen] = React.useState(false);
    const [pageIndex, setPageIndex] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(12);
    const tab = ['Most Recent', 'Most Liked']
    const tabValues = ['Newest', 'MostLiked']
    const tabDescriptions = ['Collections created most recently', 'Collections with most likes']
    const [sortOrder, setSortOrder] = React.useState(tabValues[0])
    const [searchTerm, setSearchTerm] = React.useState('')
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500)
    const [collections, setCollections] = React.useState<GetCollectionResponse[]>([])
    const [cachedCollections, setCachedCollections] = React.useState<GetCollectionResponse[]>([])

    const { data } = useSWR<PagedResponse<GetCollectionResponse>>(
        `/api/collection?orderBy=${sortOrder}&pageIndex=${pageIndex}&pageSize=${pageSize}`, getFetcher)

    useEffect(() => {
        const searchTerm = debouncedSearchTerm.trim();
        if (searchTerm === '') {
            setCollections(cachedCollections)
        } else {
            const filteredCollections = searchCollections().then()
        }
    }, [debouncedSearchTerm])

    useEffect(() => {
        if (data) {
            setCollections(data.items || [])
            setCachedCollections(data.items || [])
        }
    }, [data])

    useEffect(() => {
        scrollToTop();
    }, [pageIndex]);

    const handleOnCreated = () => {
        window.location.reload();
    }

    async function searchCollections() {
        const res = await getFetcher(`/api/collection/search/${searchTerm}?pageIndex=1&pageSize=100`)

        if (!IsErrorResponse(res)) {
            const response = res as PagedResponse<GetCollectionResponse>
            setCollections(response.items)
        }
    }

    if (data)
        console.log(data)

    return (
        <div className="page-container mx-auto px-4">
            <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Collections</h1>
                    <Tooltip title="Create Collection" arrow placement="left">
                        <button
                            onClick={() => setOpen(true)}
                            className="gap-2 px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlaylistAddIcon className="w-5 h-5" />
                        </button>
                    </Tooltip>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="w-full sm:w-auto relative">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search collections..."
                                className="w-full sm:w-80 pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-background)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <FilterBar
                        tabs={tab}
                        tabValues={tabValues}
                        tabDescriptions={tabDescriptions}
                        onFilterValueChange={setSortOrder}
                    />
                </div>

                <div className="min-h-[400px]">
                    {collections.length === 0 ? (
                        <NoCollection />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {collections.map(collection => (
                                <CollectionItem key={collection.id} collection={collection} />
                            ))}
                        </div>
                    )}
                </div>

                {collections.length > 0 && data && data?.totalPage > 1 && (
                    <div className="flex justify-center py-6">
                        <Pagination
                            page={pageIndex}
                            count={data?.totalPage}
                            onChange={(_, n) => setPageIndex(n)}
                            shape="rounded"
                            size="large"
                        />
                    </div>
                )}
            </div>

            <CreateCollectionDialog open={open} onClose={() => setOpen(false)} onCreated={handleOnCreated} />
        </div>
    );
}