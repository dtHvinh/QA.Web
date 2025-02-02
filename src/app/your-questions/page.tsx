'use client'

import {MenuItem, Pagination, Select, SelectChangeEvent} from "@mui/material";
import React, {useState} from "react";
import {Apis, backendURL, Routes} from "@/utilities/Constants";
import {getFetcher} from "@/helpers/request-utils";
import useSWR from "swr";
import {PagedResponse, QuestionResponse} from "@/types/types";
import notifyError from "@/utilities/ToastrExtensions";
import YourQuestionItem from "@/components/YourQuestionItem";
import Link from "next/link";
import getAuth from "@/helpers/auth-utils";
import Loading from "@/app/loading";

export default function YourQuestionPage() {
    const auth = getAuth();
    const validOrderValue = ['Newest', 'MostViewed', 'MostVoted', 'Solved'];
    const validOrder = ['Newest', 'Most Viewed', 'Most Voted', 'Solved'];
    const [orderBy, setOrderBy] = useState<string>(validOrderValue[0]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const pageSize = 10;

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    }

    const requestUrl =
        `${backendURL}${Apis.Question.GetYourQuestions}`
        + '/?order=' + orderBy
        + `&pageIndex=${pageIndex}`
        + `&pageSize=${pageSize}`;

    const {data, error, isLoading} = useSWR([requestUrl, auth?.accessToken], getFetcher)

    const question = data as PagedResponse<QuestionResponse>;

    const handleOrderByChange = (event: SelectChangeEvent) => {
        setOrderBy(event.target.value);
    }

    if (isLoading)
        return <Loading/>

    if (error) {
        notifyError('Failed to fetch your questions');
    }

    return (
        <div className={'flex flex-col'}>
            <div className={'flex justify-between items-baseline'}>
                <div className={'text-2xl mt-4'}> Your {question.totalCount} questions:</div>
                <Select className={'focus:outline-0 focus:border-0'}
                        value={orderBy}
                        onChange={handleOrderByChange}
                        variant={"standard"}
                        disableUnderline={true}
                >
                    {validOrder.map((order, index) => (
                        <MenuItem key={index} value={validOrderValue[index]}>{order}</MenuItem>
                    ))}
                </Select>
            </div>

            <div className={'flex flex-col gap-5 mb-5 mt-4'}>
                {isLoading && <div>Loading...</div>}
                {question && question.items.map((question: QuestionResponse) => (
                    <YourQuestionItem key={question.id} question={question}/>
                ))}
                {question && question.items.length === 0 &&
                    <div>
                        You have not asked any questions yet,&nbsp;
                        <Link href={Routes.NewQuestion} className={'text-blue-500 underline'}>
                            ask a question now
                        </Link>!
                    </div>}
            </div>

            <div className={'pb-5 flex justify-end'}>
                <Pagination onChange={handlePageChange} count={Math.ceil(question.totalCount / pageSize)}/>
            </div>
        </div>
    );
}