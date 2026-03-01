
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
    personalityProfiles: Record<string, { archetype: string; coreTrait: string }>;
    keyInsights: string[];
}

export class AISummaryService {
    private groq: Groq;

    constructor() {
        this.groq = new Groq({ apiKey: ENV.GROQ_API_KEY });
    }

    async generateSummary(messages: IMessage[]): Promise<AISummaryResult> {

        const sample = messages.slice(-50);
        const chatText = sample
            .map((m) => `${m.sender}: ${m.message}`)
            .join("\n");

        const prompt = `Perform a sophisticated behavioral psychology analysis of the following chat.
        Provide deep insights into the participants' psyche and relationship dynamics.
        
        Return ONLY a JSON object with this exact structure:
        {
          "summary": "A detailed 3-4 sentence paragraph summarizing the overall narrative and psychological context of the interaction.",
          "mainTopics": ["Context-specific topic 1", "Context-specific topic 2", "Context-specific topic 3"],
          "communicationTone": "An elegant, specific description of the conversational vibe (e.g., 'Analytically detached with bursts of emotional urgency')",
          "relationshipStyle": "A precise characterization of the bond (e.g., 'Interdependent and intellectually synchronized')",
          "sentimentBreakdown": { "positive": number, "neutral": number, "negative": number },
          "personalityProfiles": { 
            "ParticipantName": {
               "archetype": "A detailed 1-2 sentence behavioral archetype describing their role and psychology in the chat",
               "coreTrait": "A concise, uppercase label for their persona (e.g., 'THE PERSUADER')"
            }
          },
          "keyInsights": [
             "Deep observation about their interactive pattern",
             "Insight into underlying motivations or hidden subtext",
             "Observation about the specific linguistic choices made",
             "Synthesis of their long-term dynamic based on this snapshot"
          ]
        }

        LANGUAGE WARNING: The participants may be using regional languages written in English letters (e.g. Manglish/Malayalam, Hinglish, Tanglish, etc.). DO NOT hallucinate false romantic English meanings for words you do not understand. If a word like "Poo nayye" appears, it is likely Regional slang or an insult, NOT an English acronym or term of endearment. Treat unknown transliterated words as neutral slang/banter unless context proves otherwise.

        Chat Log:
        ${chatText}`;

        try {
            const completion = await this.groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert behavioral psychologist and linguistic analyst."
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 800,
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0]?.message?.content ?? "{}";
            const result = JSON.parse(content) as AISummaryResult;
            return result;
        } catch (error: any) {
            if (error instanceof ApiError) throw error;
            console.error("Groq API Error:", error.message);
            throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, MESSAGES.AI_SUMMARY_ERROR);
        }
    }


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

    async askQuestion(chatDoc: any, question: string): Promise<{ answer: string }> {

        const totalMessages = chatDoc.totalMessages || 0;
        const participants = chatDoc.participants || [];
        const statsStr = chatDoc.stats
            ? participants.map((p: string) => {
                const s = chatDoc.stats[p];
                if (!s) return "";
                const topWords = s.topWords ? s.topWords.map((w: any) => w.word).slice(0, 10).join(", ") : "";
                const topEmojis = s.topEmojis ? s.topEmojis.map((e: any) => e.emoji).slice(0, 10).join(" ") : "";
                return `- ${p} sent ${s.messages || 0} messages (avg length: ${s.avgLength || 0} words).\n  Top Words: ${topWords}\n  Top Emojis: ${topEmojis}`;
            }).join("\n")
            : "No detailed stats available.";

        // Inject the psychological context generated during upload if available
        const aiSummary = chatDoc.aiSummary ? `
        [DEEP PSYCHOLOGICAL CONTEXT & ANALYSIS]
        Summary: ${chatDoc.aiSummary.summary || "N/A"}
        Relationship Style: ${chatDoc.aiSummary.relationshipStyle || "N/A"}
        Communication Tone: ${chatDoc.aiSummary.communicationTone || "N/A"}
        Personality Profiles: ${chatDoc.aiSummary.personalityProfiles ? JSON.stringify(chatDoc.aiSummary.personalityProfiles) : "N/A"}
        Key Insights: ${chatDoc.aiSummary.keyInsights ? chatDoc.aiSummary.keyInsights.join(" | ") : "N/A"}
        Sentiment (Pos/Neu/Neg): ${chatDoc.aiSummary.sentimentBreakdown ? `${chatDoc.aiSummary.sentimentBreakdown.positive}% / ${chatDoc.aiSummary.sentimentBreakdown.neutral}% / ${chatDoc.aiSummary.sentimentBreakdown.negative}%` : "N/A"}` : "";

        const prompt = `You are an expert behavioral psychologist and Chat Data Assistant. 
        You have analyzed a WhatsApp chat between the following participants: ${participants.join(", ")}.
        
        [STATISTICAL OVERVIEW]
        Total messages: ${totalMessages}
        ${statsStr}
        ${aiSummary}

        [RECENT MESSAGE SAMPLE]
        Here is a sample of the most recent messages for context of their immediate dynamic:
        ${chatDoc.last50Messages ? chatDoc.last50Messages.map((m: any) => `${m.sender}: ${m.message}`).join("\n") : "No message sample available."}
        
        [USER QUESTION] Let's answer this query: 
        "${question}"
        
        [INSTRUCTIONS]
        - CRITICAL RULE: The chat might be in a local language written in English letters (e.g. Malayalam slang like "Poo nayye", "myre", "poda", "koppe"). NEVER hallucinate meaning and pretend these are English acronyms or sweet emotional words! These are usually banter or slang. Only translate if you legitimately know the Indian regional language text. If unsure, just refer to it as "local slang" or "banter" without making up a false English definition.
        - NEVER write long, sprawling essays. NEVER use structural section headers.
        - NEVER start your response with robotic filler like "Based on the provided data..." or "Based on the chat sample...". Start answering immediately with human-like directness. Speak like a witty friend reading their texts over their shoulder.
        - Answer the user's question directly, clearly, and concisely. Keep your total response between 1 to 3 short sentences. Be punchy and insightful.
        - If the exact answer isn't in the provided data but you can deduce it from their personality traits or communication style, give your best psychological guess and clearly state it's an inference.
        - Format in strict conversational plain text. DO NOT use any markdown formatting (no asterisks **, no hashes #, no bolding). Do NOT return JSON.`;

        try {
            const completion = await this.groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "system",
                        content: "You are a smart, analytical, and engaging Chat Data Assistant."
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5,
                max_tokens: 1000,
            });

            const content = completion.choices[0]?.message?.content ?? "I couldn't generate an answer from the data.";
            return { answer: content };
        } catch (error: any) {
            if (error instanceof ApiError) throw error;
            console.error("Groq API Error in askQuestion:", error.message);
            throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, "Failed to connect to AI service for question answering.");
        }
    }
}
