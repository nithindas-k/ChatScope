

export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}



export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => ({
    success: true,
    message,
    data,
});

export const errorResponse = (message: string, error?: string): ApiResponse => ({
    success: false,
    message,
    error,
});
