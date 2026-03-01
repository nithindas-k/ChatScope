import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    UploadCloud, LayoutDashboard, Activity,
    Type, Sparkles, X, Trash2, ShieldCheck, FileText, Lock
} from "lucide-react";
import { useChatStore } from "../../stores/chatStore";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosInstance from "../../config/axiosService";
import { API_ROUTES } from "../../constants/apiRoutes";

/* ─── colours (WA dark) ──────────────────────────── */
const C = {
    bg: "#0f1f27",
    border: "#1c2f3a",
    surface: "#182630",
    green: "#00a884",
    greenLow: "rgba(0,168,132,0.14)",
    text: "#e9edef",
    muted: "#8696a0",
    dim: "#4a6070",
};

const navItems = [
    { label: "Upload Chat", icon: UploadCloud, path: "/" },
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Activity", icon: Activity, path: "/activity" },
    { label: "Word Analysis", icon: Type, path: "/words" },
    { label: "Insights", icon: Sparkles, path: "/insights" },
];

/* ─────────────────────────────────────────── NavItem */
function NavItem({
    to, icon: Icon, label, badge, onClick, isCollapsed
}: {
    to: string; icon: React.ElementType; label: string;
    badge?: number; onClick?: () => void; isCollapsed?: boolean;
}) {
    const { pathname } = useLocation();
    const active = pathname === to;

    return (
        <NavLink to={to} onClick={onClick} style={{ display: "block", textDecoration: "none" }}>
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isCollapsed ? "center" : "flex-start",
                    gap: isCollapsed ? 0 : 12,
                    margin: "2px 8px",
                    padding: isCollapsed ? "12px 0" : "10px 14px",
                    borderRadius: 12,
                    cursor: "pointer",
                    backgroundColor: active ? C.greenLow : "transparent",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLDivElement).style.backgroundColor = C.surface;
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = active ? C.greenLow : "transparent";
                }}
                title={isCollapsed ? label : ""}
            >
                {/* left pill indicator */}
                {active && (
                    <motion.div
                        layoutId="activePill"
                        style={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 3,
                            height: 24,
                            borderRadius: "0 4px 4px 0",
                            backgroundColor: C.green,
                            boxShadow: `0 0 10px ${C.green} `,
                        }}
                    />
                )}

                {/* icon */}
                <Icon
                    size={20}
                    strokeWidth={active ? 2.4 : 1.8}
                    color={active ? C.green : C.muted}
                    style={{ flexShrink: 0, transition: "transform 0.2s" }}
                />

                {/* label */}
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            style={{
                                flex: 1,
                                fontSize: 13.5,
                                fontWeight: 600,
                                letterSpacing: "0.01em",
                                color: active ? C.text : C.muted,
                                lineHeight: 1,
                                whiteSpace: "nowrap",
                                overflow: "hidden"
                            }}>
                            {label}
                        </motion.span>
                    )}
                </AnimatePresence>

                {/* badge */}
                {!isCollapsed && badge ? (
                    <span style={{
                        fontSize: 10, fontWeight: 700,
                        backgroundColor: C.green, color: "#0b141a",
                        borderRadius: 9999, padding: "2px 6px",
                    }}>
                        {badge}
                    </span>
                ) : null}
            </div>
        </NavLink>
    );
}

/* ─────────────────────────────────── Section label */
function Label({ children, isCollapsed }: { children: string, isCollapsed?: boolean }) {
    if (isCollapsed) return <div style={{ height: 20 }} />;
    return (
        <p style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.17em",
            textTransform: "uppercase",
            color: C.dim,
            padding: "20px 24px 8px",
        }}>
            {children}
        </p>
    );
}

/* ─────────────────────────────────── Sidebar panel */
function Panel({ close, isCollapsed }: { close?: () => void, isCollapsed?: boolean }) {
    const navigate = useNavigate();
    const { fileName, reset } = useChatStore();

    async function handleLogout() {
        if (fileName) {
            // Get sessionId from store before resetting
            const { sessionId } = useChatStore.getState();
            if (sessionId) {
                try {
                    await axiosInstance.delete(API_ROUTES.CHAT.DELETE(sessionId));
                } catch (error) {
                    console.error("Failed to delete chat data from server:", error);
                }
            }
        }
        reset();
        navigate("/");
        close?.();
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            backgroundColor: C.bg,
            borderRight: `1px solid ${C.border} `,
            overflow: "hidden",
        }}>

            {/* ── Logo ───────────────────────────────────── */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
                gap: 12,
                padding: isCollapsed ? "24px 0 20px" : "24px 20px 20px"
            }}>
                <div style={{
                    width: 40, height: 40,
                    borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden"
                }}>
                    <img src="/ChatScope.png" alt="ChatScope Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} className="drop-shadow-lg" />
                </div>
                {!isCollapsed && (
                    <div>
                        <p style={{ color: C.text, fontWeight: 800, fontSize: 16, lineHeight: 1, letterSpacing: "-0.02em" }}>
                            ChatScope
                        </p>
                        <p style={{ color: C.green, fontWeight: 700, fontSize: 9.5, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 }}>
                            AI Analytics
                        </p>
                    </div>
                )}
            </div>

            {/* ── divider ─────────────────────────────────── */}
            <div style={{ height: 1, backgroundColor: C.border, margin: "0 16px" }} />

            {/* ── Main Menu ───────────────────────────────── */}
            <Label isCollapsed={isCollapsed}>Main Menu</Label>
            <nav>
                {navItems.map(item => (
                    <NavItem key={item.path} to={item.path} icon={item.icon} label={item.label} isCollapsed={isCollapsed} />
                ))}
            </nav>

            {/* ── Services ─────────────────────────────────── */}
            <Label isCollapsed={isCollapsed}>Services</Label>
            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div
                    onClick={() => { navigate("/terms"); }}
                    style={{
                        display: "flex", alignItems: "center",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        gap: 12,
                        margin: isCollapsed ? "2px 8px" : "0 10px",
                        padding: isCollapsed ? "10px 14px" : "10px 14px",
                        borderRadius: 10,
                        cursor: "pointer", transition: "background-color 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = C.surface}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"}
                >
                    <FileText size={18} strokeWidth={2} color={C.muted} style={{ flexShrink: 0 }} />
                    {!isCollapsed && <span style={{ fontSize: 13.5, fontWeight: 500, color: C.muted }}>Terms of Service</span>}
                </div>
                <div
                    onClick={() => { navigate("/privacy"); }}
                    style={{
                        display: "flex", alignItems: "center",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        gap: 12,
                        margin: isCollapsed ? "2px 8px" : "0 10px",
                        padding: isCollapsed ? "10px 14px" : "10px 14px",
                        borderRadius: 10,
                        cursor: "pointer", transition: "background-color 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = C.surface}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"}
                >
                    <Lock size={18} strokeWidth={2} color={C.muted} style={{ flexShrink: 0 }} />
                    {!isCollapsed && <span style={{ fontSize: 13.5, fontWeight: 500, color: C.muted }}>Privacy Policy</span>}
                </div>
            </nav>

            {/* ── Privacy Info ─────────────────────────────────── */}
            {!isCollapsed && <Label>Privacy</Label>}
            {!isCollapsed && (
                <div style={{
                    margin: "0 10px", padding: "12px 14px", borderRadius: 12,
                    backgroundColor: "rgba(0,168,132,0.04)", border: "1px dashed rgba(0,168,132,0.2)"
                }} className="cursor-default select-none group transition-all hover:bg-[rgba(0,168,132,0.08)]">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <ShieldCheck size={20} strokeWidth={2} color={C.green} style={{ flexShrink: 0 }} className="group-hover:scale-110 transition-transform duration-300" />
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: C.green, lineHeight: 1, letterSpacing: "-0.01em" }}>100% Secure</span>
                            <span style={{ fontSize: 11, color: C.muted, lineHeight: 1.2 }}>We do not store or save your chats.</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Spacer ──────────────────────────────────── */}
            <div style={{ flex: 1 }} />

            {/* ── divider ─────────────────────────────────── */}
            <div style={{ height: 1, backgroundColor: C.border, margin: "0 16px" }} />

            {/* ── User card / Action Area ───────────────────────────────── */}
            <div style={{ padding: isCollapsed ? "14px 8px 16px" : "14px 12px 16px" }}>
                {fileName ? (
                    <div style={{
                        display: "flex", alignItems: "center",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        gap: 12,
                        backgroundColor: isCollapsed ? "transparent" : C.surface,
                        border: isCollapsed ? "none" : `1px solid ${C.border} `,
                        borderRadius: 12,
                        padding: isCollapsed ? "12px 0" : "12px 12px",
                    }}>
                        {/* avatar */}
                        <div style={{
                            width: 38, height: 38, borderRadius: 10,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, overflow: "hidden"
                        }}>
                            <img
                                src="/ChatScope.png"
                                alt="ChatScope App Logo"
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                className="drop-shadow-lg"
                            />
                        </div>

                        {/* text */}
                        {!isCollapsed && (
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ color: C.text, fontSize: 13, fontWeight: 700, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    Analyst
                                </p>
                                <div style={{ overflow: "hidden", position: "relative", width: "100%", marginTop: 5 }}>
                                    <motion.div
                                        animate={{ x: ["0%", "-50%"] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 12,
                                            ease: "linear",
                                        }}
                                        style={{
                                            display: "flex",
                                            width: "fit-content",
                                            gap: "20px",
                                        }}
                                    >
                                        <span style={{ color: C.dim, fontSize: 11, whiteSpace: "nowrap" }}>
                                            {fileName}
                                        </span>
                                        <span style={{ color: C.dim, fontSize: 11, whiteSpace: "nowrap" }}>
                                            {fileName}
                                        </span>
                                    </motion.div>
                                </div>
                            </div>
                        )}

                        {/* clear data with confirmation */}
                        {!isCollapsed && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button
                                        title="Clear chat data"
                                        style={{
                                            padding: 6, borderRadius: 8, border: "none",
                                            backgroundColor: "transparent", cursor: "pointer",
                                            color: C.dim, display: "flex", alignItems: "center", justifyContent: "center",
                                            flexShrink: 0, transition: "all 0.15s",
                                        }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLButtonElement).style.color = C.dim;
                                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                                        }}
                                    >
                                        <Trash2 size={16} strokeWidth={2} />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-sm sm:max-w-md bg-[#111b21] border-[#202c33] text-[#e9edef] rounded-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-bold">Clear Chat Data?</DialogTitle>
                                        <DialogDescription className="text-[#8696a0] mt-2">
                                            This will immediately remove your uploaded chat data from the current session. You will need to re-upload a WhatsApp file to view analytics again.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="mt-4 sm:space-x-2">
                                        <DialogClose asChild>
                                            <Button
                                                className="bg-[#00a884] hover:bg-[#00a884]/90 text-white rounded-xl shadow-lg shadow-[#00a884]/20 px-6 font-semibold transition-all border-none focus-visible:ring-0"
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button
                                                onClick={handleLogout}
                                                className="bg-[#ef4444] hover:bg-[#ef4444]/90 text-white rounded-xl shadow-lg shadow-red-500/20 px-6 font-semibold transition-all border-none focus-visible:ring-0"
                                            >
                                                Clear Data
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                ) : (
                    <div
                        onClick={() => { navigate("/"); }}
                        style={{
                            display: "flex", alignItems: "center",
                            justifyContent: isCollapsed ? "center" : "flex-start",
                            gap: 12,
                            backgroundColor: "transparent",
                            border: isCollapsed ? "none" : `1px dashed ${C.dim}40`,
                            borderRadius: 12,
                            padding: isCollapsed ? "8px 0" : "12px",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(0,168,132,0.05)";
                            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,168,132,0.3)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                            (e.currentTarget as HTMLDivElement).style.borderColor = `${C.dim}40`;
                        }}
                    >
                        <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            backgroundColor: "rgba(0,168,132,0.1)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: C.green,
                            flexShrink: 0,
                        }}>
                            <UploadCloud size={16} strokeWidth={2.5} />
                        </div>
                        {!isCollapsed && (
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ color: C.text, fontSize: 13, fontWeight: 700, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    No Chat Uploaded
                                </p>
                                <p style={{ color: C.dim, fontSize: 11, lineHeight: 1, marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    Provide Chat to Analyze
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}

/* ─────────────────────────────────── Exported Sidebar */
export function Sidebar({ open, setOpen }: { open: boolean, setOpen: (v: boolean) => void }) {
    return (
        <>
            {/* Desktop sidebar - toggleable with animation */}
            <motion.aside
                initial={false}
                animate={{
                    width: open ? 248 : 78,
                    // Remove x translation to keep it visible
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="hidden md:flex flex-col overflow-hidden"
                style={{
                    height: "100vh",
                    position: "sticky",
                    top: 0,
                    flexShrink: 0,
                    zIndex: 40,
                    borderRight: `1px solid ${C.border}`
                }}
            >
                <div style={{ width: "100%", height: "100%" }}>
                    <Panel isCollapsed={!open} />
                </div>
            </motion.aside>

            {/* Mobile drawer */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="md:hidden"
                            style={{ position: "fixed", inset: 0, zIndex: 40, backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
                            onClick={() => setOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 260 }}
                            className="md:hidden flex flex-col"
                            style={{ position: "fixed", left: 0, top: 0, height: "100%", width: 248, zIndex: 50 }}
                        >
                            <button
                                onClick={() => setOpen(false)}
                                style={{
                                    position: "absolute", top: 22, right: 16, zIndex: 10,
                                    padding: 6, borderRadius: 10, border: "none",
                                    backgroundColor: "rgba(32, 44, 51, 0.8)", color: "#8696a0", cursor: "pointer",
                                    display: "flex", backdropFilter: "blur(4px)",
                                    transition: "all 0.2s"
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(42, 57, 66, 0.9)";
                                    (e.currentTarget as HTMLButtonElement).style.color = "#e9edef";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(32, 44, 51, 0.8)";
                                    (e.currentTarget as HTMLButtonElement).style.color = "#8696a0";
                                }}
                            >
                                <X size={15} />
                            </button>
                            <Panel close={() => setOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
