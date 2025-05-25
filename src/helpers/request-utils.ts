import getAuth, { AuthProps, invalidateAuth, setAuth } from "@/helpers/auth-utils";
import { ErrorResponse } from "@/props/ErrorResponse";
import { AuthRefreshResponse } from "@/types/types";
import { backendURL } from "@/utilities/Constants";
import notifyError from "@/utilities/ToastrExtensions";
import { createAxiosInstance } from './axios-config';

const axios = createAxiosInstance();

const bannedStatusCode = 444;

interface RequestConfig {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    data?: any;
}

interface RQOptions {
    needAuth?: boolean;
    displayError?: boolean;
}

export const makeRequest = async (config: RequestConfig, options?: RQOptions) => {
    const auth = getAuth();

    const headers = {
        ...config.headers,
        Authorization: auth ? `Bearer ${auth.accessToken}` : ''
    };

    if (options) {
        if (!options.needAuth) {
            headers.Authorization = '';
        }
    }

    try {
        const response = await axios({
            ...config,
            headers: headers
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
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
        if (error.response?.status === bannedStatusCode) {
            if (auth)
                invalidateAuth(auth);
            window.location.href = '/banned';
            return null;
        }

        const err = error.response.data as ErrorResponse;
        if ((options && options.displayError) || !options)
            notifyError(err.title);
        return err;
    }
};

export const getFetcher = (url: string) =>
    makeRequest({
        url,
        method: 'GET'
    });

export const getFetcherSilent = (url: string) =>
    makeRequest({
        url,
        method: 'GET'
    }, { displayError: false });

export const postFetcher = (url: string, jsonBody?: string, options?: RQOptions) =>
    makeRequest({
        url,
        method: 'POST',
        data: jsonBody ? JSON.parse(jsonBody) : null,
    }, options);

export const formPostFetcher = (url: string, formData?: FormData) =>
    makeRequest({
        url,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data: formData
    });

export const putFetcher = (url: string, jsonBody?: string) =>
    makeRequest({
        url,
        method: 'PUT',
        data: jsonBody ? JSON.parse(jsonBody) : null
    });

export const formPutFetcher = (url: string, formData?: FormData) =>
    makeRequest({
        url,
        method: 'PUT',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data: formData
    });

export const deleteFetcher = (url: string) =>
    makeRequest({
        url,
        method: 'DELETE'
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
            invalidateAuth(auth)
            window.location.href = '/login?return-url=' + window.location.href;
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

        setAuth(currentAuth)

        onRefreshed(authRefreshResponse.accessToken);
        return authRefreshResponse.accessToken;
    } catch (error) {
        notifyError("Failed to refresh token");
        window.location.href = '/auth?return-url=' + encodeURIComponent(window.location.pathname);
        invalidateAuth(auth);
        return null;
    } finally {
        isRefreshing = false;
    }
}