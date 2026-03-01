
export const WA_MESSAGE_REGEX =
    /^\[?(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}),?\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[ap]m)?)\]?\s(?:-\s)?([^:]+):\s(.+)$/i;

export const WA_SYSTEM_MESSAGE_REGEX =
    /^\[?(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}),?\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[ap]m)?)\]?\s(?:-\s)?(?!.+:).+$/i;


export const STOP_WORDS = new Set([
    "the", "a", "an", "is", "it", "in", "on", "at", "to", "for", "of", "and",
    "or", "but", "not", "this", "that", "was", "are", "be", "with", "as", "by",
    "from", "they", "we", "you", "i", "he", "she", "me", "my", "your", "his",
    "her", "our", "will", "have", "has", "had", "do", "does", "did", "been",
    "if", "then", "than", "so", "no", "yes", "ok", "okay", "yeah", "hey",
    "hi", "hello", "haha", "hahaha", "lol", "omg", "bro", "da", "la", "na",
    "ah", "oh", "uh", "um", "media", "omitted", "null", "deleted", "message",
    "image", "video", "audio", "sticker", "gif", "file", "document",
]);


export const EMOJI_REGEX =
    /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

export const parseTime12to24 = (timeStr: string): number => {
  
    const lower = timeStr.trim().toLowerCase();
    const isPM = lower.includes("pm");
    const isAM = lower.includes("am");
    const cleaned = lower.replace(/[ap]m/i, "").trim();
    const [hourStr, minuteStr] = cleaned.split(":");
    let hour = parseInt(hourStr, 10);
    if (isPM && hour !== 12) hour += 12;
    if (isAM && hour === 12) hour = 0;
    return hour;
};

export const parseDateStr = (dateStr: string): Date => {
 
    const parts = dateStr.split(/[\/\.-]/);
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    let year = parseInt(parts[2], 10);
    if (year < 100) year += 2000;
    return new Date(year, month, day);
};
