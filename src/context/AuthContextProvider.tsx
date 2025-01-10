'use client'

import { createContext, ReactNode } from "react"

export interface AuthProps {
    accessToken: string,
    refreshToken: string,
    username: string,
    profilePicture: string
}

export const AuthContext = createContext<AuthProps | null>(null)

export default function AuthContextProvider({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <AuthContext.Provider value={null}>
            {children}
        </AuthContext.Provider>
    )

}