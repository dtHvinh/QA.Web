'use client'

import {IconButton, Pagination, Tooltip} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import React, {useEffect} from "react";
import CreateCollectionDialog from "@/components/CreateCollectionDialog";
import {backendURL} from "@/utilities/Constants";
import getAuth from "@/helpers/auth-utils";
import {getFetcher} from "@/helpers/request-utils";
import useSWR from "swr";
import FilterBar from "@/components/FilterBar";
import {GetCollectionResponse, PagedResponse} from "@/types/types";
import CollectionItem from "@/components/CollectionItem";
import {notifySucceed} from "@/utilities/ToastrExtensions";

export default function YourCollectionsPage() {
    const [open, setOpen] = React.useState(false);

    const tabs = ['Most Liked', 'Newest']
    const tabValues = ['MostLiked', 'Newest']
    const tabDescriptions = ['Sort by most liked', 'Sort by newest']
    const [filterValue, setFilterValue] = React.useState(tabValues[0]);
    const [collections, setCollections] = React.useState<GetCollectionResponse[]>([]);
    const [pageIndex, setPageIndex] = React.useState(1);
    const requestUrl = `${backendURL}/api/collection/my-collections?orderBy=${filterValue}&pageSize=6&pageIndex=${pageIndex}`;
    const auth = getAuth();

    const {data} = useSWR<PagedResponse<GetCollectionResponse>>([requestUrl, auth?.accessToken], getFetcher);

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
        <div>
            <CreateCollectionDialog open={open} onClose={() => setOpen(false)} onCreated={handleCreated}/>

            <div className={'flex justify-between items-center'}>
                <div className={'text-2xl mt-4'}>
                    Your Collections
                </div>

                <div>
                    <Tooltip title={'Add CollectionItem'} arrow>
                        <IconButton onClick={() => setOpen(true)}>
                            <PlaylistAddIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>

            <div className={'flex justify-end'}>
                <FilterBar tabs={tabs} tabValues={tabValues} tabDescriptions={tabDescriptions}
                           onFilterValueChange={setFilterValue}/>
            </div>

            <div className={'grid grid-cols-1 md:grid-cols-3 gap-4 mt-5'}>
                {collections.map((collection) => (
                    <CollectionItem key={collection.id} collection={collection}/>
                ))}
            </div>

            <div className={'mt-5 flex justify-end'}>
                <Pagination count={data?.totalPage} page={pageIndex} onChange={(_, num) => setPageIndex(num)}/>
            </div>
        </div>
    );
}