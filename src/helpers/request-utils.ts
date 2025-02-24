import { ErrorResponse } from "@/props/ErrorResponse";
import { backendURL } from "@/utilities/Constants";
import getAuth, { AuthProps } from "@/helpers/auth-utils";
import { AuthRefreshResponse } from "@/types/types";
import { setCookie } from "cookies-next/client";
import notifyError, { notifySucceed } from "@/utilities/ToastrExtensions";

export const getFetcher
    = ([url, token]: [string, string]) => fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => {
        if (!res.ok && res.status == 401) {
            throw new Error('Network response was not ok', {
                cause: res.status
            });
        }
        return res.json();
    })
        .catch((error: Error) => {
            const auth = getAuth()!;

            if (error.cause === 401) {
                refreshToken(auth);
            }
        });

export const postFetcher = ([url, token, jsonBody]: [string, string, string]) => fetch(url, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: jsonBody,
}).then(res => {
    if (!res.ok && res.status == 401) {
        throw new Error('Network response was not ok', {
            cause: res.status
        });
    }
    return res.json();
})
    .catch((error: Error) => {
        const auth = getAuth()!;

        if (error.cause === 401) {
            refreshToken(auth);
        }
    });

export const deleteFetcher
    = ([url, token]: [string, string]) => fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => {
        if (!res.ok && res.status == 401) {
            throw new Error('Network response was not ok', {
                cause: res.status
            });
        }
        return res.json();
    })
        .catch((error: Error) => {
            const auth = getAuth()!;

            if (error.cause === 401) {
                refreshToken(auth);
            }
        });

export const putFetcher
    = ([url, token, jsonBody]: [string, string, string]) => fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: jsonBody,
    }).then(res => {
        if (!res.ok && res.status == 401) {
            throw new Error('Network response was not ok', {
                cause: res.status
            });
        }
        return res.json();
    })
        .catch((error: Error) => {
            const auth = getAuth()!;

            if (error.cause === 401) {
                refreshToken(auth);
            }
        });

export const fetcher
    = <T>([method, url, token, jsonBody]: [string, string, string, string])
        : Promise<T | ErrorResponse> => fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: jsonBody,
        }).then(res => res.json() as T);

export const IsErrorResponse = (response: any) => {
    // The type ErrorResponse has a field called 'errors' so we can use it to differentiate
    // between ErrorResponse and the other types
    //
    // This is dumb, but I don't know how to do it better
    return !response || 'errors' in response;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
    refreshSubscribers.map(callback => callback(token));
    refreshSubscribers = [];
}

export async function refreshToken(auth?: AuthProps) {
    if (!auth) {
        notifyError("No authentication data available");
        return null;
    }

    if (isRefreshing) {
        return new Promise(resolve => {
            refreshSubscribers.push((token: string) => {
                resolve(token);
            });
        });
    }

    isRefreshing = true;

    try {
        const response = await fetch(`${backendURL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accessToken: auth.accessToken,
                refreshToken: auth.refreshToken
            })
        });

        const data = await response.json();

        if (IsErrorResponse(data)) {
            notifyError((data as ErrorResponse).title);
            window.location.href = '/login';
            return null;
        }

        const authRefreshResponse = data as AuthRefreshResponse;
        const currentAuth = getAuth();

        if (!currentAuth) {
            notifyError("Authentication failed");
            return null;
        }

        currentAuth.accessToken = authRefreshResponse.accessToken;
        currentAuth.refreshToken = authRefreshResponse.refreshToken;

        setCookie('auth', currentAuth, {
            secure: true,
            sameSite: 'strict'
        });

        onRefreshed(authRefreshResponse.accessToken);
        notifySucceed('Session refreshed');
        return authRefreshResponse.accessToken;
    } catch (error) {
        notifyError("Failed to refresh token");
        return null;
    } finally {
        isRefreshing = false;
    }
}