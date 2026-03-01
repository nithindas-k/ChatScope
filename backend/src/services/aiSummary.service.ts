// ============================================================
// AI Summary Service (Groq API)
// ============================================================

import Groq from "groq-sdk";
import { ENV } from "../config/env.config";
import { IMessage } from "../models/ChatAnalysis";
import { ApiError } from "../utils/apiError";
import { HTTP_STATUS } from "../constants/httpStatusCodes";
import { MESSAGES } from "../constants/messages";

export interface AISummaryResult {
    summary: string;
    mainTopics: string[];
    communicationTone: string;
    relationshipStyle: string;
    sentimentBreakdown: {
        positive: number;
        neutral: number;
        negative: number;
    };
    personalityProfiles: Record<string, string>;
    keyInsights: string[];
}

export class AISummaryService {
    private groq: Groq;

    constructor() {
        this.groq = new Groq({ apiKey: ENV.GROQ_API_KEY });
    }

    async generateSummary(messages: IMessage[]): Promise<AISummaryResult> {
        // Even more conservative for free tier (6k TPM)
        const sample = messages.slice(-70);
        const chatText = sample
            .map((m) => `${m.sender}: ${m.message}`)
            .join("\n");

        const prompt = `You are a world-class behavioral psychologist and linguistic forensic expert. Analyze this WhatsApp conversation and provide a deep psychological profile and analytical breakdown. 
        IMPORTANT: Respond ONLY with a valid JSON object. Do not include any character outside the JSON.

        Deep Analysis Requirements:
        1. "summary": A sophisticated 2-3 sentence overview of the relationship dynamic and context.
        2. "mainTopics": The core themes discussed, focusing on underlying subtext.
        3. "communicationTone": Describe the technical and emotional tone (e.g. "Passive-aggressive with occasional warmth").
        4. "relationshipStyle": Categorize the power dynamic and attachment style visible in the chat.
        5. "sentimentBreakdown": Percentage breakdown of emotional charge (Positive/Neutral/Negative).
        6. "personalityProfiles": For each participant, provide a 1-sentence behavioral archetype.
        7. "keyInsights": 3-5 high-level observations about the hidden patterns.

        Chat Data:
        ${chatText}

        Expected Output Structure:
        {
          "summary": "...",
          "mainTopics": [],
          "communicationTone": "...",
          "relationshipStyle": "...",
          "sentimentBreakdown": { "positive": X, "neutral": Y, "negative": Z },
          "personalityProfiles": { "SenderName": "...", "SenderName": "..." },
          "keyInsights": []
        }`;

        try {
            console.log(`[AI SERVICE] Generating summary for ${sample.length} messages...`);
            const completion = await this.groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.1,
                max_tokens: 1024,
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0]?.message?.content ?? "{}";


            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.AI_SUMMARY_ERROR);
            }

            const result = JSON.parse(jsonMatch[0]) as AISummaryResult;
            return result;
        } catch (error: any) {
            if (error instanceof ApiError) throw error;
            try {
                require('fs').writeFileSync('c:\\Users\\nithi\\OneDrive\\Documents\\Brototype\\ChatScope\\backend\\groq_final_debug.log', JSON.stringify({
                    msg: error.message,
                    st: error.status,
                    dt: error.response?.data
                }, null, 2));
            } catch (loggingError) { }
            console.error("Groq API Error:", error.message);
            throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, MESSAGES.AI_SUMMARY_ERROR);
        }
    }

    // Separate local sentiment scoring (for quick analysis without AI)
    computeLocalSentiment(messages: IMessage[]): { positive: number; neutral: number; negative: number } {
        const positiveWords = new Set([
            "love", "great", "amazing", "awesome", "happy", "good", "nice",
            "excellent", "wonderful", "fantastic", "joy", "thanks", "thank",
            "haha", "lol", "😂", "❤️", "😊", "👍", "🎉", "😍",
        ]);
        const negativeWords = new Set([
            "hate", "bad", "terrible", "awful", "worse", "worst", "sad",
            "angry", "upset", "sorry", "hurt", "pain", "😢", "😞", "😡", "💔",
        ]);

        let pos = 0, neg = 0, neu = 0;
        messages.forEach((msg) => {
            const lower = msg.message.toLowerCase();
            const words = lower.split(/\s+/);
            let msgSentiment = 0;
            words.forEach((w) => {
                if (positiveWords.has(w)) msgSentiment++;
                else if (negativeWords.has(w)) msgSentiment--;
            });
            if (msgSentiment > 0) pos++;
            else if (msgSentiment < 0) neg++;
            else neu++;
        });

        const total = messages.length || 1;
        return {
            positive: Math.round((pos / total) * 100),
            neutral: Math.round((neu / total) * 100),
            negative: Math.round((neg / total) * 100),
        };
    }
}
