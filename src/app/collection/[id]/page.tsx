'use client'

import CollectionQuestions from "@/app/collection/CollectionQuestions";
import CollectionSettings from "@/app/collection/CollectionSettings";
import Loading from "@/app/loading";
import ResourceOwnerPrivilege from "@/components/Privilege/ResourceOwnerPrivilege";
import getAuth from "@/helpers/auth-utils";
import { deleteFetcher, getFetcher, IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import { GetCollectionDetailResponse } from "@/types/types";
import { notifySucceed } from "@/utilities/ToastrExtensions";
import { Description, ImportContacts, Info, Settings } from "@mui/icons-material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Avatar, Pagination } from "@mui/material";
import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs } from "radix-ui";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

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
        <div className="page-container mx-auto">
            {data && (
                <div className="space-y-6">
                    <Tabs.Root defaultValue="details" className="w-full">
                        <Tabs.List className="flex space-x-1 border-b border-[var(--border-color)] mb-6">
                            <Tabs.TabsTrigger
                                className="px-4 py-2 -mb-px text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                                value="details"
                            >
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    Details
                                </div>
                            </Tabs.TabsTrigger>
                            <Tabs.TabsTrigger
                                className="px-4 py-2 -mb-px text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                                value="questions"
                            >
                                <div className="flex items-center gap-2">
                                    <ImportContacts className="w-4 h-4" />
                                    Questions
                                </div>
                            </Tabs.TabsTrigger>
                            <ResourceOwnerPrivilege resourceRight={data.resourceRight}>
                                <Tabs.TabsTrigger
                                    className="px-4 py-2 -mb-px text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                                    value="settings"
                                >
                                    <div className="flex items-center gap-2">
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </div>
                                </Tabs.TabsTrigger>
                            </ResourceOwnerPrivilege>
                        </Tabs.List>

                        <TabsContent value="details" className="focus:outline-none">
                            <div className="space-y-8">
                                <div className="flex justify-between items-start">
                                    <h1 className="text-4xl font-bold text-[var(--text-primary)]">{data.name}</h1>
                                    <button
                                        onClick={isLiked ? handleUnlike : handleLike}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] hover:bg-[var(--hover-background)] transition-colors"
                                    >
                                        {isLiked ? (
                                            <FavoriteIcon className="w-5 h-5 text-red-500" />
                                        ) : (
                                            <FavoriteBorderIcon className="w-5 h-5 text-[var(--text-tertiary)]" />
                                        )}
                                        <span className="text-sm font-medium text-[var(--text-secondary)]">{likeCount}</span>
                                    </button>
                                </div>

                                <div className="bg-[var(--hover-background)] rounded-xl p-6">
                                    <div className="flex items-start gap-3 text-[var(--text-secondary)]">
                                        <Description className="w-5 h-5 mt-1" />
                                        <p className="text-lg">{data.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 p-6 bg-[var(--card-background)] rounded-xl border border-[var(--border-color)]">
                                    <Avatar
                                        variant="rounded"
                                        src={data.author.profilePicture}
                                        alt={data.author.username}
                                        sx={{ width: 80, height: 80 }}
                                    />
                                    <div className="space-y-3">
                                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                                            {data.author.username}
                                        </h2>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-[var(--text-secondary)]">External links:</span>
                                            <a href="#" className="text-blue-500 hover:underline">Website</a>
                                            <a href="#" className="text-blue-500 hover:underline">GitHub</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="questions" className="focus:outline-none">
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                                    Questions ({data.questions.totalCount})
                                </h2>

                                <CollectionQuestions
                                    resourceRight={data.resourceRight}
                                    collectionId={data.id}
                                    questionInit={data.questions.items}
                                    pageIndex={pageIndex}
                                    pageSize={pageSize}
                                />

                                {data.questions.totalPage > 1 && (
                                    <div className="flex justify-center py-6">
                                        <Pagination
                                            count={data.questions.totalPage}
                                            page={pageIndex}
                                            onChange={(_, n) => setPageIndex(n)}
                                            shape="rounded"
                                            size="large"
                                        />
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="settings" className="focus:outline-none">
                            <CollectionSettings collection={data} />
                        </TabsContent>
                    </Tabs.Root>
                </div>
            )}
        </div>
    );
}