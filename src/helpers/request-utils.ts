import {ErrorResponse} from "@/props/ErrorResponse";

export const getFetcher
    = ([url, token]: [string, string]) => fetch(url, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}).then(res => res.json());

export const postFetcher = ([url, token, jsonBody]: [string, string, string]) => fetch(url, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: jsonBody,
}).then(res => res.json());

export const deleteFetcher
    = ([url, token]: [string, string]) => fetch(url, {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${token}`
    }
}).then(res => res.json())
    .catch(() => {
        return {title: 'An error has occurred', errors: 'An error has occurred'} as ErrorResponse;
    });

export const putFetcher
    = ([url, token, jsonBody]: [string, string, string]) => fetch(url, {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: jsonBody,
}).then(res => res.json())
    .catch(() => {
        return {title: 'An error has occurred', errors: 'An error has occurred'} as ErrorResponse;
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
    return 'errors' in response;
}
