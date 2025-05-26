'use client'

import Answer from "@/app/question/Answer";
import TextEditor from "@/components/Editors/TextEditor";
import getAuth from "@/helpers/auth-utils";
import { IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import { formatString } from "@/helpers/string-utils";
import { AnswerResponse, QuestionResponse } from "@/types/types";
import { Apis, backendURL } from "@/utilities/Constants";
import { QuestionAnswerOutlined } from "@mui/icons-material";
import React from "react";

export default function AnswerSection(
    {
        ref,
        question,
        isClosed,
        onAnswerAcceptAction,
    }: {
        ref?: React.RefObject<HTMLDivElement | null>,
        question: QuestionResponse,
        isClosed: boolean,
        onAnswerAcceptAction: (answerId: string) => void
    }) {
    const [currentText, setCurrentText] = React.useState('');
    const [answers, setAnswers] = React.useState(question.answers ?? []);
    const [resetContentFlag, setResetContentFlag] = React.useState(false);
    const [isQuestionSolved, setIsQuestionSolved] = React.useState(question.isSolved);
    const requestUrl = formatString(`${backendURL}${Apis.Question.CreateAnswer}`, question.id);
    const auth = getAuth();

    const handleTextChange = (text: string) => {
        setCurrentText(text);
    }

    const handleSend = async () => {
        const response = await postFetcher(
            requestUrl,
            JSON.stringify({
                content: currentText
            }));

        if (!IsErrorResponse(response)) {
            setAnswers([...answers, response as AnswerResponse]);
            question.answerCount++;
            setResetContentFlag(!resetContentFlag);
        }
    }

    const handleAnswerAccepted = (answerId: string) => {
        setIsQuestionSolved(true);
        onAnswerAcceptAction?.(answerId);
    }

    const handleAnswerDelete = (answerId: string) => {
        setAnswers(answers.filter(answer => answer.id !== answerId));
        question.answerCount--;
    }

    return (
        <div ref={ref} className="p-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-[var(--text-primary)]">
                    <QuestionAnswerOutlined />
                    <span className="text-xl font-medium">Answers</span>
                    <span className="text-sm text-[var(--text-secondary)] font-normal">({question.answerCount})</span>
                </div>
            </div>

            {question.answerCount === 0 && (
                <div className="text-center py-8">
                    <div className="text-[var(--text-tertiary)] mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" className="mx-auto mb-3">
                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                        </svg>
                    </div>
                    <p className="text-[var(--text-secondary)]">No answers yet. Be the first one to answer!</p>
                </div>
            )}

            <div className="space-y-6">
                {answers.map(answer => (
                    <Answer
                        key={answer.id}
                        answer={answer}
                        question={question}
                        isQuestionSolved={isQuestionSolved}
                        onAnswerDelete={handleAnswerDelete}
                        onAnswerAccepted={handleAnswerAccepted}
                    />
                ))}
            </div>

            {!isClosed && (
                <div className="space-y-4 rounded-lg">
                    <h3 className="font-medium text-[var(--text-primary)]">Your Answer</h3>
                    <TextEditor
                        currentText={currentText}
                        onTextChange={handleTextChange}
                        resetFlag={resetContentFlag}
                    />
                    <div className="flex justify-end">
                        <button
                            onClick={handleSend}
                            disabled={currentText.length === 0}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-darker)] disabled:bg-[var(--disabled-background)] disabled:text-[var(--text-tertiary)] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                            </svg>
                            Post Your Answer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}