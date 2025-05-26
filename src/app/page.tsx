'use client'

import Loading from "@/app/loading";
import ViewOptionsButton from "@/components/Common/ViewOptionsButton";
import QuestionCardListSkeleton from "@/components/Skeletons/YQPSkeleton";
import YourQuestionItem from "@/components/YourQuestionItem";
import { getFetcher } from "@/helpers/request-utils";
import { PagedResponse, QuestionResponse, UserResponse, ViewOptions } from "@/types/types";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

export default function Home() {
    const { data: questionResults, isLoading: isQuestionLoading } = useSWR<PagedResponse<QuestionResponse>>(
        `/api/question/you_may_like?pageIndex=1&pageSize=30`, getFetcher, {
        revalidateOnFocus: false,
    });
    const { data: user, isLoading, error } = useSWR<UserResponse>(`/api/user/`, getFetcher);
    const [view, setView] = useState<ViewOptions>('full')

    if (isLoading) return <Loading />;

    return (
        <div className="page-container mx-auto px-4 mb-5">
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-full">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Welcome back, <span className="text-blue-500">{user?.userName}</span>
                    </h1>
                </div>

                <div className="col-span-full md:col-span-4 lg:col-span-3">
                    <div className="bg-[var(--card-background)] rounded-xl shadow-sm border border-[var(--border-color)] p-6">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                                    Your Reputation
                                </h2>
                                <p className="text-3xl font-bold text-blue-500 mt-2">
                                    {user?.reputation}
                                </p>
                            </div>

                            <div className="relative">
                                <svg className="w-full h-20" viewBox="0 0 180 30" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="100%" height="33%" className="fill-blue-100/20" />
                                    <rect y="20" width="100%" height="33%" className="fill-blue-100/20" />
                                    <path
                                        d="M0 27 L90 9.857142857142858 L108 13.285714285714285 L126 9.857142857142858 L144 13.285714285714285 L180 3"
                                        className="stroke-blue-500"
                                        strokeDasharray="6, 6"
                                        strokeWidth="3"
                                        fill="none"
                                    />
                                </svg>
                            </div>

                            <p className="text-sm text-[var(--text-secondary)]">
                                Earn reputation by asking and answering questions in the community
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 bg-[var(--card-background)] rounded-xl shadow-sm border border-[var(--border-color)] p-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                                Join Communities
                            </h2>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Connect with other developers, share knowledge, and collaborate in specialized communities.
                            </p>
                            <Link
                                href="/community"
                                className="inline-block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-lg 
                                    hover:bg-[var(--primary-darker)] transition-colors font-medium"
                            >
                                Explore
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-span-full md:col-span-8 lg:col-span-9 mb-5">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
                                Recommended Questions
                            </h2>

                            <ViewOptionsButton view={view} onChange={setView} />
                        </div>

                        {(isQuestionLoading || !questionResults) ? (
                            <QuestionCardListSkeleton />
                        ) : (
                            <div className="space-y-4">
                                {questionResults.items.map((question) => (
                                    <YourQuestionItem
                                        view={view}
                                        question={question}
                                        key={question.id}
                                        showAuthor={true}
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
