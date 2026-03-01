// ============================================================
// API Route Constants - Centralized
// ============================================================

export const ROUTES = {
    BASE: "/api",
    CHAT: {
        ROOT: "/chat",
        UPLOAD: "/upload",
        ANALYSIS: "/analysis/:sessionId",
        AI_SUMMARY: "/ai-summary/:sessionId",
        WORD_ANALYSIS: "/words/:sessionId",
        RESPONSE_TIME: "/response-time/:sessionId",
        SENTIMENT: "/sentiment/:sessionId",
        DELETE: "/delete/:sessionId",
    },
    HEALTH: "/health",
} as const;
