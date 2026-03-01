

import { IMessage, IChatAnalysis } from "../models/ChatAnalysis";

export interface IChatRepository {
    save(
        sessionId: string,
        fileName: string,
        messages: IMessage[],
        stats: any,
        activity: any,
        responseTime: any,
        wordAnalysis: any,
        sentiment: any
    ): Promise<IChatAnalysis>;

    findBySessionId(sessionId: string): Promise<IChatAnalysis | null>;
    deleteBySessionId(sessionId: string): Promise<void>;
}
