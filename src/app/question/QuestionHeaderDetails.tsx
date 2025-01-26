import timeFromNow, {DEFAULT_TIME} from "@/helpers/time-utils";
import React, {memo} from "react";
import {QuestionResponse} from "@/types/types";
import {formatNumber} from "@/helpers/evaluate-utils";
import SolvedLabel from "@/app/question/SolvedLabel";
import ClosedLabel from "@/app/question/ClosedLabel";

const QuestionHeaderDetails = memo(function QuestionHeaderDetails({question}: { question: QuestionResponse }) {
    return (
        <div className={'flex flex-col space-y-1 text-gray-500'}>
            <div></div>
            <div className={'flex flex-wrap gap-4'}>
                <div>Asked at: {timeFromNow(question.createdAt)}</div>
                {question.updatedAt !== DEFAULT_TIME ?
                    <div>
                        Modified at: {timeFromNow(question.updatedAt)}
                    </div> : ''
                }
                <div>
                    Views: {formatNumber(question.viewCount)}
                </div>
                <div>
                    Answers: {question.answerCount}
                </div>
            </div>
            <div className={'flex gap-2'}>
                {question.isSolved &&
                    <SolvedLabel/>
                }

                {question.isClosed &&
                    <ClosedLabel/>
                }
            </div>
        </div>
    );
});

export default QuestionHeaderDetails;
