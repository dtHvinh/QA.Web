import Loading from "@/app/loading";
import { useSignalR } from "@/context/SignalRContext";
import getAuth, { extractId, getAuthUsername } from "@/helpers/auth-utils";
import { formPostFetcher, getFetcher } from "@/helpers/request-utils";
import { ChatMessageResponse, PagedResponse } from "@/types/types";
import { HubConnectionState } from "@microsoft/signalr";
import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { useThrottledCallback } from "use-debounce";
import ChatInput from "./ChatInput";
import ChatRoomMessage from "./ChatRoomMessage";
import TypingIndicator from './TypingIndicator';

interface ChatRoomProps {
    chatRoomId: string;
    chatRoomName: string;
}

export default function ChatRoom({ chatRoomId, chatRoomName, onBack }: ChatRoomProps & { onBack?: () => void }) {
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
            updateMessage(message);
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

        if (!res) return;
        // if (!IsErrorResponse(res)) {
        //     if (messageInit) {
        //         mutate({
        //             ...messageInit,
        //             items: [...messageInit.items, res as ChatMessageResponse]
        //         }, false);
        //     }
        // }
        // => use signalR instead to sync between devices
    };

    const RenderMessage = () => messageInit ? messageInit.items.map((msg, index) => {
        const isCurrentUser = msg.author.id === userId;
        return (
            <ChatRoomMessage
                key={msg.id}
                message={msg}
                isCurrentUser={isCurrentUser}
                showAvatar={true}
            />
        );
    }) : [];

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
                        <div className="[&>*]:mt-2">
                            <div className="flex flex-col items-center px-4 py-8 mb-6 border-b border-[var(--border-color)]">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Welcome to Chat Room #{chatRoomName}</h2>
                                <p className="text-sm text-[var(--text-secondary)] text-center max-w-md">
                                    This is the beginning of the chat room. Be nice and follow our community guidelines!
                                </p>
                                <div className="flex items-center gap-2 mt-4 text-xs text-[var(--text-tertiary)]">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Chat room created on {new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                            <RenderMessage />
                        </div>
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