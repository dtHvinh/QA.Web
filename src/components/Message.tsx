import {AutoAwesome} from "@mui/icons-material";
import {ChatMessage} from "@/app/chatbot/page";
import {Markdown} from "./Markdown/Markdown";
import {useEffect, useRef} from "react";

export default function Message(message: ChatMessage) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current)
            bottomRef.current.scrollIntoView({behavior: "smooth"});
    }, [message.thought]);

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
                        {message.thought &&
                            <details open={true} className={'mb-4 text-gray-400'}>
                                <summary className={'cursor-pointer text-sm mb-2'}>Thought</summary>
                                <Markdown className={'text-section think'}>{message.thought}</Markdown>
                            </details>
                        }
                    </div>

                    <Markdown className={'text-section'}>{message.content}</Markdown>
                    <div ref={bottomRef}></div>
                </div>
            </div>
        </div>
    );
}