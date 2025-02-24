import axios from 'axios';
import { backendURL } from '@/utilities/Constants';

export const createAxiosInstance = () => {
    const instance = axios.create({
        baseURL: backendURL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return instance;
};