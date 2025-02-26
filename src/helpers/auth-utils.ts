import { getCookie } from "cookies-next/client";

export interface AuthProps {
    username: string;
    accessToken: string;
    refreshToken: string;
    profilePicture: string;
    roles: Role[];
}

declare type Role = 'Admin' | 'User' | 'Moderator';

export default function getAuth() {
    const authCookie = getCookie('auth');
    if (!authCookie) return null;
    return JSON.parse(authCookie) as AuthProps;
}