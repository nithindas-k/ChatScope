
import { Request, Response, NextFunction } from "express";
import { ApiError, errorResponse } from "../utils/apiError";
import { HTTP_STATUS } from "../constants/httpStatusCodes";
import { MESSAGES } from "../constants/messages";

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json(errorResponse(err.message));
        return;
    }


    if (err.name === "ValidationError") {
        res
            .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
            .json(errorResponse(MESSAGES.VALIDATION_ERROR, err.message));
        return;
    }

   
    console.error("Unhandled Error:", err);
    res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponse(MESSAGES.SERVER_ERROR));
};

export const notFoundHandler = (_req: Request, res: Response): void => {
    res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse(MESSAGES.NOT_FOUND));
};
