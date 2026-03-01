import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore, type ChatMessage } from "../stores/chatStore";
import axiosInstance from "../config/axiosService";
import { API_ROUTES } from "../constants/apiRoutes";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";

// Standard WA dark theme setup
const C = {
    bg: "#0b141a",
    surface: "#111b21",
    border: "#202c33",
    green: "#00a884",
    greenMsg: "#005c4b", // WA sender bubble
    aiMsg: "#202c33",   // WA receiver bubble
    text: "#e9edef",
    muted: "#8696a0",
};

export default function ChatPage() {
    const { sessionId, fileName, chatMessages, setChatMessages } = useChatStore();

    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Auto scroll
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isLoading]);

    // Format initial suggestions nicely
    // Removed as per user request

    if (!sessionId) {
        return <Navigate to="/" replace />;
    }

    const triggerAsk = async (question: string) => {
        if (!question.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: question,
            timestamp: new Date().toISOString()
        };

        setChatMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        try {
            const { data } = await axiosInstance.post(API_ROUTES.CHAT.ASK, {
                sessionId,
                question
            });

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: data.data?.answer || "I couldn't generate an answer.",
                timestamp: new Date().toISOString()
            };
            setChatMessages((prev) => [...prev, aiMsg]);

        } catch (error: any) {
            console.error("Ask question error:", error);
            const errMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: "Sorry, I ran into an error connecting to the AI brain. Check your connection or API keys.",
                timestamp: new Date().toISOString(),
                isError: true
            };
            setChatMessages((prev) => [...prev, errMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        triggerAsk(inputValue);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[75vh] min-h-[400px] md:min-h-[500px] w-full max-w-5xl mx-auto rounded-xl md:rounded-2xl border border-white/[0.05] bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden relative">

            {/* Header */}
            <header className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shrink-0 shadow-sm relative z-10 bg-black/20 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded shrink-0 overflow-hidden bg-white shadow-sm">
                        <img src="/ChatScope.png" alt="ChatScope Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold tracking-tight" style={{ color: C.text }}>AI Chat Analyst</h1>
                        <p className="text-[11px] font-medium" style={{ color: C.muted }}>Session: {fileName}</p>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <ScrollArea className="flex-1 min-h-0 relative w-full">

                {/* Background Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat', backgroundSize: '400px' }} />

                <div className="max-w-4xl mx-auto flex flex-col gap-4 md:gap-5 px-3 md:px-8 py-4 md:py-6 relative z-10">

                    {/* Intro / Welcome block */}
                    {chatMessages.length === 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-full my-20 md:my-32 text-center opacity-50 px-4">
                            <Sparkles size={28} className="text-[#00a884] mb-4 md:size-8" />
                            <p className="text-[13px] md:text-sm font-medium tracking-wide">Ask anything about the conversation !</p>
                        </motion.div>
                    )}
                    {/* Chat Bubbles */}
                    <AnimatePresence>
                        {chatMessages.map((msg) => {
                            const isUser = msg.role === "user";
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[90%] md:max-w-[75%] rounded-2xl p-3 md:p-4 shadow-sm leading-relaxed text-[13.5px] md:text-[14.5px] ${isUser ? "rounded-br-sm" : "rounded-bl-sm"} border transition-colors`}
                                        style={{
                                            backgroundColor: isUser ? "rgba(0,168,132,0.15)" : msg.isError ? "rgba(220, 38, 38, 0.1)" : "rgba(255,255,255,0.02)",
                                            borderColor: isUser ? "rgba(0,168,132,0.3)" : msg.isError ? "rgba(220, 38, 38, 0.3)" : "rgba(255,255,255,0.05)",
                                            color: isUser ? "#e9edef" : msg.isError ? "#ef4444" : "#e9edef",
                                            boxShadow: isUser ? "0 4px 20px rgba(0,168,132,0.05)" : "0 4px 20px rgba(0,0,0,0.1)"
                                        }}
                                    >
                                        <div className="flex flex-col gap-1">
                                            {/* AI label / error icon */}
                                            {!isUser && (
                                                <div className="flex items-center gap-1.5 mb-1 opacity-80">
                                                    {msg.isError ? (
                                                        <AlertCircle size={12} className="text-red-500" />
                                                    ) : (
                                                        <img src="/ChatScope.png" alt="ChatScope" className="w-[14px] h-[14px] object-contain" />
                                                    )}
                                                    <span className="text-[9px] uppercase tracking-wider font-bold" style={{ color: msg.isError ? "#ef4444" : "#00a884" }}>
                                                        {msg.isError ? "Error" : "ChatScope Analyst"}
                                                    </span>
                                                </div>
                                            )}

                                            {/* The raw content parsed playfully as paragraph text */}
                                            <div className="whitespace-pre-wrap break-words">{msg.content}</div>

                                            {/* Timestamp */}
                                            <div className="text-[10px] mt-1 ml-auto shrink-0 opacity-60 flex items-center gap-1 min-w-max">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Loading Indicator */}
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start">
                            <div className="max-w-[75%] rounded-2xl rounded-bl-sm p-4 text-[14.5px] border border-white/[0.05] bg-white/[0.02] font-medium flex gap-2 items-center text-[#8696a0]">
                                <Sparkles size={18} className="text-[#00a884] animate-pulse" />
                                <span className="animate-pulse tracking-wide text-sm font-semibold">Analyzing chat data...</span>
                            </div>
                        </motion.div>
                    )}

                    <div ref={bottomRef} className="h-4" />
                </div>
            </ScrollArea>

            {/* Input Form Bottom Bar */}
            <div className="p-3 md:p-4 shrink-0 relative z-10 bg-black/20 border-t border-white/5">
                <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto relative flex items-center">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask a question..."
                        className="w-full text-[13px] md:text-sm pl-4 pr-12 md:pr-14 h-11 md:h-12 rounded-xl border border-transparent shadow-sm focus-visible:ring-1 focus-visible:ring-[#00a884]/50 focus-visible:border-[#00a884]/30 placeholder:text-[#8696a0] transition-colors"
                        style={{ backgroundColor: "#202c33", color: "#e9edef" }}
                        autoFocus
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!inputValue.trim() || isLoading}
                        className="absolute right-1 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-transparent hover:bg-[#00a884]/10 text-[#00a884] shadow-none border-none focus-visible:ring-0 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        <Send size={16} className="ml-1 md:w-[18px] md:h-[18px]" />
                    </Button>
                </form>
                <div className="max-w-3xl mx-auto mt-2 text-center">
                    <p className="text-[9px] font-medium opacity-50 tracking-wide" style={{ color: C.text }}>
                        AI responds using extracted stats & themes, not the raw chat database lines. Privacy preserved.
                    </p>
                </div>
            </div>

        </div>
    );
}
