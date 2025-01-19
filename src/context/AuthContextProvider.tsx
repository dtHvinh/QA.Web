'use client'

import { getCookie } from "cookies-next/client"
import { createContext, ReactNode } from "react"

export interface AuthProps {
    accessToken: string,
    refreshToken: string,
    username: string,
    profilePicture: string
}

export const AuthContext = createContext<AuthProps | null>(null)

export default function AuthContextProvider({ children }: Readonly<{ children: ReactNode }>) {

    const authCookie = getCookie('auth');

    const auth = authCookie ? JSON.parse(authCookie) as AuthProps : null;

    return (
        auth != null ?
            (
                <AuthContext.Provider value={auth}>
                    {children}
                </AuthContext.Provider>
            )
            : (<div>{children}</div>)
    )

}