import SolvedLabel from "@/components/StatusLabels/SolvedLabel";
import ClosedLabel from "@/components/StatusLabels/ClosedLabel";
import DraftLabel from "@/components/StatusLabels/DraftLabel";
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
