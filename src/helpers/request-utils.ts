import { ErrorResponse } from "@/props/ErrorResponse";
import { backendURL } from "@/utilities/Constants";
import getAuth, { AuthProps } from "@/helpers/auth-utils";
import { AuthRefreshResponse } from "@/types/types";
import { setCookie } from "cookies-next/client";
import notifyError, { notifySucceed } from "@/utilities/ToastrExtensions";
import { createAxiosInstance } from './axios-config';

const axios = createAxiosInstance();

interface RequestConfig {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    data?: any;
}

export const makeRequest = async (config: RequestConfig) => {
    try {
        const response = await axios(config);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            const auth = getAuth();
            if (auth) {
                try {
                    const newToken = await refreshToken(auth);
                    if (newToken) {
                        config.headers = {
                            ...config.headers,
                            Authorization: `Bearer ${newToken}`
                        };
                        const retryResponse = await axios(config);
                        return retryResponse.data;
                    }
                } catch (refreshError) {
                    window.location.href = '/login';
                    return null;
                }
            }
        }
        throw error;
    }
};

export const getFetcher = ([url, token]: [string, string]) =>
    makeRequest({
        url,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    });

export const postFetcher = ([url, token, jsonBody]: [string, string, string]) =>
    makeRequest({
        url,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: JSON.parse(jsonBody)
    });

export const putFetcher = ([url, token, jsonBody]: [string, string, string]) =>
    makeRequest({
        url,
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        data: JSON.parse(jsonBody)
    });

export const deleteFetcher = ([url, token]: [string, string]) =>
    makeRequest({
        url,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });

export const IsErrorResponse = (response: any) => {
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
        const response = await axios.post(`${backendURL}/api/auth/refresh`, {
            accessToken: auth.accessToken,
            refreshToken: auth.refreshToken
        });

        const data = response.data;

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