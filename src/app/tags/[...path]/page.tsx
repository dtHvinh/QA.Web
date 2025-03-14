'use client'

import TagQuestionDisplay from "@/app/tags/[...path]/TagQuestionDisplay";
import TagQuestionDisplaySkeleton from "@/app/tags/[...path]/TagQuestionDisplaySkeleton";
import ObjectNotfound from "@/components/Error/ObjectNotFound";
import FilterBar from "@/components/FilterBar";
import PermissionAction from "@/components/PermissionAction";
import ModeratorPrivilege from "@/components/Privilege/ModeratorPrivilege";
import getAuth from "@/helpers/auth-utils";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { QuestionResponse, TagDetailResponse } from "@/types/types";
import { Delete, Edit } from "@mui/icons-material";
import { Pagination, Tooltip } from "@mui/material";
import Link from "next/link";
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

    if (!isLoading && IsErrorResponse(tag)) {
        return <ObjectNotfound title="Tag Not Found" message="The tag you're looking for doesn't exist or has been removed." />
    }

    return (
        <div className="page-container mx-auto space-y-8">
            {tag && (
                <div className="bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl p-6 flex flex-col">
                    <div className="space-y-4 flex justify-between items-baseline pb-5">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-[var(--text-primary)]">{tag.name}</h1>
                            <span className="px-3 py-1 text-sm font-medium text-blue-500 bg-blue-500/10 rounded-full">
                                {tag.questionCount} questions
                            </span>
                        </div>

                        <div className="space-x-5 flex justify-end items-center">
                            <Link href={`/wiki/${tag.id}/${tag.name}`}
                                className="border px-2 py-1 rounded-md border-[var(--border-color)] hover:bg-[var(--hover-background)]">
                                Go to Wiki
                            </Link>

                            <PermissionAction action="editTag" allowedHref={`/tags/edit/${tag.id}`}>
                                <Tooltip title='Edit'>
                                    <Edit className="text-[var(--text-secondary)]" />
                                </Tooltip>
                            </PermissionAction>

                            <ModeratorPrivilege>
                                <Tooltip title='Delete this tag'>
                                    <button>
                                        <Delete className="text-[var(--text-secondary)]" />
                                    </button>
                                </Tooltip>
                            </ModeratorPrivilege>
                        </div>
                    </div>

                    <p className="text-[var(--text-secondary)]">{tag.description}</p>
                </div>
            )}

            <div className="space-y-6">
                <div ref={titleRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
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
                        <div className="text-center py-12 bg-[var(--hover-background)] rounded-lg">
                            <p className="text-[var(--text-secondary)]">No questions found with this tag</p>
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
                    <div className="flex justify-center pt-6 border-t border-[var(--border-color)]">
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