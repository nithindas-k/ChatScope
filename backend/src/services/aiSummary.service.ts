
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
}
