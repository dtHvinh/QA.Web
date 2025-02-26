import { YourQuestionItemSkeleton } from "@/components/YourQuestionItem";

export default function QuestionCardListSkeleton() {
    return (
        <div className={'grid grid-cols-1 gap-5'}>
            {[...Array(6)].map((number, index) => (
                <YourQuestionItemSkeleton key={index} />
            ))}
        </div>
    );
}