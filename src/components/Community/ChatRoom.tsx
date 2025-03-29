import getAuth from "@/helpers/auth-utils";
import { formPostFetcher } from "@/helpers/request-utils";
import { ChatMessageResponse } from "@/types/types";
import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatRoomMessage from "./ChatRoomMessage";

interface ChatRoomProps {
    messageInit?: ChatMessageResponse[];
    chatRoomId: string;
}

export default function ChatRoom({ chatRoomId, messageInit = [], onBack }: ChatRoomProps & { onBack?: () => void }) {
    const auth = getAuth();
    const [messages, setMessages] = useState<ChatMessageResponse[]>(messageInit);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (message: string, files: File[]) => {
        var formData = new FormData();

        formData.append('message', message);
        formData.append('chatRoomId', chatRoomId);
        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

        const res = await formPostFetcher('/api/community/room/chat', formData);
    };

    const renderMessage = useMemo(() => {
        return messages.map((msg, index) => {
            const isCurrentUser = msg.author.id === 20;
            const isNewGroup = index === 0 || messages[index - 1].author.id !== msg.author.id;

            return (
                <div key={msg.id} className={isNewGroup ? "mt-4" : "mt-0"}>
                    <ChatRoomMessage
                        message={msg}
                        isCurrentUser={isCurrentUser}
                        showAvatar={true}
                    />
                </div>
            );
        });
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-[var(--card-background)] rounded-xl border border-[var(--border-color)] overflow-hidden">
            <div className="px-4 py-1 border-b border-[var(--border-color)] flex items-center">
                <IconButton
                    onClick={onBack}
                    className="mr-2 text-[var(--text-secondary)] hover:bg-[var(--hover-background)]"
                    size="small"
                >
                    <ArrowBack className="text-[var(--text-secondary)]" fontSize="small" />
                </IconButton>
                <span className="text-[var(--text-primary)] text-sm font-medium">Back to community</span>
            </div>

            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-[var(--text-tertiary)]">
                            <svg className="w-20 h-20 mb-6 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-xl font-semibold mb-2">No messages yet</p>
                            <p className="text-sm opacity-75">Be the first to start the conversation!</p>
                        </div>
                    ) : (
                        renderMessage
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <ChatInput onSubmit={handleSubmit} />
        </div>
    );
}