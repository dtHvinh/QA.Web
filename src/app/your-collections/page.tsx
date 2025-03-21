'use client'

import CollectionItem from "@/components/CollectionItem";
import CreateCollectionDialog from "@/components/CreateCollectionDialog";
import FilterBar from "@/components/FilterBar";
import { getFetcher } from "@/helpers/request-utils";
import { GetCollectionResponse, PagedResponse } from "@/types/types";
import { notifySucceed } from "@/utilities/ToastrExtensions";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { Pagination } from "@mui/material";
import React, { useEffect } from "react";
import useSWR from "swr";

export default function YourCollectionsPage() {
    const [open, setOpen] = React.useState(false);

    const tabs = ['Most Liked', 'Newest']
    const tabValues = ['MostLiked', 'Newest']
    const tabDescriptions = ['Sort by most liked', 'Sort by newest']
    const [filterValue, setFilterValue] = React.useState(tabValues[0]);
    const [collections, setCollections] = React.useState<GetCollectionResponse[]>([]);
    const [pageIndex, setPageIndex] = React.useState(1);

    const { data } = useSWR<PagedResponse<GetCollectionResponse>>(`/api/collection/my-collections?orderBy=${filterValue}&pageSize=6&pageIndex=${pageIndex}`, getFetcher);

    useEffect(() => {
        if (data)
            setCollections(data.items);
    }, [data]);

    const handleCreated = () => {
        notifySucceed('Collection created successfully');
        setTimeout(() => {
            window.location.reload();
        }, 700);
    }

    return (
        <div className="page-container mx-auto px-4 py-8">
            <CreateCollectionDialog open={open} onClose={() => setOpen(false)} onCreated={handleCreated} />

            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                    Your Collections
                </h1>

                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 mt-4 sm:mt-0 text-white bg-[var(--primary)] rounded-lg hover:bg-[var(--primary-darker)] transition-colors"
                >
                    <PlaylistAddIcon sx={{ fontSize: 20 }} />
                    <span>New Collection</span>
                </button>
            </div>

            <div className="p-4 border-b border-[var(--border-color)]">
                <FilterBar
                    tabs={tabs}
                    tabValues={tabValues}
                    tabDescriptions={tabDescriptions}
                    onFilterValueChange={setFilterValue}
                />
            </div>

            {collections.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collections.map((collection) => (
                            <CollectionItem key={collection.id} collection={collection} />
                        ))}
                    </div>

                    {data?.totalPage !== 0 && (
                        <div className="flex justify-center border-t border-[var(--border-color)] p-4">
                            <Pagination
                                count={data?.totalPage}
                                page={pageIndex}
                                onChange={(_, num) => setPageIndex(num)}
                                size="large"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: 'var(--text-primary)',
                                    },
                                    '& .MuiPaginationItem-root.Mui-selected': {
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                    },
                                    '& .MuiPaginationItem-root:hover': {
                                        backgroundColor: 'var(--hover-background)',
                                    },
                                }}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <svg className="w-16 h-16 text-[var(--text-tertiary)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">No collections yet</h3>
                    <p className="text-[var(--text-secondary)]">Create your first collection to get started</p>
                </div>
            )}
        </div>
    );
}