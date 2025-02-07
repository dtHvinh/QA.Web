import {getCookie} from "cookies-next/client";

export interface AuthProps {
    username: string;
    accessToken: string;
    refreshToken: string;
    profilePicture: string;
    role: 'Admin' | 'User';
}

export default function getAuth() {
    const authCookie = getCookie('auth');
    if (!authCookie) return null;
    return JSON.parse(authCookie) as AuthProps;
}