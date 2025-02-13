import React from "react";
import {QuestionResponse} from "@/types/types";
import TagLabel from "@/components/TagLabel";
import timeFromNow from "@/helpers/time-utils";
import {formatNumber} from "@/helpers/evaluate-utils";
import QuestionStatusBar from "@/app/question/QuestionStatusBar";
import Link from "next/link";
import toQuestionDetail from "@/helpers/path";

interface YourQuestionItemProps {
    question: QuestionResponse
}

export default function YourQuestionItem(params: Readonly<YourQuestionItemProps>) {
    const {question} = params;

    return (
        <div className='flex flex-col'>
            <div className="rounded-xl border p-5 shadow-md w-full bg-white">
                <div className="flex w-full items-center justify-between border-b pb-3">
                    <div className="flex flex-col">
                        <Link href={toQuestionDetail(question.id, question.slug)}
                              className="text-lg text-blue-500 hover:text-blue-700">{question.title}</Link>
                        <div className={'flex space-x-2.5'}>
                            <QuestionStatusBar {...question}/>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className={'flex justify-end flex-wrap space-x-2'}>
                            {question.tags?.map(tag =>
                                <TagLabel key={tag.id} name={tag.name}
                                          description={tag.description} onClick={console.log}/>
                            )}
                        </div>
                        <div className="flex justify-end text-xs space-x-2.5 text-neutral-600">
                            <div className={'font-bold'}>
                                Asked:
                            </div>
                            <div>
                                {timeFromNow(question.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 mb-2">
                    <p dangerouslySetInnerHTML={{__html: question.content}}
                       className="text-sm text-neutral-400 line-clamp-2">
                    </p>
                </div>

                <div>
                    <div className="flex items-center justify-between text-slate-500">
                        <div className={'flex gap-5'}>
                            <div className="flex space-x-4 md:space-x-8">
                                <div className={'flex gap-1 items-baseline'}>
                                    <span>Vote</span>
                                    <span className={'font-bold'}>{question.upvote - question.downvote}</span>
                                </div>
                            </div>

                            <div className="flex space-x-4 md:space-x-8">
                                <div className={'flex gap-1 items-baseline'}>
                                    <span>View</span>
                                    <span className={'font-bold'}>{formatNumber(question.viewCount)}</span>
                                </div>
                            </div>

                            <div className="flex space-x-4 md:space-x-8">
                                <div className={'flex gap-1 items-baseline'}>
                                    <span>Answer</span>
                                    <span className={'font-bold'}>{formatNumber(question.answerCount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function YourQuestionItemSkeleton() {
    return (
        <div className='flex'>
            <div className="rounded-xl border p-5 shadow-md w-full bg-white animate-pulse">
                <div className="flex w-full items-center justify-between border-b pb-3">
                    <div className="flex flex-col space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="flex space-x-2.5">
                            <div className="h-4 bg-gray-300 rounded w-12"></div>
                            <div className="h-4 bg-gray-300 rounded w-12"></div>
                            <div className="h-4 bg-gray-300 rounded w-12"></div>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-end flex-wrap space-x-2">
                            <div className="h-4 bg-gray-300 rounded w-12"></div>
                            <div className="h-4 bg-gray-300 rounded w-12"></div>
                            <div className="h-4 bg-gray-300 rounded w-12"></div>
                        </div>
                        <div className="flex justify-end text-xs space-x-2.5 text-neutral-600">
                            <div className="h-4 bg-gray-300 rounded w-16"></div>
                            <div className="h-4 bg-gray-300 rounded w-16"></div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 mb-6">
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>

                <div>
                    <div className="flex items-center justify-between text-slate-500">
                        <div className="flex space-x-4 md:space-x-8">
                            <div className="h-4 bg-gray-300 rounded w-12"></div>
                        </div>
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}