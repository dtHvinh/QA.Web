'use client';

import Loading from "@/app/loading";
import QuestionSection from "@/app/question/QuestionSection";
import ObjectNotfound from "@/components/Error/ObjectNotFound";
import toQuestionDetail from "@/helpers/path";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { PagedResponse, QuestionResponse } from "@/types/types";
import { Apis } from "@/utilities/Constants";
import 'highlight.js/styles/github.min.css';
import Link from "next/link";
import React from "react";
import useSWR from "swr";

export default function QuestionPage({ params }: { params: Promise<{ path: string[] }> }) {
    const { path } = React.use(params);
    const { data, isLoading } = useSWR<QuestionResponse>(`${Apis.Question.GetQuestionDetail}/view/${path[0]}`, getFetcher);
    const { data: relatedQuestions, isLoading: relatedQuestionsLoading } = useSWR<PagedResponse<QuestionResponse>>(`/api/question/${path[0]}/similar?skip=0&take=10`, getFetcher);
    const question = data as QuestionResponse;

    if (isLoading) {
        return <Loading />
    }

    if (IsErrorResponse(data)) {
        return <ObjectNotfound title="Question not found" message="The question you are looking for does not exist." />
    }

    return (
        <>
            <title>{question.title}</title>
            <div className="w-[75rem] mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-3/4">
                        <div className="overflow-hidden">
                            <QuestionSection questionInit={question} />
                        </div>
                    </div>

                    <div className="w-full lg:w-1/4">
                        <div className="sticky top-24">
                            <div className="rounded-xl shadow-sm border border-[var(--border-color)] bg-[var(--card-background)] overflow-hidden p-5">
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Related Questions</h3>

                                {relatedQuestions && relatedQuestions.items.length > 0 ? (
                                    <div className="space-y-4">
                                        {relatedQuestions.items.map((relatedQuestion: QuestionResponse) => (
                                            <div key={relatedQuestion.id} className="group">
                                                <Link
                                                    href={toQuestionDetail(relatedQuestion.id, relatedQuestion.slug)}
                                                    className="block text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors text-sm font-medium"
                                                >
                                                    {relatedQuestion.title}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-[var(--text-tertiary)] text-sm">No related questions found</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}