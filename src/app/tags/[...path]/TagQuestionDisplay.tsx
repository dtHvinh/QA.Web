import React from 'react';
import {QuestionResponse} from '@/types/types';
import Link from 'next/link';
import {toQuestionPage} from '@/helpers/route-utils';
import timeFromNow from "@/helpers/time-utils";
import TagLabel from "@/components/TagLabel";

interface QuestionDisplayProps {
    question: QuestionResponse;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({question}) => {
    return (
        <div className="border-b p-4 flex flex-col md:flex-row">
            <div className="flex-shrink-0 flex flex-col items-center md:items-start md:w-24">
                <div className="text-center md:text-left">
                    <span className="block font-bold">{question.upvote - question.downvote}</span>
                    <span className="text-sm">votes</span>
                </div>
                <div className="text-center md:text-left mt-2">
                    <span className="block font-bold">{question.answerCount}</span>
                    <span className="text-sm">answers</span>
                </div>
                <div className="text-center md:text-left mt-2">
                    <span className="block font-bold">{question.viewCount}</span>
                    <span className="text-sm">views</span>
                </div>
            </div>
            <div className="flex-grow md:ml-4 mt-4 md:mt-0">
                <Link href={toQuestionPage(question.id, question.slug)}>
                    <div className="text-xl font-semibold text-blue-600 hover:underline">{question.title}</div>
                </Link>
                <div className="mt-2 text-gray-700 line-clamp-2"
                     dangerouslySetInnerHTML={{__html: question.content}}></div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {question.tags.map(tag => (
                        <TagLabel key={tag.id} name={tag.name} description={tag.description}/>
                    ))}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                    <span>Asked by {question.author.username}</span>
                    <span className="ml-2">{timeFromNow(question.createdAt)}</span>
                </div>
            </div>
        </div>
    );
};

export default QuestionDisplay;