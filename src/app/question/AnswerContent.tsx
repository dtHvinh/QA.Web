import React, {memo} from "react";

const AnswerContent = memo(function AnswerContent({content}: { content: string }) {
    return (
        <div className={'min-h-28 text-editor-display'}>
            <div className="tiptap"
                 dangerouslySetInnerHTML={{__html: content as TrustedHTML}}></div>
        </div>
    )
});

export default AnswerContent;