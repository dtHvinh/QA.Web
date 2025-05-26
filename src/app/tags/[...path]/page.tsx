'use client'

import TagQuestionDisplay from "@/app/tags/[...path]/TagQuestionDisplay";
import TagQuestionDisplaySkeleton from "@/app/tags/[...path]/TagQuestionDisplaySkeleton";
import ActionButton from "@/components/Button/ActionButton";
import DeleteConfirmDialog from "@/components/Dialog/DeleteConfirmDialog";
import ObjectNotfound from "@/components/Error/ObjectNotFound";
import FilterBar from "@/components/FilterBar";
import PermissionAction from "@/components/PermissionAction";
import ModeratorPrivilege from "@/components/Privilege/ModeratorPrivilege";
import { deleteFetcher, getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { QuestionResponse, TagDetailResponse } from "@/types/types";
import { Edit, MenuBook } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import useSWR from "swr";

export default function TagDetailPage({ params }: { params: Promise<{ path: string[] }> }) {
    const { path } = React.use(params);
    const [pageIndex, setPageIndex] = React.useState<number>(1);
    const [tagQuestions, setTagQuestions] = React.useState<QuestionResponse[]>([]);
    const validOrderValue = ['Newest', 'MostViewed', 'MostVoted', 'Solved'];
    const validOrder = ['Newest', 'Most Viewed', 'Most Voted', 'Solved'];
    const orderDescription = ['Newest question base on their creation date', 'Question has most view', 'Question has most total vote count', 'Question has been solved'];
    const [deleteTagConfirmOpen, setDeleteTagConfirmOpen] = React.useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = React.useState<string>(validOrderValue[0]);
    const titleRef = React.useRef<HTMLHeadingElement>(null);
    const router = useRouter();
    const { data: tag, isLoading } = useSWR<TagDetailResponse>(`/api/tag/${path[0]}?orderBy=${selectedOrder}&pageIndex=${pageIndex}&pageSize=15`, getFetcher);

    const handleDeleteTag = async () => {
        const res = await deleteFetcher(`/api/tag/${tag?.id}`);
        if (!IsErrorResponse(res)) {
            setDeleteTagConfirmOpen(false);
            router.push('/tags');
        }
    }

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
        <div className="page-container mx-auto px-4 py-8 space-y-8 max-w-6xl">
            {tag && (
                <div className="bg-[var(--card-background)] border border-[var(--border-color)] rounded-2xl p-8 shadow-md transition-all hover:shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <h1 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">{tag.name}</h1>
                                <span className="px-4 py-1.5 text-sm font-semibold bg-[var(--primary-light)] text-[var(--primary)] 
                                    rounded-full flex items-center shadow-sm">
                                    {tag.questionCount.toLocaleString()} questions
                                </span>
                            </div>
                            <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-3xl">{tag.description}</p>
                        </div>

                        <div className="flex gap-3 md:self-start">
                            <Link
                                href={`/wiki/${tag.id}/${tag.name}`}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium"
                            >
                                <MenuBook fontSize="small" />
                                Wiki
                            </Link>

                            <PermissionAction title={{
                                text: 'Edit Tag',
                                position: 'bottom',
                            }} action="editTag" allowedHref={`/tags/edit/${tag.id}`}>
                                <div className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-[var(--hover-background)] 
                                            text-[var(--text-secondary)] transition-all hover:shadow-sm cursor-pointer">
                                    <Edit />
                                </div>
                            </PermissionAction>

                            <ModeratorPrivilege>
                                <ActionButton
                                    kind="delete"
                                    onClick={() => setDeleteTagConfirmOpen(true)}
                                />
                            </ModeratorPrivilege>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <div ref={titleRef} className="rounded-xl py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--card-background)] border border-[var(--border-color)] px-6 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                        Questions Tagged <span className="text-[var(--primary)]">{tag?.name}</span>
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
                        <div className="text-center py-16 bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl shadow-sm">
                            <p className="text-xl text-[var(--text-secondary)]">
                                No questions found with this tag
                            </p>
                            <p className="mt-3 text-sm text-[var(--text-tertiary)]">
                                Be the first to ask a question!
                            </p>
                            <Link
                                href="/new-question"
                                className="mt-6 inline-block px-5 py-2 rounded-lg font-medium
                                bg-[var(--primary)] text-white hover:bg-[var(--primary-darker)] transition-all"
                            >
                                Ask a Question
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm">
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
                                },
                                '& .Mui-selected': {
                                    backgroundColor: 'var(--primary-light) !important',
                                    color: 'var(--primary) !important',
                                    fontWeight: 'bold'
                                }
                            }}
                        />
                    </div>
                )}
            </div>

            <DeleteConfirmDialog
                itemType="Tag"
                itemName={tag?.name}
                onClose={() => { setDeleteTagConfirmOpen(false) }}
                onConfirm={handleDeleteTag}
                open={deleteTagConfirmOpen}
            />
        </div>
    );
}