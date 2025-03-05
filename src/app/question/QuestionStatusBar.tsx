import ClosedLabel from "@/components/StatusLabels/ClosedLabel";
import SolvedLabel from "@/components/StatusLabels/SolvedLabel";

export default function QuestionStatusBar({ className, isClosed, isSolved }: {
    className?: string,
    isClosed: boolean,
    isSolved: boolean
}) {
    return (
        <div className={`${className} flex gap-2`}>
            {isSolved &&
                <SolvedLabel />
            }

            {isClosed &&
                <ClosedLabel />
            }
        </div>
    );
}
