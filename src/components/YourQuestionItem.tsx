import React from "react";
import {QuestionResponse} from "@/types/types";
import TagLabel from "@/components/TagLabel";
import timeFromNow from "@/helpers/time-utils";
import Link from "next/link";
import toQuestionDetail from "@/helpers/path";
import SolvedLabel from "@/app/question/SolvedLabel";
import ClosedLabel from "@/app/question/ClosedLabel";

interface YourQuestionItemProps {
    question: QuestionResponse
}

export default function YourQuestionItem(params: Readonly<YourQuestionItemProps>) {
    const {question} = params;

    return (
        <div className='flex'>
            <div className="rounded-xl border p-5 shadow-md w-full bg-white">
                <div className="flex w-full items-center justify-between border-b pb-3">
                    <div className="flex flex-col">
                        <div className="text-lg font-bold text-slate-700">{question.title}</div>
                        <div className={'flex space-x-2.5'}>
                            {question.isSolved && <SolvedLabel/>}
                            {question.isClosed && <ClosedLabel/>}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className={'flex justify-end flex-wrap space-x-2'}>
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
                       className="text-sm text-neutral-400 max-h-16 overflow-y-hidden">
                    </p>
                    <Link href={toQuestionDetail(question.id, question.slug)} className={'mt-4'}>...Read more</Link>
                </div>

                <div>
                    <div className="flex items-center justify-between text-slate-500">
                        <div className="flex space-x-4 md:space-x-8">
                            <div className={'flex gap-1 items-baseline'}>
                                <span>Vote</span>
                                <span>{question.upvote - question.downvote}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}