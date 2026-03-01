import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../../stores/chatStore";
import { Menu } from "lucide-react";

const pageMeta: Record<string, { title: string; sub: string }> = {
    "/": { title: "Upload Chat", sub: "Import a WhatsApp export to begin" },
    "/dashboard": { title: "Dashboard", sub: "Overview of your conversation" },
    "/activity": { title: "Activity", sub: "Timeline & hourly patterns" },
    "/words": { title: "Word Analysis", sub: "Most used words & emojis" },
    "/insights": { title: "AI Insights", sub: "Deep-learning analysis" },
    "/terms": { title: "Terms of Service", sub: "Legal agreements and rules" },
    "/privacy": { title: "Privacy Policy", sub: "How we protect your data" },
};

export function Navbar({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
    const location = useLocation();
    const { fileName } = useChatStore();
    const meta = pageMeta[location.pathname] ?? { title: "ChatScope", sub: "" };

    return (
        <header
            style={{
                height: 72,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 32px",
                backgroundColor: "#111b21",
                borderBottom: "1px solid #202c33",
                position: "sticky",
                top: 0,
                zIndex: 30,
                flexShrink: 0,
                width: "100%",
                boxSizing: "border-box"
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>

                {/* Left – Title Area */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
                    {/* Mobile Menu Toggle — Hidden on Desktop via CSS class */}
                    <button
                        onClick={onOpenMobileMenu}
                        className="flex md:hidden items-center justify-center"
                        style={{
                            width: 38, height: 38,
                            alignItems: "center", justifyContent: "center",
                            color: "#8696a0", backgroundColor: "#1c272e",
                            borderRadius: 10, border: "none", cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        <Menu size={20} />
                    </button>

                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={meta.title}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 15 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                style={{
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: "#e9edef",
                                    margin: 0,
                                    lineHeight: 1,
                                    letterSpacing: "-0.02em"
                                }}
                            >
                                {meta.title}
                            </motion.h1>
                        </AnimatePresence>
                        <p style={{
                            fontSize: 12,
                            color: "#8696a0",
                            margin: "4px 0 0",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "min(300px, 50vw)"
                        }}>
                            {meta.sub}
                        </p>
                    </div>
                </div>

                {/* Right – Actions Area */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>

                    {/* Authenticated Badge — Desktop ONLY */}
                    <div className="hidden md:flex">
                        {fileName && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    display: "flex", alignItems: "center", gap: 10,
                                    padding: "8px 18px", borderRadius: 999,
                                    backgroundColor: "rgba(0,168,132,0.12)",
                                    border: "1px solid rgba(0,168,132,0.25)"
                                }}
                            >
                                <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#00a884", boxShadow: "0 0 8px #00a884" }} />
                                <p style={{ fontSize: 11, fontWeight: 700, color: "#00a884", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                    Live Sync
                                </p>
                            </motion.div>
                        )}
                    </div>



                    {/* Avatar / Logo */}
                    <div
                        style={{
                            width: 38, height: 38, borderRadius: 10,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", flexShrink: 0, overflow: "hidden"
                        }}
                    >
                        <img
                            src="/ChatScope.png"
                            alt="ChatScope App Logo"
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            className="drop-shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
