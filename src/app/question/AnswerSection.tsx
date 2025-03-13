'use client'

import Answer from "@/app/question/Answer";
import TextEditor from "@/components/TextEditor";
import getAuth from "@/helpers/auth-utils";
import { IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import { formatString } from "@/helpers/string-utils";
import { AnswerResponse, QuestionResponse } from "@/types/types";
import { Apis, backendURL } from "@/utilities/Constants";
import React from "react";

export default function AnswerSection(
    {
        question,
        isClosed,
        onAnswerAcceptAction,
    }: {
        question: QuestionResponse,
        isClosed: boolean,
        onAnswerAcceptAction: (answerId: string) => void
    }) {
    const [currentText, setCurrentText] = React.useState('');
    const [answers, setAnswers] = React.useState(question.answers);
    const [resetContentFlag, setResetContentFlag] = React.useState(false);
    const [isQuestionSolved, setIsQuestionSolved] = React.useState(question.isSolved);
    const requestUrl = formatString(`${backendURL}${Apis.Question.CreateAnswer}`, question.id);
    const auth = getAuth();

    const handleTextChange = (text: string) => {
        setCurrentText(text);
    }

    const handleSend = async () => {
        const response = await postFetcher([
            requestUrl,
            auth!.accessToken,
            JSON.stringify({
                content: currentText
            })]);

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
        <div className="p-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                    </svg>
                    <span className="text-xl font-medium">Answers</span>
                    <span className="text-sm text-gray-500 font-normal">({question.answerCount})</span>
                </div>
            </div>

            {question.answerCount === 0 && (
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" className="mx-auto mb-3">
                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                        </svg>
                    </div>
                    <p className="text-gray-500">No answers yet. Be the first one to answer!</p>
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
                <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-gray-900">Your Answer</h3>
                    <TextEditor
                        currentText={currentText}
                        onTextChange={handleTextChange}
                        resetFlag={resetContentFlag}
                    />
                    <div className="flex justify-end">
                        <button
                            onClick={handleSend}
                            disabled={currentText.length === 0}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500 transition-colors"
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