// ============================================================
// Chat Parser Service
// Single Responsibility: Parse raw WhatsApp .txt → structured messages
// ============================================================

import { v4 as uuidv4 } from "uuid";
import { IMessage } from "../models/ChatAnalysis";
import { WA_MESSAGE_REGEX, WA_SYSTEM_MESSAGE_REGEX, EMOJI_REGEX, parseTime12to24, parseDateStr } from "../utils/regexHelper";

export interface ParseResult {
    sessionId: string;
    messages: IMessage[];
}

export class ChatParserService {
    parse(rawText: string, fileName: string): ParseResult {
        const sessionId = uuidv4();
        const lines = rawText.split(/\r?\n/);
        const messages: IMessage[] = [];
        let currentMessage: IMessage | null = null;

        for (const line of lines) {
            const isSystemMatch = line.match(WA_SYSTEM_MESSAGE_REGEX);
            if (isSystemMatch) continue;

            const match = line.match(WA_MESSAGE_REGEX);

            if (match) {
                // Save previous accumulated message
                if (currentMessage) {
                    messages.push(currentMessage);
                }

                const [, dateStr, timeStr, sender, messageText] = match;

                // STEP 1 - CLEAN THE DATA (Removal of non-message lines)
                const isMedia =
                    messageText.includes("<Media omitted>") ||
                    messageText.includes("image omitted") ||
                    messageText.includes("video omitted") ||
                    messageText.includes("audio omitted") ||
                    messageText.includes("sticker omitted") ||
                    messageText.includes("GIF omitted") ||
                    messageText.includes("document omitted");

                const isDeleted =
                    messageText.includes("This message was deleted") ||
                    messageText.includes("You deleted this message");

                const isCall =
                    messageText.toLowerCase().includes("missed voice call") ||
                    messageText.toLowerCase().includes("missed video call");

                // Skip cleaning items
                if (isMedia || isDeleted || isCall) {
                    continue;
                }

                const hour = parseTime12to24(timeStr);
                const timestamp = parseDateStr(dateStr);
                timestamp.setHours(hour);

                const emojiMatches = messageText.match(EMOJI_REGEX) ?? [];

                currentMessage = {
                    date: dateStr,
                    time: timeStr,
                    hour,
                    sender: sender.trim(),
                    message: messageText.trim(),
                    timestamp,
                    isMedia: false, // Per request we remove media, so any stored message is not media
                    emojis: emojiMatches,
                };
            } else if (currentMessage && line.trim()) {
                // Multi-line message continuation
                currentMessage.message += "\n" + line;
                const moreEmojis = line.match(EMOJI_REGEX) ?? [];
                currentMessage.emojis.push(...moreEmojis);
            }
        }

        // Push the last message
        if (currentMessage) {
            messages.push(currentMessage);
        }

        return { sessionId, messages };
    }
}
