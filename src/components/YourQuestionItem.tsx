import QuestionStatusBar from "@/app/question/QuestionStatusBar";
import TagLabel from "@/components/TagLabel";
import { formatNumber } from "@/helpers/evaluate-utils";
import toQuestionDetail from "@/helpers/path";
import timeFromNow from "@/helpers/time-utils";
import { QuestionResponse } from "@/types/types";
import Link from "next/link";
import UserInfoPopup from "./UserInfoPopup";

interface YourQuestionItemProps {
    question: QuestionResponse,
    showAuthor?: boolean,
}

export default function YourQuestionItem({ question, showAuthor = true }: Readonly<YourQuestionItemProps>) {
    return (
        <div className="bg-white rounded-lg border border-gray-100 hover:border-blue-500 hover:shadow-sm transition-all p-4">
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <Link href={toQuestionDetail(question.id, question.slug)}
                        className="text-base font-semibold text-gray-800 hover:text-blue-600 transition-colors flex-grow">
                        {question.title}
                    </Link>
                    <QuestionStatusBar {...question} />
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {question.tags?.map(tag =>
                        <TagLabel
                            key={tag.id}
                            name={tag.name}
                            description={tag.description}
                            onClick={console.log}
                        />
                    )}
                </div>

                <p dangerouslySetInnerHTML={{ __html: question.content }}
                    className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                </p>

                <div className="flex items-center justify-between pt-2 text-sm">
                    <div className="flex gap-4">
                        <span className="text-gray-600">
                            <span className="font-medium">{question.score}</span> votes
                        </span>
                        <span className="text-gray-600">
                            <span className="font-medium">{formatNumber(question.viewCount)}</span> views
                        </span>
                        <span className={question.isSolved
                            ? 'text-green-600'
                            : 'text-gray-600'
                        }>
                            <span className="font-medium">{formatNumber(question.answerCount)}</span> answers
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-500">
                        {showAuthor && <UserInfoPopup user={question.author} />}
                        <span className="text-xs">
                            asked {timeFromNow(question.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
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