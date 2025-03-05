'use client'

import Loading from "@/app/loading";
import QuestionCardListSkeleton from "@/components/Skeletons/YQPSkeleton";
import YourQuestionItem from "@/components/YourQuestionItem";
import getAuth from "@/helpers/auth-utils";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { PagedResponse, QuestionResponse } from "@/types/types";
import notifyError from "@/utilities/ToastrExtensions";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function Home() {
    const userInfoRequestUrl = `/api/user/`;
    const getQuestionRequestUrl = `/api/question/you_may_like?pageIndex=1&pageSize=30`;
    const auth = getAuth();
    const [questionResults, setQuestionResults] = useState<PagedResponse<QuestionResponse>>();

    const { data: user, isLoading } = useSWR([userInfoRequestUrl, auth?.accessToken], getFetcher);

    useEffect(() => {
        async function fetchQuestions() {
            const fetchResult = await getFetcher([getQuestionRequestUrl, auth!.accessToken]);
            if (IsErrorResponse(fetchResult)) {
                notifyError("Error");
                return;
            }

            setQuestionResults(fetchResult as PagedResponse<QuestionResponse>);
        }

        fetchQuestions().then();
    }, []);

    if (isLoading) return <Loading />;

    return (
        <div className="page-container mx-auto px-4">
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-full">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, <span className="text-blue-600">{user.username}</span>
                    </h1>
                </div>

                <div className="col-span-full md:col-span-4 lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Your Reputation
                                </h2>
                                <p className="text-3xl font-bold text-blue-600 mt-2">
                                    {user.reputation}
                                </p>
                            </div>

                            <div className="relative">
                                <svg className="w-full h-20" viewBox="0 0 180 30" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="100%" height="33%" className="fill-blue-100" />
                                    <rect y="20" width="100%" height="33%" className="fill-blue-100" />
                                    <path
                                        d="M0 27 L90 9.857142857142858 L108 13.285714285714285 L126 9.857142857142858 L144 13.285714285714285 L180 3"
                                        className="stroke-blue-500"
                                        strokeDasharray="6, 6"
                                        strokeWidth="3"
                                        fill="none"
                                    />
                                </svg>
                            </div>

                            <p className="text-sm text-gray-500">
                                Earn reputation by asking and answering questions in the community
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-span-full md:col-span-8 lg:col-span-9">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Recommended Questions
                            </h2>
                        </div>

                        {questionResults == null ? (
                            <QuestionCardListSkeleton />
                        ) : (
                            <div className="space-y-4">
                                {questionResults.items.map((question) => (
                                    <YourQuestionItem
                                        question={question}
                                        key={question.id}
                                        showAuthor={false}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
