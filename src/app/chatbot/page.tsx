'use client'

import {ArrowUpward} from "@mui/icons-material";
import React, {FormEvent, useEffect, useRef, useState} from "react";
import StopIcon from '@mui/icons-material/Stop';
import {backendURL} from "@/utilities/Constants";
import getAuth from "@/helpers/auth-utils";
import Message from "@/components/Message";
import {refreshToken} from "@/helpers/request-utils";
import {Checkbox} from "@mui/material";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import {LightTooltip} from "@/components/LightToolTip";
import notifyError from "@/utilities/ToastrExtensions";

export interface ChatMessage {
    content: string;
    thought?: string;
    role: "assistant" | "user";
}

export default function ChatBotPage() {
    const auth = getAuth();
    const [isReasoning, setIsReasoning] = useState<boolean>(false);
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [messageInput, setMessageInput] = useState<string>("");
    const [currentThinking, setCurrentThinking] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(
        [{
            content: "Hello im your assistant, how can I help you?",
            role: "assistant"
        }]);
    const bottomOfChatRef = useRef<HTMLDivElement>(null)
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const abortControllerRef = useRef(new AbortController());

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsReasoning(event.target.checked);
    };
    const handleAbort = () => {
        // abortControllerRef.current.abort();
        // setIsProcessing(false);
        // abortControllerRef.current = new AbortController();

        notifyError("This feature is not yet implemented");
    };

    const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const userMessage = messageInput.trim();
        if (!userMessage) return;

        setChatMessages([...chatMessages, {content: userMessage, role: "user"}]);
        setMessageInput("");
        setIsProcessing(true);

        try {
            const response = await sendChat(userMessage);

            if (!response.ok && response.status == 401) {
                refreshToken(auth!);
                window.location.reload();
            }

            await renderChatStream(response, userMessage);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const sendChat = (userMessage: string) => fetch(`${backendURL}/api/ai/chat?isReasoning=${isReasoning}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth?.accessToken}`
        },
        body: JSON.stringify({
            messages: chatMessages,
            newMessage: userMessage
        }),
        signal: abortControllerRef.current.signal
    });

    const renderThinkingStream = async (reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>) => {
        const decoder = new TextDecoder();
        let resultContent = '';

        while (reader) {
            try {
                const {value, done} = await reader.read();
                if (done) break;

                const char = decoder.decode(value, {stream: true});

                if (char === "</think>") break;

                setCurrentThinking((prev) => {
                    resultContent = prev + char;
                    return resultContent;
                });
            } catch {
                return resultContent;
            }
        }

        return resultContent;
    }

    const renderChatStream = async (response: Response, userMessage: string) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let resultContent = '';
        let thinkingContent = '';

        while (reader) {
            try {
                const {value, done} = await reader.read();
                if (done) break;

                const char = decoder.decode(value, {stream: true});

                if (char === "<think>") {
                    thinkingContent = await renderThinkingStream(reader);
                    continue;
                }

                setCurrentMessage((prev) => {
                    resultContent = prev + char;
                    return resultContent;
                });
            } catch {
                setIsProcessing(false);
            }
        }

        setChatMessages([...chatMessages, {content: userMessage, role: "user"}, {
            content: resultContent,
            thought: thinkingContent,
            role: "assistant"
        }]);

        setCurrentMessage('')
        setCurrentThinking('')
    }

    useEffect(() => {
        if (bottomOfChatRef.current) {
            bottomOfChatRef.current.scrollIntoView({behavior: 'smooth'})
        }
    }, [chatMessages, currentMessage]);

    return (
        <div className={'grid grid-cols-12'}>
            <div
                className="min-h-[calc(100vh-var(--appbar-height)-var(--appbar-height))] flex flex-col col-span-full md:col-span-full">
                <div className="bg-white rounded-lg flex flex-col p-4 flex-grow">
                    <div className="flex items-center mb-4">
                        <div className="ml-3">
                            <p className="text-xl font-medium">Assistant</p>
                        </div>
                    </div>

                    <div className="space-y-4 flex-grow overflow-y-auto px-2 md:max-h-[650px]">
                        {chatMessages.map((message, index) => (
                            <Message {...message} key={index}/>
                        ))}

                        {(currentMessage || currentThinking) &&
                            <Message thought={currentThinking} content={currentMessage} role={"assistant"}/>}
                    </div>

                    <form onSubmit={handleSendMessage}
                          className="flex items-center mt-5 z-20 space-x-3">
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

                        <LightTooltip placement={'top'} title={'Thinking before responding'}>
                            <Checkbox icon={<LightbulbOutlinedIcon/>}
                                      checkedIcon={<LightbulbIcon/>}
                                      value={isReasoning}
                                      onChange={handleChange}
                                      disabled={isProcessing}
                                      sx={{'& .MuiSvgIcon-root': {fontSize: 24}}}/>
                        </LightTooltip>

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