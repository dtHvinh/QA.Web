'use client'

import getAuth from "@/helpers/auth-utils";
import { AuthorResponse } from "@/types/types";
import { Send } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { FormEvent, useState } from "react";

interface ChatMessageResponse {
    id: number | string;
    message: string;
    createdAt: string;
    updatedAt: string;
    user: AuthorResponse;
}

export default function ChatRoom({ messageInit }: { messageInit?: ChatMessageResponse[] }) {
    const auth = getAuth();
    const [message, setMessage] = useState('');

    const [messages, setMessages] = useState<ChatMessageResponse[]>(messageInit ?? []);

    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (message.trim()) {
            const newMessage: ChatMessageResponse = {
                id: messages.length + 1,
                message: message,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                user: {
                    id: 0,
                    username: auth?.username || '',
                    profilePicture: 'a',
                    reputation: 3000,
                }
            };

            setMessages([...messages, newMessage]);
            setMessage('');
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.user.username === auth?.username ? 'flex-row-reverse' : ''}`}>
                        <Avatar sx={{ width: 32, height: 32 }}>{msg.user.username[0].toUpperCase()}</Avatar>
                        <div className={`flex flex-col ${msg.user.username === auth?.username ? 'items-end' : ''}`}>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-[var(--text-primary)]">{msg.user.username}</span>
                                <span className="text-xs text-[var(--text-tertiary)]">
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className={`mt-1 px-4 py-2 rounded-2xl max-w-xl ${msg.user.username === auth?.username
                                ? 'bg-[var(--primary)] text-white rounded-tr-none'
                                : 'bg-[var(--chat-message-bg)] text-black rounded-tl-none'
                                }`}>
                                {msg.message}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-full bg-[var(--input-background)] border border-[var(--border-color)] focus:border-[var(--primary)] transition-colors"
                    />
                    <button
                        className="p-2 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-darker)] transition-colors"
                    >
                        <Send />
                    </button>
                </div>
            </form>
        </div>
    );
}