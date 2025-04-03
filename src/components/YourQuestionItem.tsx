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
        <div className={`bg-[var(--card-background)] rounded-lg ${'border-2 border-[var(--border-color)]'} hover:border-blue-500 hover:shadow-sm transition-all ${view === 'compact' ? 'p-2' : 'p-3'}`}>
            <div className={`${view === 'compact' ? 'space-y-1 px-1.5' : 'space-y-2'}`}>
                <div className="flex items-start justify-between gap-2">
                    <Link href={toQuestionDetail(question.id, question.slug)}
                        className={`font-medium line-clamp-1 text-[var(--text-primary)] hover:text-blue-500 transition-colors flex-grow
                                ${view === 'compact' ? 'text-xs' : 'text-sm'}`}>
                        <Tooltip title={question.title}>
                            <span className={`${question.isDuplicate && 'text-orange-500'}`}>{question.title}</span>
                        </Tooltip>
                    </Link>
                    {view === 'full' && <QuestionStatusBar {...question} />}
                </div>

                {view === 'full' ? (
                    <>
                        <p dangerouslySetInnerHTML={{ __html: question.content }}
                            className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        </p>

                        <div className="flex flex-wrap gap-1">
                            {question.tags?.map(tag =>
                                <TagLabel
                                    tagId={tag.id}
                                    key={tag.id}
                                    name={tag.name}
                                    description={tag.description}
                                />
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-1.5 text-xs">
                            <div className="flex gap-3">
                                <span className="text-[var(--text-secondary)]  p-1 px-2">
                                    <span className="font-medium">{question.score}</span> votes
                                </span>
                                <span className="text-[var(--text-secondary)]  p-1 px-2">
                                    <span className="font-medium">{formatNumber(question.viewCount)}</span> views
                                </span>
                                <Tooltip title={question.isSolved ? 'See answers' : 'Answer this question'}>
                                    <Link href={toQuestionDetail(question.id, question.slug, 'answer')} className={`${question.isSolved ? 'text-green-500' : 'text-[var(--text-secondary)]'} p-1 px-2 bg-gray-200 rounded-full`}>
                                        <span className="font-medium">{formatNumber(question.answerCount)}</span> answers
                                    </Link>
                                </Tooltip>
                            </div>

                            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                {showAuthor && <UserInfoPopup user={question.author} />}
                                <span className="font-bold">{formatNumber(question.author.reputation)}</span>
                                <span className="text-xs">
                                    asked {timeFromNow(question.createdAt)}
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <p dangerouslySetInnerHTML={{ __html: question.content }}
                            className="text-xs text-[var(--text-secondary)] line-clamp-1 leading-relaxed">
                        </p>

                        <div className="flex items-center justify-between gap-1.5">
                            <div className="flex flex-wrap gap-1">
                                {question.tags?.map(tag =>
                                    <TagLabel
                                        key={tag.id}
                                        name={tag.name}
                                        description={tag.description}
                                    />
                                )}
                            </div>

                            {showAuthor && question.author && (
                                <div className="text-xs flex items-center gap-1.5 text-[var(--text-secondary)] shrink-0">
                                    <UserInfoPopup user={question.author} />
                                    <span className="font-bold">{formatNumber(question.author.reputation)}</span>
                                    <span>
                                        asked {timeFromNow(question.createdAt)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export function YourQuestionItemSkeleton({ view = 'full' }: { view?: ViewOptions }) {
    return (
        <div className={`bg-[var(--card-background)] rounded-lg border border-[var(--border-color)] ${view === 'compact' ? 'p-2' : 'p-3'}`}>
            <div className={`${view === 'compact' ? 'space-y-1 px-1.5' : 'space-y-2'}`}>
                <div className="flex items-start justify-between gap-2">
                    <div className="h-5 bg-[var(--skeleton-color)] rounded flex-grow"></div>
                    {view === 'full' && <div className="h-5 w-24 bg-[var(--skeleton-color)] rounded"></div>}
                </div>

                {view === 'full' ? (
                    <>
                        <div className="space-y-1">
                            <div className="h-3 bg-[var(--skeleton-color)] rounded w-full"></div>
                            <div className="h-3 bg-[var(--skeleton-color)] rounded w-3/4"></div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                            <div className="h-5 w-16 bg-[var(--skeleton-color)] rounded-full"></div>
                            <div className="h-5 w-20 bg-[var(--skeleton-color)] rounded-full"></div>
                            <div className="h-5 w-14 bg-[var(--skeleton-color)] rounded-full"></div>
                        </div>

                        <div className="flex items-center justify-between pt-1.5">
                            <div className="flex gap-3">
                                <div className="h-4 w-16 bg-[var(--skeleton-color)] rounded"></div>
                                <div className="h-4 w-16 bg-[var(--skeleton-color)] rounded"></div>
                                <div className="h-4 w-16 bg-[var(--skeleton-color)] rounded"></div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 bg-[var(--skeleton-color)] rounded-full"></div>
                                <div className="h-4 w-12 bg-[var(--skeleton-color)] rounded"></div>
                                <div className="h-4 w-24 bg-[var(--skeleton-color)] rounded"></div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="h-3 bg-[var(--skeleton-color)] rounded w-3/4"></div>

                        <div className="flex items-center justify-between gap-1.5">
                            <div className="flex flex-wrap gap-1">
                                <div className="h-5 w-16 bg-[var(--skeleton-color)] rounded-full"></div>
                                <div className="h-5 w-20 bg-[var(--skeleton-color)] rounded-full"></div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                                <div className="h-6 w-6 bg-[var(--skeleton-color)] rounded-full"></div>
                                <div className="h-4 w-12 bg-[var(--skeleton-color)] rounded"></div>
                                <div className="h-4 w-24 bg-[var(--skeleton-color)] rounded"></div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}