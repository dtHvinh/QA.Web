'use client'

import {ArrowUpward, AutoAwesome} from "@mui/icons-material";
import {FormEvent, useState} from "react";
import StopIcon from '@mui/icons-material/Stop';
import {backendURL} from "@/utilities/Constants";
import getAuth from "@/helpers/auth-utils";

interface ChatMessage {
    content: string;
    role: "assistant" | "user";
}

export default function ChatBotPage() {
    const auth = getAuth();
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [messageInput, setMessageInput] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([{
        content: "Hello im your assistant, how can I help you?",
        role: "assistant"
    }]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const abortController = new AbortController();

    const handleAbort = () => {
        abortController.abort();
        setIsProcessing(false);
    }

    const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const userMessage = messageInput.trim();
        if (!userMessage) return;

        setChatMessages([...chatMessages, {content: userMessage, role: "user"}]);
        setMessageInput("");
        setIsProcessing(true);

        try {
            const response = await fetch(`${backendURL}/api/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth?.accessToken}`
                },
                body: JSON.stringify({
                    messages: chatMessages,
                    newMessage: userMessage
                }),
                signal: abortController.signal
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = "";

            while (reader) {
                const {value, done} = await reader.read();
                if (done) break;

                assistantMessage += decoder.decode(value, {stream: true});

                setChatMessages([...chatMessages, {content: userMessage, role: "user"}, {
                    content: assistantMessage,
                    role: "assistant"
                }]);
            }

        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={'grid grid-cols-10'}>
            <div
                className="min-h-[calc(100vh-var(--appbar-height)-var(--appbar-height))] flex flex-col col-span-full md:col-span-8">
                <div className="bg-white rounded-lg flex flex-col p-4 flex-grow">
                    <div className="flex items-center mb-4">
                        <div className="ml-3">
                            <p className="text-xl font-medium">Assistant</p>
                        </div>
                    </div>

                    <div className="space-y-4 flex-grow overflow-y-auto px-2 max-h-[85%]">
                        {chatMessages.map((message, index) => (
                            <div key={index}
                                 className={`flex items-baseline ${message.role === 'user' ? 'justify-end' : ''}`}>
                                {message.role === 'assistant' &&
                                    <div className={'p-1'}>
                                        <AutoAwesome/>
                                    </div>}
                                <div
                                    className={`ml-3 p-3 rounded-lg  max-w-[75%] ${message.role === 'assistant' ? 'bg-gray-100 text-gray-800' : 'bg-blue-500 text-white'}`}>
                                    <div
                                        className={'text-sm break-words code-section'}
                                        dangerouslySetInnerHTML={{__html: message.content}}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage}
                          className="flex items-center mt-5 z-20">
                        <input
                            spellCheck={false}
                            autoComplete={"off"}
                            name={"message"}
                            type="text"
                            value={messageInput}
                            onChange={(event) => setMessageInput(event.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 py-3 px-5 rounded-full bg-gray-100 focus:outline-none transition-all"
                            disabled={isProcessing}
                        />
                        {!isProcessing ?
                            <button type={"submit"}
                                    className="bg-blue-500 text-white p-2 rounded-full ml-3 hover:bg-blue-600"
                            >
                                <ArrowUpward/>
                            </button>
                            :
                            <button type={"button"}
                                    className="bg-blue-500 text-white p-2 rounded-full ml-3 hover:bg-blue-600"
                                    onClick={handleAbort}>
                                <StopIcon/>
                            </button>
                        }
                    </form>
                </div>
            </div>
        </div>

    );
}