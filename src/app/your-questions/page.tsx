'use client'

import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Apis, backendURL, Routes } from "@/utilities/Constants";
import { PagedResponse, QuestionResponse } from "@/types/types";
import YourQuestionItem from "@/components/YourQuestionItem";
import Link from "next/link";
import getAuth from "@/helpers/auth-utils";
import ItemPerPage from "@/components/ItemPerPage";
import useSWR from "swr";
import { getFetcher } from "@/helpers/request-utils";
import QuestionCardListSkeleton from "@/components/Skeletons/YQPSkeleton";
import FilterBar from "@/components/FilterBar";

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
        + '/?order=' + orderBy
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
            + '/?order=' + orderBy
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
        <>
            <div className={'grid grid-cols-1 md:grid-cols-2 gap-5'}>
                <div className={'col-span-full flex flex-wrap justify-between items-baseline'}>
                    <div className={'text-2xl mt-4'}> Your {response?.totalCount || 0} questions:</div>
                    <FilterBar tabs={validOrder} tabValues={validOrderValue} tabDescriptions={orderDescription}
                        onFilterValueChange={handleOrderByChange} />
                </div>

                {isLoading && <div className={'col-span-full'}><QuestionCardListSkeleton /></div>}

                {!isLoading && response?.items && response.items.map((question: QuestionResponse) => (
                    <YourQuestionItem key={question.id} question={question} />
                ))}

                {!isLoading && (!response?.items || response.items.length === 0) &&
                    <div>
                        You have not asked any questions yet,&nbsp;
                        <Link href={Routes.NewQuestion} className={'text-blue-500 underline'}>
                            ask a question now
                        </Link>!
                    </div>}
            </div>

            {response?.items && response.items.length > 0 &&
                <div className={'col-span-full items-center flex justify-between my-5'}>
                    <ItemPerPage onPageSizeChange={setPageSize} values={[16, 32, 64]} />
                    <Pagination page={pageIndex} onChange={handlePageChange} count={response?.totalPage} />
                </div>
            }
        </>
    );
}