import Loading from "@/app/loading";
import { useSignalR } from "@/context/SignalRContext";
import getAuth, { extractId, getAuthUsername } from "@/helpers/auth-utils";
import { formPostFetcher, getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { ChatMessageResponse, PagedResponse } from "@/types/types";
import { HubConnectionState } from "@microsoft/signalr";
import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { useThrottledCallback } from "use-debounce";
import ChatInput from "./ChatInput";
import ChatRoomMessage from "./ChatRoomMessage";
import TypingIndicator from './TypingIndicator';

interface ChatRoomProps {
    chatRoomId: string;
}

export default function ChatRoom({ chatRoomId, onBack }: ChatRoomProps & { onBack?: () => void }) {
    const { data: messageInit, isLoading: isMessageLoading, mutate } = useSWR<PagedResponse<ChatMessageResponse>>(
        '/api/community/room/chat/' + chatRoomId + "?pageIndex=1&pageSize=10", getFetcher);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [typingUsers, setTypingUsers] = useState<{ username: string, userId: string }[]>([]);
    const userId = extractId(getAuth()?.accessToken!)
    const { connection, joinRoom, leaveRoom } = useSignalR();
    const [oldRoomId, setOldRoomId] = useState<number>(0);

    useEffect(() => {
        if (messagesEndRef.current && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messageInit?.items]);

    useEffect(() => {
        if (!connection) return;

        leaveRoom(oldRoomId);
        joinRoom(Number.parseInt(chatRoomId));
        setOldRoomId(Number.parseInt(chatRoomId));

        connection.on('ReceiveMessage', (message: ChatMessageResponse) => {
            if (message.author.id != Number.parseInt(userId)) {
                updateMessage(message);
            }
        });

        connection.on('SomeOneStartTyping', (username: string, userId: string) => {
            console.log('start typing', username, userId);
            throttledStartTyping(username, userId);
        })

        connection.on('SomeOneStopTyping', (username: string, userId: string) => {
            console.log('stop typing', username, userId);
            throttledStopTyping(username, userId);
        })

        return () => {
            if (!connection) return;

            connection.off('ReceiveMessage');
            connection.off('SomeOneStartTyping');
            connection.off('SomeOneStopTyping');
            leaveRoom(Number.parseInt(chatRoomId));
        }
    }, [connection, chatRoomId])

    const throttledStartTyping = useThrottledCallback(
        (username: string, userId: string) => {
            setTypingUsers(prev => {
                const exists = prev.some(user => user.userId === userId);
                if (exists) return prev;
                return [...prev, { userId, username }];
            });
        },
        300,
        { leading: true, trailing: false }
    );

    const throttledStopTyping = useThrottledCallback(
        (_: string, userId: string) => {
            setTypingUsers(prev => prev.filter(user => user.userId !== userId));
        },
        300,
        { leading: false, trailing: true }
    );

    const updateMessage = (message: ChatMessageResponse) => {
        console.log('update message', message);
        mutate(currentData => {
            if (!currentData) return currentData;
            return {
                ...currentData,
                items: [...currentData.items, message]
            };
        }, false);
    }

    const handleUserTyping = () => {
        if (!connection || connection.state !== HubConnectionState.Connected) return;
        connection.invoke('StartTyping', getAuthUsername(), userId, chatRoomId);
    }

    const handleUserStopTyping = () => {
        if (!connection || connection.state !== HubConnectionState.Connected) return;
        connection.invoke('StopTyping', getAuthUsername(), userId, chatRoomId);
    }

    const handleSubmit = async (message: string, files: File[]) => {
        if (!message.trim() && files.length === 0) return;

        var formData = new FormData();

        formData.append('message', message);
        formData.append('chatRoomId', chatRoomId);
        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

        const res = await formPostFetcher('/api/community/room/chat', formData);

        if (!IsErrorResponse(res)) {
            if (messageInit) {
                mutate({
                    ...messageInit,
                    items: [...messageInit.items, res as ChatMessageResponse]
                }, false);
            }
        }
    };

    const renderMessage = useMemo(() => messageInit ? messageInit.items.map((msg, index) => {
        const isCurrentUser = msg.author.id === userId;
        const isNewGroup = index === 0 || messageInit.items[index - 1].author.id !== msg.author.id;

        return (
            <div key={msg.id} className={isNewGroup ? "mt-4" : "mt-0"}>
                <ChatRoomMessage
                    message={msg}
                    isCurrentUser={isCurrentUser}
                    showAvatar={true}
                />
            </div>
        );
    }) : [],
        [messageInit]);

    if ((connection && connection.state !== HubConnectionState.Connected)) {
        return <Loading />
    }

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

            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="space-y-4">
                    {messageInit?.items?.length === 0 ? (
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

            <TypingIndicator users={typingUsers.filter(e => e.userId != userId)} />
            <ChatInput onSubmit={handleSubmit}
                onStartTyping={handleUserTyping}
                onStopTyping={handleUserStopTyping}
            />
        </div>
    );
}