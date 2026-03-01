import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../../stores/chatStore";
import { Bell, Settings, Menu } from "lucide-react";

const pageMeta: Record<string, { title: string; sub: string }> = {
    "/": { title: "Upload Chat", sub: "Import a WhatsApp export to begin" },
    "/dashboard": { title: "Dashboard", sub: "Overview of your conversation" },
    "/activity": { title: "Activity", sub: "Timeline & hourly patterns" },
    "/words": { title: "Word Analysis", sub: "Most used words & emojis" },
    "/insights": { title: "AI Insights", sub: "Deep-learning analysis" },
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

                    {/* Icons */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button style={{
                            width: 38, height: 38, borderRadius: 10,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#8696a0", backgroundColor: "transparent", border: "none", cursor: "pointer",
                            transition: "background 0.2s"
                        }} className="hover:bg-[#182229]">
                            <Bell size={18} />
                        </button>

                        <div className="sidebar-desktop">
                            <button style={{
                                width: 38, height: 38, borderRadius: 10,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#8696a0", backgroundColor: "transparent", border: "none", cursor: "pointer",
                                transition: "background 0.2s"
                            }} className="hover:bg-[#182229]">
                                <Settings size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden md:block" style={{ width: 1, height: 20, backgroundColor: "#1e2d35", margin: "0 4px" }} />

                    {/* Avatar */}
                    <div
                        style={{
                            width: 38, height: 38, borderRadius: "50%",
                            background: "linear-gradient(135deg, #00a884 0%, #25d366 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 13, fontWeight: 800,
                            boxShadow: "0 0 12px rgba(0,168,132,0.3)",
                            cursor: "pointer", flexShrink: 0
                        }}
                    >
                        {fileName ? fileName.charAt(0).toUpperCase() : "U"}
                    </div>
                </div>
            </div>
        </header>
    );
}
