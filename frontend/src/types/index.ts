// ============================================================
// Shared TypeScript Types
// ============================================================

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface MessageStats {
    totalMessages: number;
    totalMedia: number;
    messagesPerUser: Record<string, number>;
    averageMessagesPerDay: number;
    mostActiveDay: string;
    mostActiveHour: number;
    dateRange: { start: string; end: string };
    activeDays: number;
}

export interface ActivityData {
    messagesPerDay: { date: string; count: number }[];
    messagesPerHour: { hour: number; count: number }[];
    messagesPerUser: { name: string; count: number }[];
}

export interface WordAnalysis {
    topWords: { word: string; count: number }[];
    emojiFrequency: { emoji: string; count: number }[];
    avgMessageLength: number;
    perSenderWords: Record<string, { word: string; count: number }[]>;
    perSenderEmojis: Record<string, { emoji: string; count: number }[]>;
    perSenderWordCount: Record<string, number>;
    perSenderAvgLength: Record<string, number>;
}

export interface ResponseTimeAnalysis {
    avgResponseTimeByUser: Record<string, number>;
    fastestResponder: string;
    longestGapHours: number;
    longestGapBetween: { from: string; to: string };
}

export interface SentimentData {
    positive: number;
    neutral: number;
    negative: number;
}

export interface UploadResponse {
    sessionId: string;
    fileName: string;
    totalMessages: number;
    participants: string[];
    stats: MessageStats;
}

export interface FullAnalysis {
    sessionId: string;
    fileName: string;
    stats: MessageStats;
    activity: ActivityData;
    responseTime: ResponseTimeAnalysis;
    sentiment: SentimentData;
}

export interface AISummaryResult {
    summary: string;
    mainTopics: string[];
    communicationTone: string;
    relationshipStyle: string;
    sentimentBreakdown: SentimentData;
    personalityProfiles: Record<string, string>;
    keyInsights: string[];
}
