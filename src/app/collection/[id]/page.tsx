'use client'

import React, { useActionState, useEffect, useState, useTransition } from "react";
import { backendURL } from "@/utilities/Constants";
import getAuth from "@/helpers/auth-utils";
import { GetCollectionDetailResponse } from "@/types/types";
import { deleteFetcher, getFetcher, IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import useSWR from "swr";
import Loading from "@/app/loading";
import { Tabs } from "radix-ui";
import { TabsContent } from "@radix-ui/react-tabs";
import RoundedButton from "@/components/RoundedButton";
import { Avatar, Pagination } from "@mui/material";
import { Description, ImportContacts, Info, Settings } from "@mui/icons-material";
import CollectionSettings from "@/app/collection/CollectionSettings";
import ResourceOwnerPrivilege from "@/components/Privilege/ResourceOwnerPrivilege";
import CollectionQuestion from "@/app/collection/CollectionQuestion";
import { useDebounce } from "use-debounce";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { notifySucceed } from "@/utilities/ToastrExtensions";

export default function CollectionDetailPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
    const { id } = React.use(params);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const requestUrl = `/api/collection/${id}/?pageIndex=1&pageSize=${pageSize}`;
    const auth = getAuth();
    const { data, isLoading } = useSWR<GetCollectionDetailResponse>([requestUrl, auth?.accessToken], getFetcher);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (data) {
            setLikeCount(data.likeCount);
            setIsLiked(data.isLikedByUser);
        }
    }, [data]);

    if (isLoading)
        return <Loading />

    const handleLike = async () => {
        if (!data) return;

        setIsLiked(true);

        const res = await postFetcher([`/api/collection/${data.id}/like`, auth!.accessToken, '']);

        if (!IsErrorResponse(res)) {
            setIsLiked(true);
            setLikeCount(pre => pre + 1)
            notifySucceed("Done");
        }
    };

    const handleUnlike = async () => {
        if (!data) return;
        setIsLiked(false);

        const res = await deleteFetcher([`/api/collection/${data.id}/unlike`, auth!.accessToken]);

        if (!IsErrorResponse(res)) {
            setIsLiked(false);
            setLikeCount(pre => pre - 1)
            notifySucceed("Done");
        }
    }

    return (
        <div>
            {data &&
                <div className={'grid grid-cols-12'}>
                    <div className={'col-span-11'}>
                        <Tabs.Root defaultValue={'details'}>
                            <Tabs.List className="tabs-list">
                                <Tabs.TabsTrigger className="tab-trigger flex items-center gap-2" defaultChecked={true}
                                    value={'details'}>
                                    <Info />
                                    Details
                                </Tabs.TabsTrigger>
                                <Tabs.TabsTrigger className="tab-trigger flex items-center gap-2" value={'questions'}>
                                    <ImportContacts />
                                    Questions
                                </Tabs.TabsTrigger>
                                <ResourceOwnerPrivilege resourceRight={data.resourceRight}>
                                    <Tabs.TabsTrigger className="tab-trigger flex items-center gap-2" value={'settings'}>
                                        <Settings />
                                        Settings
                                    </Tabs.TabsTrigger>
                                </ResourceOwnerPrivilege>
                            </Tabs.List>
                            <TabsContent className="tab-content" value={'details'}>
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div className={'text-4xl font-bold'}>{data.name}</div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="flex items-center gap-1"
                                                onClick={isLiked ? handleUnlike : handleLike}
                                            >
                                                {isLiked ? (
                                                    <FavoriteIcon className="text-blue-500" />
                                                ) : (
                                                    <FavoriteBorderIcon className="text-white-500" />
                                                )}
                                                <span className="text-gray-700">{likeCount}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className={'m-5 text-gray-500 flex gap-2'}>
                                        <Description />
                                        {data.description}
                                    </div>
                                    <div className={'flex space-x-6 items-center mt-8'}>
                                        <Avatar variant={'square'}
                                            src={data.author.profilePicture}
                                            component={'div'}
                                            alt="Profile Picture"
                                            sx={{ width: 80, height: 80 }} />
                                        <div>
                                            <h1 className="text-2xl font-bold">{data.author.username}</h1>
                                            <div className="mt-2 space-x-2.5">
                                                <span className={'text-gray-500'}>external links:</span>
                                                <a href="#" className="text-blue-500 hover:underline">Website</a>
                                                <a href="#" className="text-blue-500 hover:underline">GitHub</a>
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent className="tab-content" value={'questions'}>
                                <div>
                                    <div className={'text-2xl mb-5'}>Questions ({data.questions.totalCount}):
                                    </div>

                                    <CollectionQuestion collectionId={data.id}
                                        questionInit={data.questions.items}
                                        pageIndex={pageIndex}
                                        pageSize={pageSize} />

                                    <div className={'my-5'}>
                                        <Pagination count={data.questions.totalPage}
                                            page={pageIndex}
                                            onChange={(e, n) => setPageIndex(n)} />
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent className="tab-content" value={'settings'}>
                                <CollectionSettings collection={data} />
                            </TabsContent>
                        </Tabs.Root>
                    </div>
                </div>
            }
        </div>
    );
}