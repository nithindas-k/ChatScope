// ============================================================
// Repository Interface (Dependency Inversion Principle)
// ============================================================

import { IMessage, IChatAnalysis } from "../models/ChatAnalysis";

export interface IChatRepository {
    save(sessionId: string, fileName: string, messages: IMessage[]): Promise<IChatAnalysis>;
    findBySessionId(sessionId: string): Promise<IChatAnalysis | null>;
    deleteBySessionId(sessionId: string): Promise<void>;
}
