// ============================================================
// Mongoose Models
// ============================================================

import mongoose, { Document, Schema } from "mongoose";

// ----- Single Parsed Message -----
export interface IMessage {
    date: string;
    time: string;
    hour: number;
    sender: string;
    message: string;
    timestamp: Date;
    isMedia: boolean;
    emojis: string[];
}

// ----- Full Analysis Result Stored in DB -----
export interface IChatAnalysis extends Document {
    sessionId: string;
    fileName: string;
    totalMessages: number;
    participants: string[];
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    date: { type: String, required: true },
    time: { type: String, required: true },
    hour: { type: Number, required: true },
    sender: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, required: true },
    isMedia: { type: Boolean, default: false },
    emojis: [{ type: String }],
});

const ChatAnalysisSchema = new Schema<IChatAnalysis>(
    {
        sessionId: { type: String, required: true, unique: true, index: true },
        fileName: { type: String, required: true },
        totalMessages: { type: Number, required: true },
        participants: [{ type: String }],
        messages: [MessageSchema],
    },
    { timestamps: true }
);

export const ChatAnalysis = mongoose.model<IChatAnalysis>(
    "ChatAnalysis",
    ChatAnalysisSchema
);
