// ============================================================
// Chat Repository - Implements IChatRepository
// Repository Pattern: All DB operations centralized here
// ============================================================

import { ChatAnalysis, IMessage, IChatAnalysis } from "../models/ChatAnalysis";
import { IChatRepository } from "../interfaces/IChatRepository";

export class ChatRepository implements IChatRepository {
    async save(
        sessionId: string,
        fileName: string,
        messages: IMessage[]
    ): Promise<IChatAnalysis> {
        const participants = [...new Set(messages.map((m) => m.sender))];

        const doc = await ChatAnalysis.findOneAndUpdate(
            { sessionId },
            {
                sessionId,
                fileName,
                totalMessages: messages.length,
                participants,
                messages,
            },
            { upsert: true, new: true }
        );
        return doc!;
    }

    async findBySessionId(sessionId: string): Promise<IChatAnalysis | null> {
        return ChatAnalysis.findOne({ sessionId }).lean();
    }

    async deleteBySessionId(sessionId: string): Promise<void> {
        await ChatAnalysis.deleteOne({ sessionId });
    }
}
