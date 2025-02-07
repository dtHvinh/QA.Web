'use client'

import React, {useEffect} from "react";
import getAuth from "@/helpers/auth-utils";
import useSWR from "swr";
import {backendURL} from "@/utilities/Constants";
import {getFetcher} from "@/helpers/request-utils";
import {QuestionResponse, TagDetailResponse} from "@/types/types";
import TagQuestionDisplay from "@/app/tags/[...path]/TagQuestionDisplay";
import {Pagination} from "@mui/material";
import FilterBar from "@/components/FilterBar";
import TagQuestionDisplaySkeleton from "@/app/tags/[...path]/TagQuestionDisplaySkeleton";

export default function TagDetailPage({params}: { params: Promise<{ path: string[] }> }) {
    const {path} = React.use(params);
    const {accessToken} = getAuth()!;
    const [pageIndex, setPageIndex] = React.useState<number>(1);
    const [tagQuestions, setTagQuestions] = React.useState<QuestionResponse[]>([]);
    const validOrderValue = ['Newest', 'MostViewed', 'MostVoted', 'Solved', 'Draft'];
    const validOrder = ['Newest', 'Most Viewed', 'Most Voted', 'Solved', 'Draft'];
    const orderDescription = [
        'Newest question base on their creation date',
        'Question has most view',
        'Question has most total vote count',
        'Question has been solved',
        'Questions are still in the process of being refined, clarified, or finalized'
    ];
    const [selectedOrder, setSelectedOrder] = React.useState<string>(validOrderValue[0]);
    const requestUrl = `${backendURL}/api/tag/${path[0]}?orderBy=${selectedOrder}&pageIndex=${pageIndex}&pageSize=15`;

    const {data, isLoading} = useSWR([requestUrl, accessToken], getFetcher);

    useEffect(() => {
        if (data)
            setTagQuestions((data as TagDetailResponse).questions.items);
    }, [data]);

    const tag = data as TagDetailResponse;

    return (
        <div className={'flex flex-col'}>
            <div className={'text-3xl'}>{tag?.name}</div>
            <div className={'text-md mt-5'}>{tag?.description}</div>

            <div className={'mt-5'}>
                <div className={'text-xl font-bold flex justify-between'}>
                    <div>
                        {tag?.questionCount} Questions:
                    </div>

                    <FilterBar tabs={validOrder}
                               tabValues={validOrderValue}
                               tabDescriptions={orderDescription}
                               onFilterValueChange={setSelectedOrder}/>
                </div>

                {isLoading && <TagQuestionDisplaySkeleton/>}

                {tag && tagQuestions.map(question => (
                    <TagQuestionDisplay key={question.id} question={question}/>
                ))}

                <div className={'my-5 flex justify-end'}>
                    <Pagination count={tag?.questions.totalPage}
                                onChange={
                                    ((e, page) =>
                                        setPageIndex(page))
                                }/>
                </div>
            </div>
        </div>
    )
}