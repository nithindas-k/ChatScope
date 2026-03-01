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

    // Store aggregated stats instead of 100k messages to avoid BSON 16MB limit
    stats: any;
    activity: any;
    responseTime: any;
    wordAnalysis: any;
    sentiment: any;
    last50Messages: IMessage[];

    createdAt: Date;
    updatedAt: Date;
}

const ChatAnalysisSchema = new Schema<IChatAnalysis>(
    {
        sessionId: { type: String, required: true, unique: true, index: true },
        fileName: { type: String, required: true },
        totalMessages: { type: Number, required: true },
        participants: [{ type: String }],

        stats: { type: Schema.Types.Mixed },
        activity: { type: Schema.Types.Mixed },
        responseTime: { type: Schema.Types.Mixed },
        wordAnalysis: { type: Schema.Types.Mixed },
        sentiment: { type: Schema.Types.Mixed },
        last50Messages: [{ type: Schema.Types.Mixed }],
    },
    { timestamps: true }
);

export const ChatAnalysis = mongoose.model<IChatAnalysis>(
    "ChatAnalysis",
    ChatAnalysisSchema
);
