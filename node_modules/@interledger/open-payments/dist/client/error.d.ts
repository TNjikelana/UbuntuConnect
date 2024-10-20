interface ErrorDetails {
    description: string;
    status?: number;
    code?: string;
    validationErrors?: string[];
}
export declare class OpenPaymentsClientError extends Error {
    description: string;
    validationErrors?: string[];
    status?: number;
    code?: string;
    constructor(message: string, args: ErrorDetails);
}
export {};
