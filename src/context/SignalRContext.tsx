'use client'

import getAuth from '@/helpers/auth-utils';
import { backendURL } from '@/utilities/Constants';
import * as signalR from '@microsoft/signalr';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface SignalRContextType {
    connection: signalR.HubConnection | null;
    isConnected: boolean;
    joinRoom: (roomId: number) => Promise<void>;
    leaveRoom: (roomId: number) => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType>({
    connection: null,
    isConnected: false,
    joinRoom: async () => { },
    leaveRoom: async () => { },
});

export const useSignalR = () => useContext(SignalRContext);

export const SignalRProvider = ({ children }: { children: ReactNode }) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [mounted, setMounted] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!mounted || !auth?.accessToken) return;

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${backendURL}/roomChatHub`, {
                accessTokenFactory: () => auth.accessToken,
            })
            .withAutomaticReconnect()
            .build();

        newConnection.onclose(() => setIsConnected(false));
        newConnection.onreconnecting(() => setIsConnected(false));
        newConnection.onreconnected(() => setIsConnected(true));

        setConnection(newConnection);

        newConnection.start()
            .then(() => setIsConnected(true))
            .catch(err => {
                console.error('SignalR Connection Error: ', err);
                setIsConnected(false);
            });

        return () => {
            newConnection.stop()
                .catch(err => console.error('Error stopping connection: ', err));
        };
    }, [mounted, auth?.accessToken]);

    const joinRoom = async (roomId: number) => {
        if (connection && connection.state === signalR.HubConnectionState.Connected) {
            console.debug('Joining room: ', roomId);
            await connection.invoke('JoinRoom', roomId.toString());
        }
    };

    const leaveRoom = async (roomId: number) => {
        if (connection && connection.state === signalR.HubConnectionState.Connected) {
            console.debug('Leaving room: ', roomId);
            await connection.invoke('LeaveRoom', roomId.toString());
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <SignalRContext.Provider value={{ connection, isConnected, joinRoom, leaveRoom }}>
            {children}
        </SignalRContext.Provider>
    );
};