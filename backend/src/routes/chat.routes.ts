
import { Router } from "express";
import {
    uploadChat,
    getAnalysis,
    getWordAnalysis,
    getAiSummary,
    getResponseTime,
    deleteChat,
} from "../controllers/chat.controller";
import { uploadMiddleware } from "../middlewares/uploadMiddleware";
import { ROUTES } from "../constants/routes";

const router = Router();


router.post(ROUTES.CHAT.UPLOAD, uploadMiddleware, uploadChat);


router.get(ROUTES.CHAT.ANALYSIS, getAnalysis);


router.get(ROUTES.CHAT.WORD_ANALYSIS, getWordAnalysis);


router.get(ROUTES.CHAT.AI_SUMMARY, getAiSummary);


router.get(ROUTES.CHAT.RESPONSE_TIME, getResponseTime);


router.delete(ROUTES.CHAT.DELETE, deleteChat);

export default router;
