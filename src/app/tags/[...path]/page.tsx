'use client'

import TagQuestionDisplay from "@/app/tags/[...path]/TagQuestionDisplay";
import TagQuestionDisplaySkeleton from "@/app/tags/[...path]/TagQuestionDisplaySkeleton";
import ObjectNotfound from "@/components/Error/ObjectNotFound";
import FilterBar from "@/components/FilterBar";
import PermissionAction from "@/components/PermissionAction";
import ModeratorPrivilege from "@/components/Privilege/ModeratorPrivilege";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { QuestionResponse, TagDetailResponse } from "@/types/types";
import { Delete, Edit } from "@mui/icons-material";
import { Pagination, Tooltip } from "@mui/material";
import Link from "next/link";
import React, { useEffect } from "react";
import useSWR from "swr";

export default function TagDetailPage({ params }: { params: Promise<{ path: string[] }> }) {
    const { path } = React.use(params);
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
    const titleRef = React.useRef<HTMLHeadingElement>(null);

    const { data: tag, isLoading } = useSWR<TagDetailResponse>(`/api/tag/${path[0]}?orderBy=${selectedOrder}&pageIndex=${pageIndex}&pageSize=15`, getFetcher);

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
        <div className="page-container mx-auto px-4 py-6 space-y-6">
            {tag && (
                <div className="bg-[var(--card-background)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between gap-5">
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-bold text-[var(--text-primary)]">{tag.name}</h1>
                                <span className="px-3 py-1 text-sm font-medium bg-[var(--primary-light)] text-[var(--primary)] 
                                    rounded-full flex items-center">
                                    {tag.questionCount.toLocaleString()} questions
                                </span>
                            </div>
                            <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-3xl">{tag.description}</p>
                        </div>

                        <div className="flex flex-row md:flex-col gap-4 items-center md:items-end">
                            <Link
                                href={`/wiki/${tag.id}/${tag.name}`}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium
                                    bg-[var(--primary)] text-white hover:bg-[var(--primary-darker)] transition-colors"
                            >
                                View Wiki
                            </Link>

                            <div className="flex gap-3">
                                <PermissionAction action="editTag" allowedHref={`/tags/edit/${tag.id}`}>
                                    <Tooltip title='Edit Tag'>
                                        <div className="p-2.5 rounded-lg hover:bg-[var(--hover-background)] 
                                            text-[var(--text-secondary)] transition-colors">
                                            <Edit />
                                        </div>
                                    </Tooltip>
                                </PermissionAction>

                                <ModeratorPrivilege>
                                    <Tooltip title='Delete Tag'>
                                        <button className="p-2.5 rounded-lg hover:bg-[var(--error-light)] 
                                            text-[var(--error)] transition-colors">
                                            <Delete />
                                        </button>
                                    </Tooltip>
                                </ModeratorPrivilege>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-5">
                <div ref={titleRef} className="bg-[var(--card-background)] border border-[var(--border-color)] 
                    rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                        <div className="text-center py-12 bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl">
                            <p className="text-lg text-[var(--text-secondary)]">No questions found with this tag</p>
                            <p className="mt-2 text-sm text-[var(--text-tertiary)]">Be the first to ask a question!</p>
                        </div>
                    ) : (
                        <div className="bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl overflow-hidden">
                            {tagQuestions.map((question, index) => (
                                <React.Fragment key={question.id}>
                                    <TagQuestionDisplay question={question} />
                                    {index < tagQuestions.length - 1 && (
                                        <div className="border-b border-[var(--border-color)]" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>

                {tag?.questions && tag.questions.totalPage > 1 && (
                    <div className="flex justify-center py-6">
                        <Pagination
                            count={tag.questions.totalPage}
                            page={pageIndex}
                            onChange={(_, page) => setPageIndex(page)}
                            shape="rounded"
                            size="large"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: 'var(--text-primary)',
                                    borderColor: 'var(--border-color)',
                                    '&:hover': {
                                        backgroundColor: 'var(--hover-background)'
                                    }
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}