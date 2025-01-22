export interface ErrorResponse {
    type: string;
    title: string;
    status: number;
    errors: string
}

export declare let ErrorType: ErrorResponse;