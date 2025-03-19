import { ChatMessageResponse } from "@/app/community/[name]/page";
import getAuth from "@/helpers/auth-utils";
import timeFromNow from "@/helpers/time-utils";
import { Send } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { FormEvent, useEffect, useRef, useState } from "react";

interface ChatRoomProps {
    messageInit?: ChatMessageResponse[];
}

export default function ChatRoom({ messageInit = [] }: ChatRoomProps) {
    const auth = getAuth();
    const [messages, setMessages] = useState<ChatMessageResponse[]>(messageInit);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Add message sending logic here
        // For now, let's just add a mock message
        const mockMessage: ChatMessageResponse = {
            id: Math.random(),
            message: newMessage,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: {
                id: '0',
                username: auth?.username || 'User',
                profilePicture: auth?.profilePicture || '',
                reputation: 1000
            }
        };

        setMessages([...messages, mockMessage]);
        setNewMessage("");
    };

    return (
        <div className="flex flex-col h-[705px] bg-[var(--card-background)] rounded-xl border border-[var(--border-color)] shadow-lg overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
                        messages.map((msg, index) => {
                            const isCurrentUser = msg.user.id === 20;
                            const showAvatar = index === 0 || messages[index - 1].user.id !== msg.user.id;

                            return (
                                <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                                    <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%] gap-3`}>
                                        {!isCurrentUser && showAvatar && (
                                            <Avatar
                                                src={msg.user.profilePicture}
                                                alt={msg.user.username}
                                                sx={{
                                                    width: 38,
                                                    height: 38,
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                        )}
                                        {!isCurrentUser && !showAvatar && <div className="w-[38px]"></div>}

                                        <div className="flex flex-col">
                                            {showAvatar && (
                                                <div className={`text-sm font-medium mb-1.5 ${isCurrentUser ? 'text-right' : 'text-left'} 
                                                    text-[var(--text-secondary)]`}>
                                                    {isCurrentUser ? 'You' : msg.user.username}
                                                </div>
                                            )}
                                            <div className={`rounded-2xl px-5 py-2.5 shadow-sm
                                                ${isCurrentUser
                                                    ? 'bg-[var(--primary)] text-white rounded-tr-md'
                                                    : 'bg-[var(--hover-background)] text-[var(--text-primary)] rounded-tl-md'
                                                }`}>
                                                <p className="whitespace-pre-wrap break-words text-[15px]">{msg.message}</p>
                                            </div>
                                            <div className={`text-xs text-[var(--text-tertiary)] mt-1.5 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                                                {timeFromNow(msg.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div id="22" ref={messagesEndRef} />
                </div>
            </div>

            <form onSubmit={handleSubmit}
                className="border-t border-[var(--border-color)] p-4 bg-[var(--card-background)] shadow-lg">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full px-5 py-3 rounded-2xl border border-[var(--border-color)] 
                            bg-[var(--hover-background)] text-[var(--text-primary)] 
                            placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 
                            focus:ring-[var(--primary-light)] focus:border-transparent
                            pr-12 transition-all text-[15px]"
                    />
                    <IconButton
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-2 p-2
                            text-white bg-[var(--primary)] hover:bg-[var(--primary-darker)]
                            disabled:bg-[var(--disabled-background)] disabled:text-[var(--text-tertiary)]
                            transition-all rounded-xl shadow-md"
                        size="medium"
                    >
                        <Send />
                    </IconButton>
                </div>
            </form>
        </div>
    );
}