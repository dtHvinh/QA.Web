import {YourQuestionItemSkeleton} from "@/components/YourQuestionItem";

export default function YQPSkeleton() {
    return (
        <div className={'grid grid-cols-2 gap-5'}>
            {[...Array(6)].map((number, index) => (
                <YourQuestionItemSkeleton key={index}/>
            ))}
        </div>
    );
}