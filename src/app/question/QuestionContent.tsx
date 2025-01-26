import {memo} from "react";

const QuestionContent = memo(function QuestionContent({content}: { content: string }) {
    return (
        <div className={'text-editor-display'}>
            <div className={'p-4 tiptap'}
                 dangerouslySetInnerHTML={{__html: content}}>
            </div>
        </div>
    )
});

export default QuestionContent;