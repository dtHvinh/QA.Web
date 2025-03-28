import { getCookie, setCookie } from "cookies-next/client";
import { upsert } from "./utils";

export interface AuthProps {
    username: string;
    accessToken: string;
    refreshToken: string;
    profilePicture: string;
    roles: Role[];
}

export interface AuthListProps {
    current: AuthProps;
    others: AuthProps[];
}

declare type Role = 'Admin' | 'User' | 'Moderator';

/**
 * 
 * @returns The current auth object or null if not found
 */
export default function getAuth() {
    const authList = getCookie('auth');
    if (!authList) return null;
    return (JSON.parse(authList) as AuthListProps).current
}

export function getAuthList() {
    const authList = getCookie('auth');
    if (!authList) return null;
    return JSON.parse(authList) as AuthListProps;
}

export function setAuth(auth: AuthProps) {
    const authList = getAuthList();
    setCookie('auth', {
        current: auth,
        others: authList?.others || []
    })
}

export function setRememberAuth(auth: AuthProps) {
    const authList = getAuthList();
    const currentAuth = authList?.current;

    if (currentAuth?.username === auth.username) {
        setCookie('auth', {
            current: auth,
            others: authList?.others || []
        });
        return;
    }

    setCookie('auth', {
        current: auth,
        others: upsert(
            authList?.others || [],
            currentAuth!,
            (e) => e.username
        ).filter(e => e.username !== auth.username)
    });
}

export function changeAuth(idx: number) {
    const authList = getAuthList();
    if (!authList) return;

    const newCurrent = authList.others[idx];
    const others = [...authList.others];
    others[idx] = authList.current;

    setCookie('auth', {
        current: newCurrent,
        others: others
    });
}

export function removeAuth(auth: AuthProps) {
    const authList = getAuthList();
    if (!authList) return;

    const others = authList.others.filter(e => e.username !== auth.username);

    setCookie('auth', {
        current: auth.username === authList.current.username ? others[0] || null : authList.current,
        others: others
    });
}

export function updateCurrentAuthPfp(pfp: string) {
    const authList = getAuthList();
    if (!authList) return;
    setCookie('auth', {
        current: {
            ...authList.current,
            profilePicture: pfp
        },
        others: authList.others.map(e => {
            if (e.username === authList.current.username) {
                return {
                    ...e,
                    profilePicture: pfp
                }
            }
            return e;
        })
    })
}

export function updateCurrentAuthUsername(username: string) {
    const authList = getAuthList();
    if (!authList) return;
    setCookie('auth', {
        current: {
            ...authList.current,
            username: username
        },
        others: authList.others.map(e => {
            if (e.username === authList.current.username) {
                return {
                    ...e,
                    username: username
                }
            }
            return e;
        })
    })
}