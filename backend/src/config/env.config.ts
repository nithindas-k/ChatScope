
import dotenv from "dotenv";
dotenv.config();

const getEnv = (key: string, fallback?: string): string => {
    const value = process.env[key] ?? fallback;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

export const ENV = {
    PORT: parseInt(getEnv("PORT", "5000")),
    MONGO_URI: getEnv("MONGO_URI", "mongodb://localhost:27017/chatscope"),
    GROQ_API_KEY: getEnv("GROQ_API_KEY", ""),
    NODE_ENV: getEnv("NODE_ENV", "development"),
    IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;
