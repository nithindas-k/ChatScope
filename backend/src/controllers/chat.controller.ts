// ============================================================
// Chat Controller - HTTP Layer Only
// SOLID: Single Responsibility - no business logic here
// ============================================================

import { Request, Response, NextFunction } from "express";
import { ChatParserService } from "../services/chatParser.service";
import { AnalyzerService } from "../services/analyzer.service";
import { AISummaryService } from "../services/aiSummary.service";
import { ChatRepository } from "../repositories/chat.repository";
import { ApiError, successResponse } from "../utils/apiError";
import { HTTP_STATUS } from "../constants/httpStatusCodes";
import { MESSAGES } from "../constants/messages";

const parserService = new ChatParserService();
const analyzerService = new AnalyzerService();
const aiService = new AISummaryService();
const chatRepo = new ChatRepository();

// POST /api/chat/upload
export const uploadChat = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.file) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.UPLOAD_NO_FILE);
        }

        const rawText = req.file.buffer.toString("utf-8");

        if (!rawText.trim()) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.UPLOAD_EMPTY);
        }

        const { sessionId, messages } = parserService.parse(rawText, req.file.originalname);

        if (messages.length === 0) {
            throw new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, MESSAGES.UPLOAD_PARSE_ERROR);
        }

        // Precompute all analysis to avoid storing huge `messages` array, 
        // which prevents MongoDB BSON 16MB document size limit issues.
        const stats = analyzerService.getMessageStats(messages);
        const activity = analyzerService.getActivityData(messages);
        const responseTime = analyzerService.getResponseTimeAnalysis(messages);
        const wordAnalysis = analyzerService.getWordAnalysis(messages);
        const sentiment = aiService.computeLocalSentiment(messages);

        await chatRepo.save(
            sessionId,
            req.file.originalname,
            messages,
            stats,
            activity,
            responseTime,
            wordAnalysis,
            sentiment
        );

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(MESSAGES.UPLOAD_SUCCESS, {
                sessionId,
                fileName: req.file.originalname,
                totalMessages: messages.length,
                participants: [...new Set(messages.map((m) => m.sender))],
                stats,
            })
        );
    } catch (error) {
        next(error);
    }
};

// GET /api/chat/analysis/:sessionId
export const getAnalysis = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const sessionId = req.params["sessionId"] as string;
        const chatDoc = await chatRepo.findBySessionId(sessionId);

        if (!chatDoc) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.ANALYSIS_NOT_FOUND);
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse(MESSAGES.ANALYSIS_SUCCESS, {
                sessionId,
                fileName: chatDoc.fileName,
                stats: chatDoc.stats,
                activity: chatDoc.activity,
                responseTime: chatDoc.responseTime,
                sentiment: chatDoc.sentiment,
            })
        );
    } catch (error) {
        next(error);
    }
};

// GET /api/chat/words/:sessionId
export const getWordAnalysis = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const sessionId = req.params["sessionId"] as string;
        const chatDoc = await chatRepo.findBySessionId(sessionId);

        if (!chatDoc) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.ANALYSIS_NOT_FOUND);
        }

        res.status(HTTP_STATUS.OK).json(successResponse(MESSAGES.ANALYSIS_SUCCESS, chatDoc.wordAnalysis));
    } catch (error) {
        next(error);
    }
};

// GET /api/chat/ai-summary/:sessionId
export const getAiSummary = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const sessionId = req.params["sessionId"] as string;
        const chatDoc = await chatRepo.findBySessionId(sessionId);

        if (!chatDoc) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.ANALYSIS_NOT_FOUND);
        }

        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
            res.status(HTTP_STATUS.OK).json(
                successResponse(MESSAGES.AI_SUMMARY_SUCCESS, {
                    summary: "AI summary unavailable (no API key). Add GROQ_API_KEY to .env",
                    mainTopics: [],
                    communicationTone: "Analysis pending",
                    relationshipStyle: "Analysis pending",
                    sentimentBreakdown: chatDoc.sentiment,
                    toxicityFlags: [],
                    keyInsights: ["Add your Groq API key to enable full AI analysis"],
                })
            );
            return;
        }

        const aiResult = await aiService.generateSummary(chatDoc.last50Messages);

        res.status(HTTP_STATUS.OK).json(successResponse(MESSAGES.AI_SUMMARY_SUCCESS, aiResult));
    } catch (error) {
        next(error);
    }
};

// GET /api/chat/response-time/:sessionId
export const getResponseTime = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const sessionId = req.params["sessionId"] as string;
        const chatDoc = await chatRepo.findBySessionId(sessionId);

        if (!chatDoc) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.ANALYSIS_NOT_FOUND);
        }

        res.status(HTTP_STATUS.OK).json(successResponse(MESSAGES.ANALYSIS_SUCCESS, chatDoc.responseTime));
    } catch (error) {
        next(error);
    }
};
// DELETE /api/chat/delete/:sessionId
export const deleteChat = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const sessionId = req.params["sessionId"] as string;
        await chatRepo.deleteBySessionId(sessionId);
        res.status(HTTP_STATUS.OK).json(successResponse("Chat data cleared successfully from database", null));
    } catch (error) {
        next(error);
    }
};
