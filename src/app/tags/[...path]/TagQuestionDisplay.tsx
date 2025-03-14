import QuestionStatusBar from "@/app/question/QuestionStatusBar";
import TagLabel from "@/components/TagLabel";
import { toQuestionPage } from '@/helpers/route-utils';
import timeFromNow from "@/helpers/time-utils";
import { QuestionResponse } from '@/types/types';
import Link from 'next/link';
import React from 'react';

interface QuestionDisplayProps {
    question: QuestionResponse;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
    return (
        <div className="border-b border-[var(--border-color)] p-4 flex flex-col md:flex-row">
            <div className="flex-shrink-0 flex flex-col items-center md:items-start md:w-24">
                <div className="text-center md:text-left">
                    <span className="block font-bold text-[var(--text-primary)]">{question.score}</span>
                    <span className="text-sm text-[var(--text-secondary)]">votes</span>
                </div>
                <div className="text-center md:text-left mt-2">
                    <span className="block font-bold text-[var(--text-primary)]">{question.answerCount}</span>
                    <span className="text-sm text-[var(--text-secondary)]">answers</span>
                </div>
                <div className="text-center md:text-left mt-2">
                    <span className="block font-bold text-[var(--text-primary)]">{question.viewCount}</span>
                    <span className="text-sm text-[var(--text-secondary)]">views</span>
                </div>
            </div>
            <div className="flex-grow md:ml-4 mt-4 md:mt-0">
                <Link href={toQuestionPage(question.id, question.slug)}>
                    <div className="text-xl font-semibold text-blue-500 hover:underline">{question.title}</div>
                </Link>
                <div className="mt-2 text-[var(--text-secondary)] line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: question.content }}></div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {question.tags.map(tag => (
                        <TagLabel key={tag.id} name={tag.name} description={tag.description} />
                    ))}
                </div>
                <div className="mt-2 text-sm text-[var(--text-secondary)]">
                    <span>Asked by {question.author.username}</span>
                    <span className="ml-2">{timeFromNow(question.createdAt)}</span>
                </div>
                <QuestionStatusBar className={'mt-2'} {...question} />
            </div>
        </div>
    );
};

export default QuestionDisplay;