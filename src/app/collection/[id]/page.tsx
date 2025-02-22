'use client'

import React from "react";
import {backendURL} from "@/utilities/Constants";
import getAuth from "@/helpers/auth-utils";
import {GetCollectionDetailResponse} from "@/types/types";
import {getFetcher} from "@/helpers/request-utils";
import useSWR from "swr";
import Loading from "@/app/loading";
import {Tabs} from "radix-ui";
import {TabsContent} from "@radix-ui/react-tabs";
import RoundedButton from "@/components/RoundedButton";
import {Avatar} from "@mui/material";
import YourQuestionItem from "@/components/YourQuestionItem";
import {ImportContacts, Info, Settings} from "@mui/icons-material";
import CollectionSettings from "@/app/collection/CollectionSettings";
import ResourceOwnerPrivilege from "@/components/Privilege/ResourceOwnerPrivilege";

export default function CollectionDetailPage({params}: Readonly<{ params: Promise<{ id: string }> }>) {
    const {id} = React.use(params);
    const [pageIndex, setPageIndex] = React.useState(1);
    const requestUrl = `${backendURL}/api/collection/${id}/?pageIndex=${pageIndex}&pageSize=6`;
    const auth = getAuth();

    const {data, isLoading} = useSWR<GetCollectionDetailResponse>([requestUrl, auth?.accessToken], getFetcher);

    if (isLoading)
        return <Loading/>

    const collection = data as GetCollectionDetailResponse;

    return (
        <div>
            <div className={'grid grid-cols-12'}>
                <div
                    className={'col-span-1 flex -ml-4 md:ml-0 flex-col gap-5 items-center min-h-[calc(100vh-var(--appbar-height))]'}>
                    <RoundedButton title={'Like this collection'}
                                   svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor"
                                             className="bi bi-heart" viewBox="0 0 16 16">
                                       <path
                                           d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                                   </svg>}
                    />
                </div>

                <div className={'col-span-11'}>
                    <Tabs.Root defaultValue={'details'}>
                        <Tabs.List className="tabs-list">
                            <Tabs.TabsTrigger className="tab-trigger flex items-center gap-2" defaultChecked={true}
                                              value={'details'}>
                                <Info/>
                                Details
                            </Tabs.TabsTrigger>
                            <Tabs.TabsTrigger className="tab-trigger flex items-center gap-2" value={'questions'}>
                                <ImportContacts/>
                                Questions
                            </Tabs.TabsTrigger>
                            <ResourceOwnerPrivilege resourceRight={collection.resourceRight}>
                                <Tabs.TabsTrigger className="tab-trigger flex items-center gap-2" value={'settings'}>
                                    <Settings/>
                                    Settings
                                </Tabs.TabsTrigger>
                            </ResourceOwnerPrivilege>
                        </Tabs.List>
                        <TabsContent className="tab-content" value={'details'}>
                            <div>
                                <div className={'text-4xl font-bold'}>{collection.name}</div>
                                <div className={'m-5'}>{collection.description}</div>

                                <div className={'flex space-x-6 items-center mt-8'}>
                                    <Avatar variant={'square'}
                                            src={collection.author.profilePicture}
                                            component={'div'}
                                            alt="Profile Picture"
                                            sx={{width: 80, height: 80}}/>
                                    <div>
                                        <h1 className="text-2xl font-bold">{collection.author.username}</h1>
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
                                <div className={'text-2xl mb-5'}>Questions ({collection.questions.items.length}):
                                </div>

                                <div className={'flex flex-col gap-5'}>
                                    {collection.questions.items.map((question, index) => (
                                        <YourQuestionItem key={index} question={question}/>))}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent className="tab-content" value={'settings'}>
                            <CollectionSettings collection={collection}/>
                        </TabsContent>
                    </Tabs.Root>
                </div>
            </div>
        </div>
    );
}