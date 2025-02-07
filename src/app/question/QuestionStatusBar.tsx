import SolvedLabel from "@/app/question/SolvedLabel";
import ClosedLabel from "@/app/question/ClosedLabel";
import DraftLabel from "@/app/question/DraftLabel";
import React from "react";

export default function QuestionStatusBar({className, isClosed, isDraft, isSolved}: {
    className?: string,
    isClosed: boolean,
    isDraft: boolean,
    isSolved: boolean
}) {
    return (
        <div className={`${className} flex gap-2`}>
            {isSolved &&
                <SolvedLabel/>
            }

            {isClosed &&
                <ClosedLabel/>
            }

            {isDraft &&
                <DraftLabel/>
            }
        </div>
    );
}
