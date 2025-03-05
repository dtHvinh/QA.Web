'use client'

import TagQuestionDisplay from "@/app/tags/[...path]/TagQuestionDisplay";
import TagQuestionDisplaySkeleton from "@/app/tags/[...path]/TagQuestionDisplaySkeleton";
import FilterBar from "@/components/FilterBar";
import ObjectNotfound from "@/components/ObjectNotFound";
import getAuth from "@/helpers/auth-utils";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { QuestionResponse, TagDetailResponse } from "@/types/types";
import { Pagination } from "@mui/material";
import React, { useEffect } from "react";
import useSWR from "swr";

export default function TagDetailPage({ params }: { params: Promise<{ path: string[] }> }) {
    const { path } = React.use(params);
    const auth = getAuth()!;
    const [pageIndex, setPageIndex] = React.useState<number>(1);
    const [tagQuestions, setTagQuestions] = React.useState<QuestionResponse[]>([]);
    const validOrderValue = ['Newest', 'MostViewed', 'MostVoted', 'Solved'];
    const validOrder = ['Newest', 'Most Viewed', 'Most Voted', 'Solved'];
    const orderDescription = [
        'Newest question base on their creation date',
        'Question has most view',
        'Question has most total vote count',
        'Question has been solved'
    ];
    const [selectedOrder, setSelectedOrder] = React.useState<string>(validOrderValue[0]);
    const requestUrl = `/api/tag/${path[0]}?orderBy=${selectedOrder}&pageIndex=${pageIndex}&pageSize=15`;
    const titleRef = React.useRef<HTMLHeadingElement>(null);

    const { data: tag, isLoading } = useSWR<TagDetailResponse>([requestUrl, auth?.accessToken], getFetcher);

    useEffect(() => {
        if (!IsErrorResponse(tag)) {
            setTagQuestions((tag as TagDetailResponse).questions.items);
            titleRef.current?.scrollIntoView({ behavior: 'instant' });
        }
    }, [tag]);

    if (IsErrorResponse(tag)) {
        return <ObjectNotfound title="Tag Not Found" message="The tag you're looking for doesn't exist or has been removed." />
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {tag && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">{tag.name}</h1>
                            <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                                {tag.questionCount} questions
                            </span>
                        </div>
                        <p className="text-gray-600">{tag.description}</p>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <div ref={titleRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Questions Tagged [{tag?.name}]
                    </h2>
                    <FilterBar
                        tabs={validOrder}
                        tabValues={validOrderValue}
                        tabDescriptions={orderDescription}
                        onFilterValueChange={setSelectedOrder}
                    />
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <TagQuestionDisplaySkeleton />
                    ) : tagQuestions.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No questions found with this tag</p>
                        </div>
                    ) : (
                        tagQuestions.map(question => (
                            <TagQuestionDisplay
                                key={question.id}
                                question={question}
                            />
                        ))
                    )}
                </div>

                {tag?.questions && tag.questions.totalPage > 1 && (
                    <div className="flex justify-center pt-6 border-t">
                        <Pagination
                            count={tag.questions.totalPage}
                            page={pageIndex}
                            onChange={(_, page) => setPageIndex(page)}
                            shape="rounded"
                            size="large"
                        />
                    </div>
                )}
            </div>
        </div >
    );
}