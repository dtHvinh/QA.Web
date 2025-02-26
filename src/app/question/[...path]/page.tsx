'use client';

import React, { useEffect, useState } from "react";
import { Apis, backendURL } from "@/utilities/Constants";
import useSWR from "swr";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { PagedResponse, QuestionResponse } from "@/types/types";
import getAuth from "@/helpers/auth-utils";
import QuestionSection from "@/app/question/QuestionSection";
import 'highlight.js/styles/vs.min.css';
import Loading from "@/app/loading";
import FetchFail from "@/components/FetchFail";
import { ErrorResponse } from "@/props/ErrorResponse";
import notifyError from "@/utilities/ToastrExtensions";
import Link from "next/link";
import toQuestionDetail from "@/helpers/path";
import { scrollToTop } from "@/helpers/utils";

export default function QuestionPage({ params }: { params: Promise<{ path: string[] }> }) {
    const { path } = React.use(params);
    const auth = getAuth();
    const requestUrl = `${backendURL}${Apis.Question.GetQuestionDetail}/view/${path[0]}`
    const relatedQuestionRequestUrl = `${backendURL}/api/question/${path[0]}/similar?skip=0&take=10`;
    const [relateQuestions, setRelateQuestion] = useState<PagedResponse<QuestionResponse>>()
    const { data, isLoading } = useSWR([requestUrl, auth?.accessToken], getFetcher);

    const question = data as QuestionResponse;

    useEffect(() => {
        scrollToTop()
        getFetcher([relatedQuestionRequestUrl, auth!.accessToken]).then((response: PagedResponse<QuestionResponse> | ErrorResponse) => {
            if (!IsErrorResponse(response)) {
                setRelateQuestion(response as PagedResponse<QuestionResponse>);
                return;
            }
        })
    }, []);

    if (isLoading) {
        return <Loading />
    }

    if (IsErrorResponse(data)) {
        return <FetchFail error={'Question not found!'} />
    }

    return (
        <>
            <title>{question.title}</title>
            <div className="container mx-auto">
                <div className="bg-white p-6 rounded-lg">
                    <div className={'grid grid-cols-12 gap-4'}>
                        <div
                            className={'col-span-full md:col-span-9 border-r min-h-[calc(100vh-var(--appbar-height))]'}>
                            <QuestionSection questionInit={question} />
                        </div>
                        <div className={'col-span-3'}>
                            <span className={'text-xl'}>Relate questions</span>

                            <div className={'flex mt-5 flex-col gap-5'}>
                                {relateQuestions && relateQuestions.items.map((question: QuestionResponse) => (
                                    <div key={question.id} className={'flex flex-col gap-2'}>
                                        <Link
                                            href={toQuestionDetail(question.id, question.slug)}
                                            className={'text-blue-500 hover:text-blue-800 text-sm'}>{question.title}</Link>
                                    </div>))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}