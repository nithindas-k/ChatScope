// ============================================================
// Chat Routes
// ============================================================

import { Router } from "express";
import {
    uploadChat,
    getAnalysis,
    getWordAnalysis,
    getAiSummary,
    getResponseTime,
} from "../controllers/chat.controller";
import { uploadMiddleware } from "../middlewares/uploadMiddleware";
import { ROUTES } from "../constants/routes";

const router = Router();

// POST /api/chat/upload
router.post(ROUTES.CHAT.UPLOAD, uploadMiddleware, uploadChat);

// GET /api/chat/analysis/:sessionId
router.get(ROUTES.CHAT.ANALYSIS, getAnalysis);

// GET /api/chat/words/:sessionId
router.get(ROUTES.CHAT.WORD_ANALYSIS, getWordAnalysis);

// GET /api/chat/ai-summary/:sessionId
router.get(ROUTES.CHAT.AI_SUMMARY, getAiSummary);

// GET /api/chat/response-time/:sessionId
router.get(ROUTES.CHAT.RESPONSE_TIME, getResponseTime);

export default router;
