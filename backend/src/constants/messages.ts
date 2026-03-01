
export const MESSAGES = {
    
    SUCCESS: "Operation completed successfully",
    SERVER_ERROR: "Internal server error",
    NOT_FOUND: "Resource not found",
    VALIDATION_ERROR: "Validation failed",

   
    UPLOAD_SUCCESS: "Chat file uploaded and analyzed successfully",
    UPLOAD_NO_FILE: "No file uploaded. Please provide a .txt file",
    UPLOAD_INVALID_FORMAT: "Invalid file format. Only .txt files are accepted",
    UPLOAD_PARSE_ERROR: "Failed to parse chat file. Ensure it is a valid WhatsApp export",
    UPLOAD_EMPTY: "The uploaded file appears to be empty",

    
    ANALYSIS_SUCCESS: "Chat analysis retrieved successfully",
    ANALYSIS_NOT_FOUND: "No analysis found for this session. Please upload a chat first",
    ANALYSIS_IN_PROGRESS: "Analysis is in progress. Please wait",


    AI_SUMMARY_SUCCESS: "AI summary generated successfully",
    AI_SUMMARY_ERROR: "Failed to generate AI summary. Please try again",
    AI_SUMMARY_RATE_LIMIT: "AI service is rate-limited. Please wait a moment",

    
    SESSION_NOT_FOUND: "Session not found. Please upload your chat again",
    SESSION_EXPIRED: "Session has expired. Please upload your chat again",
} as const;
