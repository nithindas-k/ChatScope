

import multer, { StorageEngine } from "multer";
import { Request } from "express";
import { ApiError } from "../utils/apiError";
import { HTTP_STATUS } from "../constants/httpStatusCodes";
import { MESSAGES } from "../constants/messages";

const storage: StorageEngine = multer.memoryStorage();

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
): void => {
    if (
        file.mimetype === "text/plain" ||
        file.originalname.toLowerCase().endsWith(".txt")
    ) {
        cb(null, true);
    } else {
        cb(
            new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.UPLOAD_INVALID_FORMAT) as unknown as null,
            false
        );
    }
};

export const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 },
}).single("chatFile");
