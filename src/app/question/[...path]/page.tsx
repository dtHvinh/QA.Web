'use client';

import Loading from "@/app/loading";
import QuestionSection from "@/app/question/QuestionSection";
import ObjectNotfound from "@/components/Error/ObjectNotFound";
import getAuth from "@/helpers/auth-utils";
import toQuestionDetail from "@/helpers/path";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { ErrorResponse } from "@/props/ErrorResponse";
import { PagedResponse, QuestionResponse } from "@/types/types";
import { Apis } from "@/utilities/Constants";
import 'highlight.js/styles/github.min.css';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export default function QuestionPage({ params }: { params: Promise<{ path: string[] }> }) {
    const { path } = React.use(params);
    const auth = getAuth();
    const requestUrl = `${Apis.Question.GetQuestionDetail}/view/${path[0]}`
    const relatedQuestionRequestUrl = `/api/question/${path[0]}/similar?skip=0&take=10`;
    const [relatedQuestions, setRelatedQuestions] = useState<PagedResponse<QuestionResponse>>()
    const { data, isLoading } = useSWR([requestUrl, auth?.accessToken], getFetcher);

    const question = data as QuestionResponse;

    useEffect(() => {
        getFetcher([relatedQuestionRequestUrl, auth!.accessToken]).then((response: PagedResponse<QuestionResponse> | ErrorResponse) => {
            if (!IsErrorResponse(response)) {
                setRelatedQuestions(response as PagedResponse<QuestionResponse>);
            }
        })
    }, []);

    if (isLoading) {
        return <Loading />
    }

    if (IsErrorResponse(data)) {
        return <ObjectNotfound title="Question not found" message="The question you are looking for does not exist." />
    }

    return (
        <>
            <title>{question.title}</title>
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-3/4">
                        <div className="bg-white overflow-hidden">
                            <QuestionSection questionInit={question} />
                        </div>
                    </div>

                    <div className="w-full lg:w-1/4">
                        <div className="sticky top-24">
                            <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden p-5">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Questions</h3>

                                {relatedQuestions && relatedQuestions.items.length > 0 ? (
                                    <div className="space-y-4">
                                        {relatedQuestions.items.map((relatedQuestion: QuestionResponse) => (
                                            <div key={relatedQuestion.id} className="group">
                                                <Link
                                                    href={toQuestionDetail(relatedQuestion.id, relatedQuestion.slug)}
                                                    className="block text-gray-700 group-hover:text-blue-600 transition-colors text-sm font-medium"
                                                >
                                                    {relatedQuestion.title}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-sm">No related questions found</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}