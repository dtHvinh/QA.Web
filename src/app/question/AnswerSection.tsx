'use client'

import {AnswerResponse, QuestionResponse} from "@/types/types";
import TextEditor from "@/components/TextEditor";
import React, {useEffect, useState} from "react";
import {Apis, backendURL} from "@/utilities/Constants";
import getAuth from "@/helpers/auth-utils";
import {formatString} from "@/helpers/string-utils";
import Answer from "@/app/question/Answer";
import {fetcher, IsErrorResponse} from "@/helpers/request-utils";
import {ErrorResponse} from "@/props/ErrorResponse";
import notifyError from "@/utilities/ToastrExtensions";
import FilterBar from "@/components/FilterBar";

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
    const validOrders = ['Newest', 'Most Voted'];
    const validOrdersValue = ['Newest', 'Most Viewed', 'Most Voted'];
    const [orderBy, setOrderBy] = useState<string>(validOrders[0]);

    const handleTextChange = (text: string) => {
        setCurrentText(text);
    }

    useEffect(() => {
        // TODO: Implement sorting
    }, [orderBy]);

    const handleSend = async () => {
        const response = await fetcher<AnswerResponse>([
            'POST',
            requestUrl,
            auth!.accessToken,
            JSON.stringify({
                content: currentText
            })]);
        console.log(response)
        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).title);
        } else {
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

    if (question.isDraft)
        return (
            <div>
                Edit and publish the question to see answers
            </div>
        )

    return (
        <div className={'-mx-12 md:-mx-0'}>
            <div className={'flex justify-between items-baseline'}>
                <div className={'text-xl mb-5'}>
                    Answers ({question.answerCount}):
                </div>
                <FilterBar tabs={validOrders}
                           tabValues={validOrdersValue}
                           tabDescriptions={[]}
                           onFilterValueChange={setOrderBy}/>
            </div>

            {question.answerCount == 0 &&
                <div className={'text-gray-500'}>No answers yet</div>}

            <div>
                {answers.map(answer => (
                    <Answer key={answer.id}
                            answer={answer}
                            question={question}
                            isQuestionSolved={isQuestionSolved}
                            onAnswerDelete={handleAnswerDelete}
                            onAnswerAccepted={handleAnswerAccepted}/>
                ))}
            </div>

            {!isClosed &&
                <div className={'mt-5'}>
                    <TextEditor currentText={currentText}
                                onTextChange={handleTextChange}
                                resetFlag={resetContentFlag}/>
                    <div className={'w-full text-end pr-4'}>
                        <button onClick={handleSend}
                                disabled={currentText.length == 0}
                                className={'space-x-3 disabled:bg-gray-200 transition-all p-2 bg-blue-200 rounded-b-xl hover:bg-gray-300 active:scale-95'}>
                            <div className={'inline-block mt-1'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     viewBox="0 0 16 16">
                                    <path
                                        d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                                </svg>
                            </div>

                            <span className={'inline-block'}>Send</span>
                        </button>
                    </div>
                </div>
            }
        </div>
    );
}