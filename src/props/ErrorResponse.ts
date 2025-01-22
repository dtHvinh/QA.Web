export interface ErrorResponse {
    type: string;
    title: string;
    status: number;
    errors: string
}

export type ErrorResponseProps = ErrorResponse;