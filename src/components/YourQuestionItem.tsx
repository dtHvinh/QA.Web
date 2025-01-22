import React from "react";
import {QuestionResponse} from "@/types/types";
import TagLabel from "@/components/TagLabel";
import timeFromNow from "@/helpers/time-utils";
import Link from "next/link";
import toQuestionDetail from "@/helpers/path";

interface YourQuestionItemProps {
    question: QuestionResponse
}

export default function YourQuestionItem(params: Readonly<YourQuestionItemProps>) {
    const {question} = params;

    return (
        <div className='flex'>
            <div className="rounded-xl border p-5 shadow-md w-full bg-white">
                <div className="flex w-full items-center justify-between border-b pb-3">
                    <div className="flex items-center space-x-3">
                        <div className="text-lg font-bold text-slate-700">{question.title}</div>
                    </div>
                    <div className="flex flex-col">
                        <div className={'flex flex-wrap space-x-2'}>
                            {question.tags?.map(tag =>
                                <TagLabel key={tag.id} name={tag.name}
                                          description={tag.description} onClick={console.log}/>
                            )}
                        </div>
                        <div className="text-xs text-end text-neutral-500">{timeFromNow(question.createdAt)}</div>
                    </div>
                </div>

                <div className="mt-4 mb-6">
                    <p dangerouslySetInnerHTML={{__html: question.content}}
                       className="text-sm text-neutral-600 max-h-52 overflow-y-hidden">
                    </p>
                    <Link href={toQuestionDetail(question.id, question.slug)} className={'mt-4'}>...Read more</Link>
                </div>

                <div>
                    <div className="flex items-center justify-between text-slate-500">
                        <div className="flex space-x-4 md:space-x-8">
                            <div
                                className="flex space-x-2.5 cursor-pointer items-center transition hover:text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                          d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
                                </svg>
                                <span>{question.upvote}</span>
                            </div>
                            <div
                                className="flex space-x-2.5 cursor-pointer items-center transition hover:text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                                </svg>
                                <span>{question.downvote}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}