'use client'

import ViewOptionsButton from "@/components/Common/ViewOptionsButton";
import FilterBar from "@/components/FilterBar";
import ItemPerPage from "@/components/ItemPerPage";
import QuestionCardListSkeleton from "@/components/Skeletons/YQPSkeleton";
import YourQuestionItem from "@/components/YourQuestionItem";
import getAuth from "@/helpers/auth-utils";
import { getFetcher } from "@/helpers/request-utils";
import { scrollToTop } from "@/helpers/utils";
import { PagedResponse, QuestionResponse, ViewOptions } from "@/types/types";
import { backendURL, Routes } from "@/utilities/Constants";
import { Pagination } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import useSWR from "swr";


export default function QuestionsPage() {
    const auth = getAuth()!;
    const validOrderValue = ['Newest', 'MostViewed', 'MostVoted', 'Solved'];
    const validOrder = ['Newest', 'Most Viewed', 'Most Voted', 'Solved'];
    const orderDescription = [
        'Newest question base on their creation date',
        'Question has most view',
        'Question has most total vote count',
        'Question has been solved',
        'Questions are still in the process of being refined, clarified, or finalized'
    ];
    const [orderBy, setOrderBy] = useState<string>(validOrderValue[0]);
    const [response, setResponse] = useState<PagedResponse<QuestionResponse>>();
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState(16);
    const [requestUrl, setRequestUrl] = useState<string>(`${backendURL}/api/question`
        + '/?orderBy=' + orderBy
        + `&pageIndex=${pageIndex}`
        + `&pageSize=${pageSize}`);

    const [view, setView] = useState<ViewOptions>('full');

    const { data, isLoading } = useSWR([requestUrl, auth?.accessToken], getFetcher);

    useEffect(() => {
        if (data) {
            setResponse(data);
            setQuestions(data.items);
        }
    }, [data]);

    useEffect(() => {
        setRequestUrl(`/api/question`
            + '/?orderBy=' + orderBy
            + `&pageIndex=${1}`
            + `&pageSize=${pageSize}`);

        scrollToTop();
    }, [pageSize]);

    useEffect(() => {
        setRequestUrl(`/api/question`
            + '/?orderBy=' + orderBy
            + `&pageIndex=${pageIndex}`
            + `&pageSize=${pageSize}`);

        scrollToTop();
    }, [pageIndex, orderBy]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    }

    const handleOrderByChange = (value: string) => {
        setOrderBy(value);
    }

    const questionList = useMemo(() =>
        questions.map((question: QuestionResponse) => (
            <YourQuestionItem key={question.id} question={question} view={view} />
        ))
        , [questions, view]);

    return (
        <div className="page-container mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        All Questions
                    </h1>
                    {response?.totalCount !== undefined && (
                        <p className="text-[var(--text-secondary)]">
                            {response.totalCount.toLocaleString()} questions
                        </p>
                    )}
                </div>

                <Link
                    href={Routes.NewQuestion}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Ask Question
                </Link>
            </div>

            <div className="flex justify-between">
                <FilterBar
                    tabs={validOrder}
                    tabValues={validOrderValue}
                    tabDescriptions={orderDescription}
                    onFilterValueChange={handleOrderByChange}
                />

                <ViewOptionsButton view={view} onChange={setView} />
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <QuestionCardListSkeleton />
                ) : questions && questions.length > 0 ? (
                    questionList
                ) : (
                    <div className="text-center py-16 bg-[var(--hover-background)] rounded-lg">
                        <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No questions found</h3>
                        <p className="text-[var(--text-secondary)]">
                            Be the first to
                            <Link href={Routes.NewQuestion} className="ml-1 text-blue-500 hover:underline">
                                ask a question
                            </Link>
                        </p>
                    </div >
                )
                }
            </div >

            {response && questions && questions.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t border-[var(--border-color)]">
                    <ItemPerPage
                        onPageSizeChange={setPageSize}
                        values={[16, 32, 64]}
                    />
                    <Pagination
                        page={pageIndex}
                        onChange={handlePageChange}
                        count={response?.totalPage}
                        shape="rounded"
                        size="large"
                    />
                </div>
            )}
        </div >
    );
}