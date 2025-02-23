import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/app/chatbot/page";
import getAuth from "./auth-utils";

export function useStreamingChat(sendUrl: string, initialMessages?: ChatMessage[]) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages || []);
    const [currentMessage, setCurrentMessage] = useState("");
    const [thinking, setThinking] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const abortControllerRef = useRef(new AbortController());
    const auth = getAuth();

    const handleSendMessage = async (userMessage: string) => {
        if (!userMessage.trim()) return;
        const userEntry: ChatMessage = { role: "user", content: userMessage };
        setMessages((prev) => [...prev, userEntry]);
        setIsProcessing(true);
        setCurrentMessage("");
        setThinking("");

        try {
            const response = await fetch(sendUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth?.accessToken}`,
                },
                body: JSON.stringify({ newMessage: userMessage, messages }),
                signal: abortControllerRef.current.signal,
            });
            if (!response.ok) throw new Error("Request failed");
            await streamResponse(response, userEntry);
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
        }
    };

    const handleAbort = () => {
        abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        setIsProcessing(false);
    };

    const streamResponse = async (response: Response, userEntry: ChatMessage) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let combined = "";
        let combinedThought = "";

        while (reader) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            if (chunk.includes("<think>")) {
                combinedThought = await streamThinking(reader);
            } else {
                combined += chunk;
                setCurrentMessage(combined);
            }
        }
        setMessages((prev) => [
            ...prev,
            { role: "assistant", content: combined, thought: combinedThought },
        ]);
        setCurrentMessage("");
        setThinking("");
        setIsProcessing(false);
    };

    const streamThinking = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
        const decoder = new TextDecoder();
        let result = "";
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            if (chunk.includes("</think>")) break;
            result += chunk;
            setThinking(result);
        }
        return result;
    };

    return {
        messages,
        currentMessage,
        thinking,
        isProcessing,
        handleSendMessage,
        handleAbort,
    };
}