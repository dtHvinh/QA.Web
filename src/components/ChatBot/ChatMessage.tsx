import React, { memo } from "react";
import Markdown from "react-markdown";

interface ChatMessageProps {
    role: 'assistant' | 'user';
    content: string;
    thought?: string;
    thoughtInSeconds?: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, thought, thoughtInSeconds }) => {
    const isAssistant = role === "assistant";

    return (
        <div className={`flex gap-3 my-4 text-gray-600 text-sm flex-1 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
            <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                <div className="rounded-full bg-gray-100 border p-1">
                    <svg stroke="none" fill="black" strokeWidth={isAssistant ? "1.5" : "0"}
                        viewBox={isAssistant ? "0 0 24 24" : "0 0 16 16"} height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d={isAssistant ?
                                "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                                :
                                "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"} />
                    </svg>
                </div>
            </span>
            <div className="leading-relaxed">
                <span className="block font-bold text-gray-700">{role === "assistant" ? "AI" : "You"} </span>
                {thought && (
                    <details open={true} className={'mb-4 text-gray-400'}>
                        <summary className={'cursor-pointer text-sm mb-2'}> {thoughtInSeconds ? `Thought in ${thoughtInSeconds.toFixed(2)} seconds` : 'Thinking...'}</summary>
                        <Markdown className={'code-section think'}>{thought}</Markdown>
                    </details>
                )}
                <Markdown className={'code-section'}>{content}</Markdown>
            </div>
        </div>
    );
};

export default memo(ChatMessage);