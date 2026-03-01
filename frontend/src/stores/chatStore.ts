// ============================================================
// Zustand Store for global session state
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FullAnalysis, AISummaryResult, WordAnalysis } from "../types";

interface ChatStore {
    sessionId: string | null;
    fileName: string | null;
    totalMessages: number;
    participants: string[];
    analysis: FullAnalysis | null;
    wordAnalysis: WordAnalysis | null;
    aiSummary: AISummaryResult | null;
    isLoading: boolean;
    error: string | null;

    setSession: (sessionId: string, fileName: string, total: number, participants: string[]) => void;
    setAnalysis: (data: FullAnalysis) => void;
    setWordAnalysis: (data: WordAnalysis) => void;
    setAiSummary: (data: AISummaryResult) => void;
    setLoading: (v: boolean) => void;
    setError: (msg: string | null) => void;
    reset: () => void;
}

const initialState = {
    sessionId: null,
    fileName: null,
    totalMessages: 0,
    participants: [],
    analysis: null,
    wordAnalysis: null,
    aiSummary: null,
    isLoading: false,
    error: null,
};

export const useChatStore = create<ChatStore>()(
    persist(
        (set) => ({
            ...initialState,
            setSession: (sessionId, fileName, total, participants) =>
                set({ sessionId, fileName, totalMessages: total, participants }),
            setAnalysis: (data) => set({ analysis: data }),
            setWordAnalysis: (data) => set({ wordAnalysis: data }),
            setAiSummary: (data) => set({ aiSummary: data }),
            setLoading: (v) => set({ isLoading: v }),
            setError: (msg) => set({ error: msg }),
            reset: () => set(initialState),
        }),
        {
            name: "chatscope-session",
            partialize: (state) => ({
                sessionId: state.sessionId,
                fileName: state.fileName,
                totalMessages: state.totalMessages,
                participants: state.participants,
            }),
        }
    )
);
