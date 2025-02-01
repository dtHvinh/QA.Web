'use client';

import React, {useEffect, useState} from "react";
import {Apis, backendURL} from "@/utilities/Constants";
import useSWR from "swr";
import {getFetcher} from "@/helpers/request-utils";
import notifyError from "@/utilities/ToastrExtensions";
import {Box} from "@mui/system";
import {AntTab, AntTabs} from "@/components/AntTab";
import CustomTabPanel, {a11yProps} from "@/components/CustomTabPanel";
import CommentSection from "@/app/question/CommentSection";
import EditSection from "@/app/question/EditSection";
import {QuestionResponse} from "@/types/types";
import getAuth from "@/helpers/auth-utils";
import QuestionSection from "@/app/question/QuestionSection";
import AnswerSection from "@/app/question/AnswerSection";
import {isTrue} from "@/helpers/evaluate-utils";
import hljs from "highlight.js";
import 'highlight.js/styles/vs.min.css';
import Loading from "@/app/loading";

export default function QuestionPage({params}: { params: Promise<{ path: string[] }> }) {
    const {path} = React.use(params);
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const auth = getAuth();
    const requestUrl = `${backendURL}${Apis.Question.GetQuestionDetail}/view/${path[0]}`

    const {data, error, isLoading} = useSWR([requestUrl, auth?.accessToken], getFetcher);

    const question = data as QuestionResponse;

    useEffect(() => {
        if (error) {
            notifyError('Failed to fetch question');
        }
        hljs.highlightAll();
    }, [error, question, tabValue]);

    if (isLoading) {
        return <Loading/>
    }

    return (
        data ?
            <>
                <title>{question.title}</title>
                <div className="container mx-auto">
                    <div className="bg-white p-6 rounded-lg">
                        <div className={'grid grid-cols-12 gap-4'}>
                            <div className={'col-span-12'}>
                                <Box>
                                    <AntTabs value={tabValue} onChange={handleTabChange}
                                             aria-label="basic tabs example">
                                        <AntTab label="Question" {...a11yProps(0)} />
                                        <AntTab label="Comment" {...a11yProps(1)} />
                                        {question.resourceRight === "Owner" &&
                                            !question.isClosed &&
                                            <AntTab label="Edit" {...a11yProps(2)} />}
                                        <AntTab label="Answer"
                                                {...a11yProps(2 + isTrue(question.resourceRight == 'Owner' && !question.isClosed))} />
                                    </AntTabs>
                                </Box>
                            </div>
                            <div className={'col-span-12'}>
                                <Box>
                                    <CustomTabPanel value={tabValue} index={0}>
                                        <QuestionSection question={question}/>
                                    </CustomTabPanel>
                                    <CustomTabPanel value={tabValue} index={1}>
                                        <CommentSection question={question}/>
                                    </CustomTabPanel>
                                    {question.resourceRight === "Owner" &&
                                        !question.isClosed &&
                                        <CustomTabPanel value={tabValue} index={2}>
                                            <EditSection question={question}/>
                                        </CustomTabPanel>}
                                    <CustomTabPanel value={tabValue}
                                                    index={2 + isTrue(question.resourceRight == 'Owner' && !question.isClosed)}>
                                        <AnswerSection question={question}/>
                                    </CustomTabPanel>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            :
            <div>Failed to fetch question</div>
    )
}