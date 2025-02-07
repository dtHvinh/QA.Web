import timeFromNow, {DEFAULT_TIME} from "@/helpers/time-utils";
import React, {memo} from "react";
import {formatNumber} from "@/helpers/evaluate-utils";
import QuestionStatusBar from "@/app/question/QuestionStatusBar";

interface QuestionHeaderDetailsProps {
    createdAt: string,
    updatedAt: string,
    viewCount: number,
    answerCount: number,
    isSolved: boolean,
    isClosed: boolean,
    isDraft: boolean
}

const QuestionHeaderDetails = memo(
    function QuestionHeaderDetails(
        {
            createdAt,
            updatedAt,
            viewCount,
            answerCount,
            isSolved,
            isClosed,
            isDraft
        }: QuestionHeaderDetailsProps) {

        return (
            <div className={'flex flex-col space-y-1 text-gray-400'}>
                <div></div>
                <div className={'flex flex-wrap gap-4'}>
                    <div>Asked : <span className={'text-gray-700'}>{timeFromNow(createdAt)}</span></div>
                    {updatedAt !== DEFAULT_TIME ?
                        <div>
                            Modified : <span className={'text-gray-700'}>{timeFromNow(updatedAt)}</span>
                        </div> : ''
                    }
                    <div>
                        Views: <span className={'text-gray-700'}>{formatNumber(viewCount)}</span>
                    </div>
                    <div>
                        Answers: <span className={'text-gray-700'}>{answerCount}</span>
                    </div>
                </div>
                <div>
                    <QuestionStatusBar isClosed={isClosed} isDraft={isDraft} isSolved={isSolved}/>
                </div>
            </div>
        );
    });

export default QuestionHeaderDetails;
