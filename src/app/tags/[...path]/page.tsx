'use client'

import React from "react";
import getAuth from "@/helpers/auth-utils";
import useSWR from "swr";
import {backendURL} from "@/utilities/Constants";
import {getFetcher} from "@/helpers/request-utils";
import {TagDetailResponse} from "@/types/types";
import TagQuestionDisplay from "@/app/tags/[...path]/TagQuestionDisplay";
import Loading from "@/app/loading";

export default function TagDetailPage({params}: { params: Promise<{ path: string[] }> }) {
    const {path} = React.use(params);
    const auth = getAuth();
    const requestUrl = `${backendURL}/api/tag/${path[0]}`;

    const {data, error, isLoading} = useSWR([requestUrl, auth.accessToken], getFetcher);

    const tag = data as TagDetailResponse;

    if (isLoading) {
        return <Loading/>;
    }

    return (
        <div className={'flex flex-col'}>
            <div className={'text-3xl'}>{tag.name}</div>
            <div className={'text-md mt-5'}>{tag.description}</div>

            <div className={'mt-5'}>
                <div className={'text-xl font-bold'}>
                    {tag.questionCount} Questions:
                </div>

                {tag.questions.map(question => (
                    <TagQuestionDisplay key={question.id} question={question}/>
                ))}
            </div>
        </div>
    );
}