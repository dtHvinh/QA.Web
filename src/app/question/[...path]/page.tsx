'use client'

import React, {Usable, useContext, useEffect, useState} from "react";
import {AuthContext} from "@/context/AuthContextProvider";
import {Apis, backendURL} from "@/utilities/Constants";
import useSWR from "swr";
import {getFetcher} from "@/helpers/request-utils";
import notifyError from "@/utilities/ToastrExtensions";
import timeFromNow from "@/helpers/time-utils";
import TagLabel from "@/components/TagLabel";
import {Box} from "@mui/system";
import {AntTab, AntTabs} from "@/components/AntTab";
import RoundedButton from "@/components/RoundedButton";
import CustomTabPanel, {a11yProps} from "@/components/CustomTabPanel";
import CommentSection from "@/app/question/CommentSection";
import EditSection from "@/app/question/EditSection";
import {QuestionResponse} from "@/types/types";


export default function QuestionPage({params}: { params: Usable<{ path: string[] }> }) {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const auth = useContext(AuthContext);
    const {path} = React.use(params);
    const requestUrl = `${backendURL}${Apis.Question.GetQuestionDetail}/view/${path[0]}`

    const {data, error, isLoading} = useSWR([requestUrl, auth?.accessToken], getFetcher);

    const question = data as QuestionResponse;

    useEffect(() => {
        if (error) {
            notifyError('Failed to fetch question');
        }
    }, [error]);

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        data ?
            <>
                <title>{question.title}</title>
                <div className="container mx-auto">
                    <div className="bg-white p-6 rounded-lg">
                        <div className={'grid grid-cols-12'}>

                            <div className={'col-span-1 row-span-full justify-items-center space-y-3'}>
                                <RoundedButton
                                    title={'Upvote'}
                                    svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                              fill="currentColor"
                                              viewBox="0 0 16 16">
                                        <path fillRule="evenodd"
                                              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                    </svg>}
                                />
                                <div>{question.upvote}</div>
                                <RoundedButton
                                    title={'Downvote'}
                                    svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                              fill="currentColor"
                                              viewBox="0 0 16 16">
                                        <path fillRule="evenodd"
                                              d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
                                    </svg>}
                                />

                            </div>

                            <div className={'col-span-11 md:col-span-8 row-span-full'}>
                                <Box>
                                    <Box>
                                        <AntTabs value={tabValue} onChange={handleTabChange}
                                                 aria-label="basic tabs example">
                                            <AntTab label="Question" {...a11yProps(0)} />
                                            <AntTab label="Comment" {...a11yProps(1)} />
                                            <AntTab label="Edit" {...a11yProps(2)} />
                                        </AntTabs>
                                    </Box>
                                    <CustomTabPanel value={tabValue} index={0}>
                                        <div>
                                            <div className={'mx-4 md:mx-0 text-2xl'}>
                                                {question.title}
                                            </div>
                                            <div className={'flex flex-wrap space-x-5 text-gray-500'}>
                                                <div>Asked at: {timeFromNow(question.createdAt)}</div>
                                                {timeFromNow(question.updatedAt) === '1/1/1' ? ""
                                                    : (
                                                        <div className={'flex text-gray-500'}>
                                                            <div>Modified at: {timeFromNow(question.updatedAt)}</div>
                                                        </div>
                                                    )}
                                                <div>
                                                    Views: {question.viewCount}
                                                </div>
                                                <div>
                                                    Answers: {question.answerCount}
                                                </div>
                                            </div>

                                            <div className={'mt-5'}>
                                                <div className={'text-editor-display'}>
                                                    <div className={'p-4 tiptap'}
                                                         dangerouslySetInnerHTML={{__html: question.content}}>
                                                    </div>
                                                </div>

                                                <div className={'mt-2'}>
                                                    <div className={'text-gray-500  flex flex-wrap gap-2'}>
                                                        {question.tags?.map(tag => <TagLabel key={tag.id}
                                                                                             name={tag.name}
                                                                                             description={tag.description}/>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CustomTabPanel>
                                    <CustomTabPanel value={tabValue} index={1}>
                                        <CommentSection question={question}/>
                                    </CustomTabPanel>
                                    {question.resourceRight === "Owner" &&
                                        <CustomTabPanel value={tabValue} index={2}>
                                            <EditSection question={question}/>
                                        </CustomTabPanel>}
                                </Box>

                            </div>

                            <div className={'col-span-1 row-span-full justify-items-center space-y-3'}>
                                <div className={'flex-col flex gap-4 items-center'}>
                                    <RoundedButton
                                        title={'Bookmark'}
                                        svg={<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21"
                                                  fill="currentColor"
                                                  viewBox="0 0 16 16">
                                            <path
                                                d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                                            <path
                                                d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4"/>
                                        </svg>}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            :
            <div>Failed to fetch question</div>
    )
}