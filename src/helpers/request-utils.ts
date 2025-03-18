import getAuth, { AuthProps } from "@/helpers/auth-utils";
import { ErrorResponse } from "@/props/ErrorResponse";
import { AuthRefreshResponse } from "@/types/types";
import { backendURL } from "@/utilities/Constants";
import notifyError from "@/utilities/ToastrExtensions";
import { setCookie } from "cookies-next/client";
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
                const newToken = await refreshToken(auth);
                if (newToken) {
                    config.headers = {
                        ...config.headers,
                        Authorization: `Bearer ${newToken}`
                    };
                    const retryResponse = await axios(config);
                    return retryResponse.data;
                }
            }
        }
        const err = error.response.data as ErrorResponse;
        notifyError(err.title);
        return err;
    }
};

export const getFetcher = ([url, token]: [string, string]) =>
    makeRequest({
        url,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });

export const postFetcher = ([url, token, jsonBody]: [string, string, string?]) =>
    makeRequest({
        url,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: jsonBody ? JSON.parse(jsonBody) : null
    });

export const formPostFetcher = ([url, token, formData]: [string, string, FormData?]) =>
    makeRequest({
        url,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
        data: formData
    });

export const putFetcher = ([url, token, jsonBody]: [string, string, string?]) =>
    makeRequest({
        url,
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        data: jsonBody ? JSON.parse(jsonBody) : null
    });

export const formPutFetcher = ([url, token, formData]: [string, string, FormData?]) =>
    makeRequest({
        url,
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
        data: formData
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
        return authRefreshResponse.accessToken;
    } catch (error) {
        notifyError("Failed to refresh token");
        window.location.href = '/auth';
        return null;
    } finally {
        isRefreshing = false;
    }
}