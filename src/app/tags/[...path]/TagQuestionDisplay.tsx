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
        <div className="border-b border-[var(--border-color)] p-3 flex flex-col md:flex-row gap-3">
            <div className="flex md:flex-col justify-start gap-4 md:gap-2 md:w-20 text-center md:text-left text-xs">
                <div className="flex flex-col">
                    <span className="font-semibold text-sm text-[var(--text-primary)]">{question.score}</span>
                    <span className="text-[var(--text-secondary)]">votes</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm text-[var(--text-primary)]">{question.answerCount}</span>
                    <span className="text-[var(--text-secondary)]">answers</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm text-[var(--text-primary)]">{question.viewCount}</span>
                    <span className="text-[var(--text-secondary)]">views</span>
                </div>
            </div>

            <div className="flex-1 min-w-0 space-y-2">
                <Link href={toQuestionPage(question.id, question.slug)}
                    className="block text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-darker)] line-clamp-2">
                    {question.title}
                </Link>

                <div className="text-xs text-[var(--text-secondary)] line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: question.content }}>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {question.tags.map(tag => (
                        <TagLabel key={tag.id} name={tag.name} description={tag.description} />
                    ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                    <div className="text-[var(--text-secondary)]">
                        Asked by {question.author.username}
                        <span className="mx-1.5">•</span>
                        {timeFromNow(question.createdAt)}
                    </div>
                    <QuestionStatusBar {...question} />
                </div>
            </div>
        </div>
    );
};

export default QuestionDisplay;