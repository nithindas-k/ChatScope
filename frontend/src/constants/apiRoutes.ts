// ============================================================
// Centralized API Route Constants (Frontend)
// ============================================================

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export const API_ROUTES = {
    BASE,
    CHAT: {
        UPLOAD: `${BASE}/chat/upload`,
        ANALYSIS: (sessionId: string) => `${BASE}/chat/analysis/${sessionId}`,
        WORDS: (sessionId: string) => `${BASE}/chat/words/${sessionId}`,
        AI_SUMMARY: (sessionId: string) => `${BASE}/chat/ai-summary/${sessionId}`,
        RESPONSE_TIME: (sessionId: string) => `${BASE}/chat/response-time/${sessionId}`,
    },
} as const;
