'use client'

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { IconButton, Pagination, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import CreateCollectionDialog from "@/components/CreateCollectionDialog";
import FilterBar from '@/components/FilterBar';
import useSWR from 'swr';
import getAuth from '@/helpers/auth-utils';
import { getFetcher, IsErrorResponse } from '@/helpers/request-utils';
import { GetCollectionResponse, PagedResponse } from '@/types/types';
import Loading from '../loading';
import CollectionItem from '@/components/CollectionItem';
import { useDebounce } from 'use-debounce';
import notifyError from '@/utilities/ToastrExtensions';
import { ErrorResponse } from '@/props/ErrorResponse';

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
    const requestUrl = `/api/collection?orderBy=${sortOrder}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
    const auth = getAuth();

    const { data } = useSWR<PagedResponse<GetCollectionResponse>>([requestUrl, auth?.accessToken], getFetcher)

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

    async function searchCollections() {
        const res = await getFetcher([`/api/collection/search/${searchTerm}?pageIndex=1&pageSize=100`, auth!.accessToken])

        if (!IsErrorResponse(res)) {
            const response = res as PagedResponse<GetCollectionResponse>
            setCollections(response.items)
        }
    }

    return (
        <div>
            <div className={'flex justify-between items-center'}>
                <div className={'text-2xl mt-4'}>
                    Collections
                </div>

                <div>
                    <div>
                        <CreateCollectionDialog open={open} onClose={() => setOpen(false)} />
                    </div>
                </div>

                <div>
                    <Tooltip title={'Add CollectionItem'} arrow>
                        <IconButton onClick={() => setOpen(true)}>
                            <PlaylistAddIcon />
                        </IconButton>
                    </Tooltip>
                </div>

            </div>

            <div className='flex justify-between my-2'>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search collections..."
                        className="px-4 py-2 border rounded-full focus:outline-none"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                </div>
                <FilterBar tabs={tab} tabValues={tabValues} tabDescriptions={tabDescriptions} onFilterValueChange={setSortOrder} />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                {collections.map(collection => (
                    <CollectionItem key={collection.id} collection={collection} />
                ))}

                <div className='col-span-full mt-5'>
                    {
                        collections.length !== 0 &&
                        <Pagination page={pageIndex} count={data?.totalPage} onChange={(e, n) => setPageIndex(n)} />
                    }
                </div>
            </div>
        </div>
    );
}