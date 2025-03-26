import QuestionStatusBar from "@/app/question/QuestionStatusBar";
import { formatNumber } from "@/helpers/evaluate-utils";
import timeFromNow, { DEFAULT_TIME } from "@/helpers/time-utils";
import { memo } from "react";

interface QuestionHeaderDetailsProps {
    createdAt: string,
    updatedAt: string,
    viewCount: number,
    answerCount: number,
    isSolved: boolean,
    isClosed: boolean,
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
        }: QuestionHeaderDetailsProps) {

        return (
            <div className={'flex flex-col text-sm text-[var(--text-tertiary)]'}>
                <div></div>
                <div className={'flex flex-wrap gap-2'}>
                    <div>Asked : <span className={'text-[var(--text-secondary)] font-bold'}>{timeFromNow(createdAt)}</span></div>
                    {updatedAt !== DEFAULT_TIME ?
                        <div>
                            Modified : <span className={'text-[var(--text-secondary)] font-bold'}>{timeFromNow(updatedAt)}</span>
                        </div> : ''
                    }
                    <div>
                        Views: <span className={'text-[var(--text-secondary)] font-bold'}>{formatNumber(viewCount)}</span>
                    </div>
                    <div>
                        Answers: <span className={'text-[var(--text-secondary)] font-bold'}>{answerCount}</span>
                    </div>
                </div>
                <div>
                    <QuestionStatusBar isClosed={isClosed} isSolved={isSolved} />
                </div>
            </div>
        );
    });

export default QuestionHeaderDetails;
