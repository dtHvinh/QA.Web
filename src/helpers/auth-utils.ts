import {getCookie} from "cookies-next/client";

export interface AuthProps {
    username: string;
    accessToken: string;
    refreshToken: string;
    profilePicture: string;
}

export default function getAuth() {
    const authCookie = getCookie('auth');
    return authCookie ? JSON.parse(authCookie) as AuthProps : null;
}