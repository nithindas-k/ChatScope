// ============================================================
// Chat API Service - All API calls centralized
// ============================================================

import axiosInstance from "../config/axiosService";
import { API_ROUTES } from "../constants/apiRoutes";
import type {
    ApiResponse,
    UploadResponse,
    FullAnalysis,
    WordAnalysis,
    AISummaryResult,
    ResponseTimeAnalysis,
} from "../types";

export const chatApiService = {
    uploadChat: async (file: File): Promise<ApiResponse<UploadResponse>> => {
        const formData = new FormData();
        formData.append("chatFile", file);
        const res = await axiosInstance.post<ApiResponse<UploadResponse>>(
            API_ROUTES.CHAT.UPLOAD,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return res.data;
    },

    getAnalysis: async (sessionId: string): Promise<ApiResponse<FullAnalysis>> => {
        const res = await axiosInstance.get<ApiResponse<FullAnalysis>>(
            API_ROUTES.CHAT.ANALYSIS(sessionId)
        );
        return res.data;
    },

    getWordAnalysis: async (sessionId: string): Promise<ApiResponse<WordAnalysis>> => {
        const res = await axiosInstance.get<ApiResponse<WordAnalysis>>(
            API_ROUTES.CHAT.WORDS(sessionId)
        );
        return res.data;
    },

    getAiSummary: async (sessionId: string): Promise<ApiResponse<AISummaryResult>> => {
        const res = await axiosInstance.get<ApiResponse<AISummaryResult>>(
            API_ROUTES.CHAT.AI_SUMMARY(sessionId)
        );
        return res.data;
    },

    getResponseTime: async (sessionId: string): Promise<ApiResponse<ResponseTimeAnalysis>> => {
        const res = await axiosInstance.get<ApiResponse<ResponseTimeAnalysis>>(
            API_ROUTES.CHAT.RESPONSE_TIME(sessionId)
        );
        return res.data;
    },
};
