'use client';

import React from "react";
import {Apis, backendURL} from "@/utilities/Constants";
import useSWR from "swr";
import {getFetcher, IsErrorResponse} from "@/helpers/request-utils";
import {QuestionResponse} from "@/types/types";
import getAuth from "@/helpers/auth-utils";
import QuestionSection from "@/app/question/QuestionSection";
import 'highlight.js/styles/vs.min.css';
import Loading from "@/app/loading";
import FetchFail from "@/components/FetchFail";

export default function QuestionPage({params}: { params: Promise<{ path: string[] }> }) {
    const {path} = React.use(params);
    const auth = getAuth();
    const requestUrl = `${backendURL}${Apis.Question.GetQuestionDetail}/view/${path[0]}`

    const {data, isLoading} = useSWR([requestUrl, auth?.accessToken], getFetcher);

    const question = data as QuestionResponse;

    if (isLoading) {
        return <Loading/>
    }

    if (IsErrorResponse(data)) {
        return <FetchFail error={'Question not found!'}/>
    }

    return (
        <>
            <title>{question.title}</title>
            <div className="container mx-auto">
                <div className="bg-white p-6 rounded-lg">
                    <div className={'grid grid-cols-12 gap-4'}>
                        <div className={'col-span-12'}>
                            <QuestionSection questionInit={question}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}