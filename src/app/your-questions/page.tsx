'use client'

import FilterBar from "@/components/FilterBar";
import ItemPerPage from "@/components/ItemPerPage";
import QuestionCardListSkeleton from "@/components/Skeletons/YQPSkeleton";
import YourQuestionItem from "@/components/YourQuestionItem";
import getAuth from "@/helpers/auth-utils";
import { getFetcher } from "@/helpers/request-utils";
import { PagedResponse, QuestionResponse } from "@/types/types";
import { Apis, backendURL, Routes } from "@/utilities/Constants";
import { Pagination } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export default function YourQuestionPage() {
    const auth = getAuth();
    const validOrderValue = ['Newest', 'MostViewed', 'MostVoted', 'Solved', 'Draft'];
    const validOrder = ['Newest', 'Most Viewed', 'Most Voted', 'Solved', 'Draft'];
    const orderDescription = [
        'Newest question base on their creation date',
        'Question has most view',
        'Question has most total vote count',
        'Question has been solved',
        'Questions are still in the process of being refined, clarified, or finalized'
    ];
    const [orderBy, setOrderBy] = useState<string>(validOrderValue[0]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState(16);
    const [response, setResponse] = useState<PagedResponse<QuestionResponse>>();
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [requestUrl, setRequestUrl] = useState<string>(`${backendURL}${Apis.Question.GetYourQuestions}`
        + '/?orderBy=' + orderBy
        + `&pageIndex=${pageIndex}`
        + `&pageSize=${pageSize}`);

    const { data, isLoading } = useSWR([requestUrl, auth?.accessToken], getFetcher);

    useEffect(() => {
        if (data) {
            setResponse(data);
        }
    }, [data]);

    useEffect(() => {
        setRequestUrl(`${backendURL}${Apis.Question.GetYourQuestions}`
            + '/?orderBy=' + orderBy
            + `&pageIndex=${1}`
            + `&pageSize=${pageSize}`);
    }, [pageSize]);

    useEffect(() => {
        setRequestUrl(`${backendURL}/api/question/user`
            + '/?orderBy=' + orderBy
            + `&pageIndex=${pageIndex}`
            + `&pageSize=${pageSize}`);
    }, [pageIndex, orderBy]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    }

    const handleOrderByChange = (value: string) => {
        setOrderBy(value);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Your Questions</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            You have asked {response?.totalCount || 0} questions
                        </p>
                    </div>
                    <div className="w-full sm:w-auto">
                        <FilterBar
                            tabs={validOrder}
                            tabValues={validOrderValue}
                            tabDescriptions={orderDescription}
                            onFilterValueChange={handleOrderByChange}
                        />
                    </div>
                </div>

                <div className="min-h-[400px]">
                    {isLoading ? (
                        <QuestionCardListSkeleton />
                    ) : response?.items && response.items.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {response.items.map((question: QuestionResponse) => (
                                <YourQuestionItem key={question.id} question={question} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                                <p className="text-gray-500 mb-4">Start sharing your knowledge with the community</p>
                                <Link
                                    href={Routes.NewQuestion}
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                >
                                    Ask a Question
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {response?.items && response.items.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <ItemPerPage
                                onPageSizeChange={setPageSize}
                                values={[16, 32, 64]}
                            />
                            <Pagination
                                page={pageIndex}
                                onChange={handlePageChange}
                                count={response?.totalPage}
                                variant="outlined"
                                shape="rounded"
                                size="large"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        borderColor: 'rgb(229 231 235)',
                                        '&.Mui-selected': {
                                            backgroundColor: 'rgb(59 130 246)',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgb(37 99 235)',
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}