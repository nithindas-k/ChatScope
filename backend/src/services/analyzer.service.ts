// ============================================================
// Analyzer Service
// Computes all statistical analytics from parsed messages
// ============================================================

import { IMessage } from "../models/ChatAnalysis";
import { STOP_WORDS, EMOJI_REGEX } from "../utils/regexHelper";

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
    // Step 4 - Per Sender Analysis
    perSenderWords: Record<string, { word: string; count: number }[]>;
    perSenderEmojis: Record<string, { emoji: string; count: number }[]>;
    perSenderWordCount: Record<string, number>;
    perSenderAvgLength: Record<string, number>;
}

export interface ResponseTimeAnalysis {
    avgResponseTimeByUser: Record<string, number>; // in minutes
    fastestResponder: string;
    longestGapHours: number;
    longestGapBetween: { from: string; to: string };
}

export class AnalyzerService {
    // ---- Message Statistics ----
    getMessageStats(messages: IMessage[]): MessageStats {
        const messagesPerUser: Record<string, number> = {};
        const dayCount: Record<string, number> = {};
        const hourCount: Record<number, number> = {};
        let totalMedia = 0;

        messages.forEach((msg) => {
            messagesPerUser[msg.sender] = (messagesPerUser[msg.sender] ?? 0) + 1;
            dayCount[msg.date] = (dayCount[msg.date] ?? 0) + 1;
            hourCount[msg.hour] = (hourCount[msg.hour] ?? 0) + 1;
            if (msg.isMedia) totalMedia++;
        });

        const dates = Object.keys(dayCount).sort();
        const mostActiveDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
        const mostActiveHour = parseInt(
            Object.entries(hourCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "0"
        );
        const activeDays = dates.length;

        return {
            totalMessages: messages.length,
            totalMedia,
            messagesPerUser,
            averageMessagesPerDay:
                activeDays > 0 ? Math.round(messages.length / activeDays) : 0,
            mostActiveDay,
            mostActiveHour,
            dateRange: { start: dates[0] ?? "", end: dates[dates.length - 1] ?? "" },
            activeDays,
        };
    }

    // ---- Activity Time-Series ----
    getActivityData(messages: IMessage[]): ActivityData {
        const byDay: Record<string, number> = {};
        const byHour: Record<number, number> = {};
        const byUser: Record<string, number> = {};

        messages.forEach((msg) => {
            byDay[msg.date] = (byDay[msg.date] ?? 0) + 1;
            byHour[msg.hour] = (byHour[msg.hour] ?? 0) + 1;
            byUser[msg.sender] = (byUser[msg.sender] ?? 0) + 1;
        });

        const messagesPerDay = Object.entries(byDay)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => {
                const [d1, m1, y1] = a.date.split("/").map(Number);
                const [d2, m2, y2] = b.date.split("/").map(Number);
                return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
            });

        const messagesPerHour = Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            count: byHour[i] ?? 0,
        }));

        const messagesPerUser = Object.entries(byUser).map(([name, count]) => ({
            name,
            count,
        }));

        return { messagesPerDay, messagesPerHour, messagesPerUser };
    }

    // ---- Word & Emoji Frequency ----
    getWordAnalysis(messages: IMessage[]): WordAnalysis {
        const wordCount: Record<string, number> = {};
        const emojiCount: Record<string, number> = {};
        let totalLength = 0;
        let textCount = 0;

        const perSenderWordCount: Record<string, number> = {};
        const perSenderEmojiMap: Record<string, Record<string, number>> = {};
        const perSenderWordMap: Record<string, Record<string, number>> = {};
        const perSenderTotalLen: Record<string, number> = {};
        const perSenderMsgCount: Record<string, number> = {};

        // Collect cleaned participant names and emojis from names to exclude them from message analysis
        const cleanedSenderNames = new Set(
            messages.map((m) =>
                m.sender.toLowerCase()
                    .replace(/[^a-z0-9\s]/g, " ")
                    .split(/\s+/)
            ).flat().filter(w => w.length > 0)
        );

        const emojisInSenderNames = new Set(
            messages.map((m) => m.sender.match(EMOJI_REGEX) ?? []).flat()
        );

        messages.forEach((msg) => {
            if (msg.isMedia) return;
            totalLength += msg.message.length;
            textCount++;

            const sender = msg.sender;
            perSenderTotalLen[sender] = (perSenderTotalLen[sender] ?? 0) + msg.message.length;
            perSenderMsgCount[sender] = (perSenderMsgCount[sender] ?? 0) + 1;

            // Count emojis (Excluding emojis that are part of the sender's identifier/name)
            if (!perSenderEmojiMap[sender]) perSenderEmojiMap[sender] = {};
            msg.emojis.forEach((emoji) => {
                if (emojisInSenderNames.has(emoji)) return;

                emojiCount[emoji] = (emojiCount[emoji] ?? 0) + 1;
                perSenderEmojiMap[sender][emoji] = (perSenderEmojiMap[sender][emoji] ?? 0) + 1;
            });

            // Count words (Excluding words that are part of the sender's identifier/name)
            const words = msg.message
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, " ")
                .split(/\s+/)
                .filter((w) => {
                    return w.length > 2 &&
                        !STOP_WORDS.has(w) &&
                        !cleanedSenderNames.has(w);
                });

            if (!perSenderWordMap[sender]) perSenderWordMap[sender] = {};
            perSenderWordCount[sender] = (perSenderWordCount[sender] ?? 0) + words.length;

            words.forEach((word) => {
                wordCount[word] = (wordCount[word] ?? 0) + 1;
                perSenderWordMap[sender][word] = (perSenderWordMap[sender][word] ?? 0) + 1;
            });
        });

        const perSenderWords: Record<string, { word: string; count: number }[]> = {};
        const perSenderEmojis: Record<string, { emoji: string; count: number }[]> = {};
        const perSenderAvgLength: Record<string, number> = {};

        Object.keys(perSenderWordMap).forEach(sender => {
            perSenderWords[sender] = Object.entries(perSenderWordMap[sender])
                .sort((a, b) => b[1] - a[1])
                .slice(0, 15)
                .map(([word, count]) => ({ word, count }));

            perSenderEmojis[sender] = Object.entries(perSenderEmojiMap[sender] || {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([emoji, count]) => ({ emoji, count }));

            perSenderAvgLength[sender] = perSenderMsgCount[sender] > 0
                ? Math.round(perSenderTotalLen[sender] / perSenderMsgCount[sender])
                : 0;
        });

        return {
            topWords: Object.entries(wordCount).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([word, count]) => ({ word, count })),
            emojiFrequency: Object.entries(emojiCount).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([emoji, count]) => ({ emoji, count })),
            avgMessageLength: textCount > 0 ? Math.round(totalLength / textCount) : 0,
            perSenderWords,
            perSenderEmojis,
            perSenderWordCount,
            perSenderAvgLength
        };
    }

    // ---- Response Time Analysis ----
    getResponseTimeAnalysis(messages: IMessage[]): ResponseTimeAnalysis {
        const responseTimes: Record<string, number[]> = {};
        let longestGapMs = 0;
        let longestGapFrom = "";
        let longestGapTo = "";

        for (let i = 1; i < messages.length; i++) {
            const prev = messages[i - 1];
            const curr = messages[i];

            // Skip if same sender
            if (prev.sender === curr.sender) continue;

            const prevTime = new Date(prev.timestamp).getTime();
            const currTime = new Date(curr.timestamp).getTime();
            const diffMs = currTime - prevTime;

            if (diffMs > 0 && diffMs < 24 * 60 * 60 * 1000) {
                // Only count gaps under 24h as replies
                const diffMinutes = diffMs / (1000 * 60);
                if (!responseTimes[curr.sender]) responseTimes[curr.sender] = [];
                responseTimes[curr.sender].push(diffMinutes);
            }

            if (diffMs > longestGapMs) {
                longestGapMs = diffMs;
                longestGapFrom = prev.sender;
                longestGapTo = curr.sender;
            }
        }

        const avgResponseTimeByUser: Record<string, number> = {};
        Object.entries(responseTimes).forEach(([user, times]) => {
            avgResponseTimeByUser[user] =
                Math.round(times.reduce((a, b) => a + b, 0) / times.length);
        });

        const fastestResponder =
            Object.entries(avgResponseTimeByUser).sort((a, b) => a[1] - b[1])[0]?.[0] ?? "";

        return {
            avgResponseTimeByUser,
            fastestResponder,
            longestGapHours: Math.round((longestGapMs / (1000 * 60 * 60)) * 10) / 10,
            longestGapBetween: { from: longestGapFrom, to: longestGapTo },
        };
    }
}
