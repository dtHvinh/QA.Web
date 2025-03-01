import QuestionStatusBar from "@/app/question/QuestionStatusBar";
import TagLabel from "@/components/TagLabel";
import { formatNumber } from "@/helpers/evaluate-utils";
import toQuestionDetail from "@/helpers/path";
import timeFromNow from "@/helpers/time-utils";
import { QuestionResponse } from "@/types/types";
import Link from "next/link";
import UserInfoPopup from "./UserInfoPopup";

interface YourQuestionItemProps {
    question: QuestionResponse
}

export default function YourQuestionItem(params: Readonly<YourQuestionItemProps>) {
    const { question } = params;

    return (
        <div className='flex flex-col'>
            <div className="rounded-xl p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 w-full bg-white group">
                <div className="flex w-full items-start justify-between pb-4">
                    <div className="flex flex-col gap-3">
                        <Link href={toQuestionDetail(question.id, question.slug)}
                            className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                            {question.title}
                        </Link>
                        <div className="flex items-center gap-3">
                            <QuestionStatusBar {...question} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-end flex-wrap gap-2">
                            {question.tags?.map(tag =>
                                <TagLabel key={tag.id} name={tag.name}
                                    description={tag.description} onClick={console.log} />
                            )}
                        </div>
                        <div className="flex justify-end items-center gap-2 text-sm text-gray-500">
                            <span className="font-medium">Asked</span>
                            <span>{timeFromNow(question.createdAt)}</span>
                        </div>
                    </div>
                </div>

                <div className="my-3">
                    <p dangerouslySetInnerHTML={{ __html: question.content }}
                        className="text-gray-600 line-clamp-2 leading-relaxed">
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-sm">Votes</span>
                            <span className="font-semibold">{question.upvote - question.downvote}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-sm">Views</span>
                            <span className="font-semibold">{formatNumber(question.viewCount)}</span>
                        </div>

                        <div className={`flex items-center gap-2 ${question.isSolved
                            ? 'px-3 py-1 rounded-full bg-green-100 text-green-700'
                            : 'text-gray-600'
                            }`}>
                            <span className="text-sm">Answers</span>
                            <span className="font-semibold">{formatNumber(question.answerCount)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-sm">Author</span>
                            <UserInfoPopup user={question.author} />

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