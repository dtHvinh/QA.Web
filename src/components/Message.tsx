import {AutoAwesome} from "@mui/icons-material";
import {ChatMessage} from "@/app/chatbot/page";
import {Markdown} from "./Markdown/Markdown";
import {useEffect, useRef} from "react";

export default function Message(message: ChatMessage) {
    const bottomOfThinkingRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomOfThinkingRef.current)
            bottomOfThinkingRef.current.scrollIntoView({behavior: "smooth"});
    }, [message.thinking]);

    return (
        <div>
            <div
                className={`flex items-baseline ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' &&
                    <div className={'p-1'}>
                        <AutoAwesome/>
                    </div>}
                <div
                    className={`ml-3 p-3 rounded-lg  ${message.role === 'assistant' ? 'border-l-2 text-gray-800' : ' text-black border-r-2 '}`}>
                    <div>
                        {message.thinking &&
                            <details open={true} className={'mb-4 text-gray-400'}>
                                <summary className={'cursor-pointer text-sm mb-2'}>Thought</summary>
                                <div ref={bottomOfThinkingRef}></div>
                                <Markdown className={'text-section think'}>{message.thinking}</Markdown>
                            </details>
                        }
                    </div>

                    <Markdown className={'text-section'}>{message.content}</Markdown>
                </div>
            </div>
        </div>
    );
}