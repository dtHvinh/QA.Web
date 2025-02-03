import timeFromNow, {DEFAULT_TIME} from "@/helpers/time-utils";
import React, {memo} from "react";
import {QuestionResponse} from "@/types/types";
import {formatNumber} from "@/helpers/evaluate-utils";
import SolvedLabel from "@/app/question/SolvedLabel";
import ClosedLabel from "@/app/question/ClosedLabel";
import DraftLabel from "@/app/question/DraftLabel";

const QuestionHeaderDetails = memo(function QuestionHeaderDetails({question}: { question: QuestionResponse }) {
    return (
        <div className={'flex flex-col space-y-1 text-gray-400'}>
            <div></div>
            <div className={'flex flex-wrap gap-4'}>
                <div>Asked at: <span className={'text-gray-700'}>{timeFromNow(question.createdAt)}</span></div>
                {question.updatedAt !== DEFAULT_TIME ?
                    <div>
                        Modified at: <span className={'text-gray-700'}>{timeFromNow(question.updatedAt)}</span>
                    </div> : ''
                }
                <div>
                    Views: <span className={'text-gray-700'}>{formatNumber(question.viewCount)}</span>
                </div>
                <div>
                    Answers: <span className={'text-gray-700'}>{question.answerCount}</span>
                </div>
            </div>
            <div className={'flex gap-2'}>
                {question.isSolved &&
                    <SolvedLabel/>
                }

                {question.isClosed &&
                    <ClosedLabel/>
                }

                {question.isDraft &&
                    <DraftLabel/>
                }
            </div>
        </div>
    );
});

export default QuestionHeaderDetails;
