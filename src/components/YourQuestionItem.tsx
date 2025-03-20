import QuestionStatusBar from "@/app/question/QuestionStatusBar";
import TagLabel from "@/components/TagLabel";
import { formatNumber } from "@/helpers/evaluate-utils";
import toQuestionDetail from "@/helpers/path";
import timeFromNow from "@/helpers/time-utils";
import { QuestionResponse, ViewOptions } from "@/types/types";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import UserInfoPopup from "./UserInfoPopup";

interface YourQuestionItemProps {
    question: QuestionResponse,
    showAuthor?: boolean,
    view?: ViewOptions,
}

export default function YourQuestionItem({ question, showAuthor = true, view = 'full' }: Readonly<YourQuestionItemProps>) {
    return (
        <div className={`bg-[var(--card-background)] rounded-lg ${'border border-[var(--border-color)]'} hover:border-blue-500 hover:shadow-sm transition-all ${view === 'compact' ? 'p-2' : 'p-4'}`}>
            <div className={`${view === 'compact' ? 'space-y-1.5 px-2' : 'space-y-3'}`}>
                <div className="flex items-start justify-between gap-3">
                    <Link href={toQuestionDetail(question.id, question.slug)}
                        className={`font-semibold line-clamp-1 text-[var(--text-primary)] hover:text-blue-500 transition-colors flex-grow
                                ${view === 'compact' ? 'text-sm' : 'text-base'}`}>
                        <Tooltip title={question.title}>
                            <span>
                                {question.title}
                            </span>
                        </Tooltip>
                    </Link>
                    {view === 'full' && <QuestionStatusBar {...question} />}
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                        {question.tags?.map(tag =>
                            <TagLabel
                                key={tag.id}
                                name={tag.name}
                                description={tag.description}
                            />
                        )}
                    </div>

                    {view === 'compact' && showAuthor && question.author && (
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] shrink-0">
                            <UserInfoPopup user={question.author} />
                            <span className="text-xs">
                                {timeFromNow(question.createdAt)}
                            </span>
                        </div>
                    )}
                </div>

                {view === 'full' ? (
                    <>
                        <p dangerouslySetInnerHTML={{ __html: question.content }}
                            className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        </p>

                        <div className="flex items-center justify-between pt-2 text-sm">
                            <div className="flex gap-4">
                                <span className="text-[var(--text-secondary)]">
                                    <span className="font-medium">{question.score}</span> votes
                                </span>
                                <span className="text-[var(--text-secondary)]">
                                    <span className="font-medium">{formatNumber(question.viewCount)}</span> views
                                </span>
                                <span className={question.isSolved ? 'text-green-500' : 'text-[var(--text-secondary)]'}>
                                    <span className="font-medium">{formatNumber(question.answerCount)}</span> answers
                                </span>
                            </div>

                            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                                {showAuthor && <UserInfoPopup user={question.author} />}
                                <span className="text-xs">
                                    asked {timeFromNow(question.createdAt)}
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <p dangerouslySetInnerHTML={{ __html: question.content }}
                            className="text-sm text-[var(--text-secondary)] line-clamp-1 leading-relaxed">
                        </p></>
                )}
            </div>
        </div>
    );
}

export function YourQuestionItemSkeleton() {
    return (
        <div className='flex'>
            <div className="rounded-xl border border-[var(--border-color)] p-5 shadow-md w-full bg-[var(--card-background)] animate-pulse">
                <div className="flex w-full items-center justify-between border-b border-[var(--border-color)] pb-3">
                    <div className="flex flex-col space-y-2">
                        <div className="h-4 bg-[var(--skeleton-color)] rounded w-3/4"></div>
                        <div className="flex space-x-2.5">
                            <div className="h-4 bg-[var(--skeleton-color)] rounded w-12"></div>
                            <div className="h-4 bg-[var(--skeleton-color)] rounded w-12"></div>
                            <div className="h-4 bg-[var(--skeleton-color)] rounded w-12"></div>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-end flex-wrap space-x-2">
                            <div className="h-4 bg-[var(--skeleton-color)] rounded w-12"></div>
                            <div className="h-4 bg-[var(--skeleton-color)] rounded w-12"></div>
                            <div className="h-4 bg-[var(--skeleton-color)] rounded w-12"></div>
                        </div>
                        <div className="flex justify-end text-xs space-x-2.5">
                            <div className="h-4 bg-[var(--skeleton-color)] rounded w-16"></div>
                            <div className="h-4 bg-[var(--skeleton-color)] rounded w-16"></div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 mb-6">
                    <div className="h-4 bg-[var(--skeleton-color)] rounded w-full mb-2"></div>
                    <div className="h-4 bg-[var(--skeleton-color)] rounded w-full mb-2"></div>
                    <div className="h-4 bg-[var(--skeleton-color)] rounded w-3/4"></div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-4 md:space-x-8">
                            <div className="h-4 bg-[var(--skeleton-color)] rounded w-12"></div>
                        </div>
                        <div className="h-4 bg-[var(--skeleton-color)] rounded w-24"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}