'use client'

import getAuth from "@/helpers/auth-utils";
import {backendURL} from "@/utilities/Constants";
import useSWR from "swr";
import {getFetcher, IsErrorResponse} from "@/helpers/request-utils";
import {PagedResponse, QuestionResponse, UserResponse} from "@/types/types";
import Loading from "@/app/loading";
import React, {useEffect, useState} from "react";
import notifyError from "@/utilities/ToastrExtensions";
import YourQuestionItem from "@/components/YourQuestionItem";

export default function Home() {
    const userInfoRequestUrl = `${backendURL}/api/user/`;
    const getQuestionRequestUrl = `${backendURL}/api/question/you_may_like?pageIndex=1&pageSize=30`;
    const auth = getAuth();
    const [questionResults, setQuestionResults] = useState<PagedResponse<QuestionResponse>>();

    const {data, isLoading} = useSWR([userInfoRequestUrl, auth?.accessToken], getFetcher);

    useEffect(() => {
        async function fetchQuestions() {
            const fetchResult = await getFetcher([getQuestionRequestUrl, auth!.accessToken]);
            if (IsErrorResponse(fetchResult)) {
                notifyError("Error");
                return;
            }

            setQuestionResults(fetchResult as PagedResponse<QuestionResponse>);

            console.log(fetchResult);
        }

        fetchQuestions().then();
    }, []);

    if (isLoading)
        return <Loading/>

    const user = data as UserResponse;

    return (
        <div>
            <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="text-2xl col-span-3">
                    Hello, {auth?.username}
                </div>
                
                <div className="gap-4 col-span-3 md:col-span-1 h-full m-2 p-4 flex flex-col">
                    <div className="text-lg font-semibold">
                        Reputation
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex">
                            <div className="w-3/4 -ml-4 text-center">
                                {user?.reputation}
                            </div>
                            <svg viewBox="0 0 180 30" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100%" height="33%" fill="lightblue">
                                </rect>
                                <rect y="20" width="100%" height="33%" fill="lightblue">
                                </rect>
                                <path
                                    d="M0 27 L90 9.857142857142858 L108 13.285714285714285 L126 9.857142857142858 L144 13.285714285714285 L180 3"
                                    stroke="blue" strokeDasharray="6, 6" strokeWidth="3" fill="none">
                                </path>
                            </svg>
                        </div>
                        <small>Earn reputation by ask and answer a question</small>
                    </div>
                </div>

                <div className={'col-span-full space-y-5 mb-5'}>
                    <div className={'text-2xl mt-5 font-bold'}>Question for you</div>

                    {questionResults?.items.map((question) => (
                        <YourQuestionItem question={question} key={question.id}/>
                    ))}
                </div>
            </div>
        </div>
    );
}
