import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    UploadCloud, LayoutDashboard, Activity,
    Type, Sparkles, X, LogOut, Bell,
} from "lucide-react";
import { useChatStore } from "../../stores/chatStore";

/* ─── colours (WA dark) ──────────────────────────── */
const C = {
    bg: "#0f1f27",      // sidebar background (distinct from app bg)
    border: "#1c2f3a",      // sidebar right edge
    surface: "#182630",      // hover + user card background
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
    to, icon: Icon, label, badge, onClick,
}: {
    to: string; icon: React.ElementType; label: string;
    badge?: number; onClick?: () => void;
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
                    gap: 12,
                    margin: "1px 10px",
                    padding: "10px 14px",
                    borderRadius: 10,
                    cursor: "pointer",
                    backgroundColor: active ? C.greenLow : "transparent",
                    transition: "background-color 0.15s",
                }}
                onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLDivElement).style.backgroundColor = C.surface;
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = active ? C.greenLow : "transparent";
                }}
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
                            width: 4,
                            height: 26,
                            borderRadius: "0 4px 4px 0",
                            backgroundColor: C.green,
                            boxShadow: `0 0 10px ${C.green} `,
                        }}
                    />
                )}

                {/* icon */}
                <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 1.9}
                    color={active ? C.green : C.muted}
                    style={{ flexShrink: 0 }}
                />

                {/* label */}
                <span style={{
                    flex: 1,
                    fontSize: 13.5,
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    color: active ? C.text : C.muted,
                    lineHeight: 1,
                }}>
                    {label}
                </span>

                {/* badge */}
                {badge ? (
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
function Label({ children }: { children: string }) {
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
function Panel({ close }: { close?: () => void }) {
    const navigate = useNavigate();
    const { fileName, reset } = useChatStore();

    function handleLogout() {
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
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px 20px 20px" }}>
                <div style={{
                    width: 38, height: 38,
                    borderRadius: 12,
                    backgroundColor: C.green,
                    boxShadow: `0 0 22px rgba(0, 168, 132, 0.45)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                }}>
                    <Sparkles size={18} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                    <p style={{ color: C.text, fontWeight: 800, fontSize: 16, lineHeight: 1, letterSpacing: "-0.02em" }}>
                        ChatScope
                    </p>
                    <p style={{ color: C.green, fontWeight: 700, fontSize: 9.5, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 }}>
                        AI Analytics
                    </p>
                </div>
            </div>

            {/* ── divider ─────────────────────────────────── */}
            <div style={{ height: 1, backgroundColor: C.border, margin: "0 16px" }} />

            {/* ── Main Menu ───────────────────────────────── */}
            <Label>Main Menu</Label>
            <nav>
                {navItems.map(item => (
                    <NavItem key={item.path} to={item.path} icon={item.icon} label={item.label} onClick={close} />
                ))}
            </nav>

            {/* ── Account ─────────────────────────────────── */}
            <Label>Account</Label>
            <nav>
                <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    margin: "1px 10px", padding: "10px 14px", borderRadius: 10,
                    cursor: "pointer", transition: "background-color 0.15s",
                }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = C.surface}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"}
                >
                    <Bell size={20} strokeWidth={1.9} color={C.muted} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: C.muted }}>Notifications</span>
                </div>
            </nav>

            {/* ── Spacer ──────────────────────────────────── */}
            <div style={{ flex: 1 }} />

            {/* ── divider ─────────────────────────────────── */}
            <div style={{ height: 1, backgroundColor: C.border, margin: "0 16px" }} />

            {/* ── User card ───────────────────────────────── */}
            <div style={{ padding: "14px 12px 16px" }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    backgroundColor: C.surface,
                    border: `1px solid ${C.border} `,
                    borderRadius: 12,
                    padding: "12px 12px",
                }}>
                    {/* avatar */}
                    <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: `linear - gradient(135deg, ${C.green} 0 %, #25d366 100 %)`,
                        boxShadow: "0 0 12px rgba(0,168,132,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 800, fontSize: 14,
                        flexShrink: 0,
                    }}>
                        {fileName ? fileName.charAt(0).toUpperCase() : "G"}
                    </div>

                    {/* text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: C.text, fontSize: 13, fontWeight: 700, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {fileName ? "Analyst" : "Guest User"}
                        </p>
                        <p style={{ color: C.dim, fontSize: 11, lineHeight: 1, marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {fileName ? fileName : "chatscope@app"}
                        </p>
                    </div>

                    {/* logout */}
                    <button
                        onClick={handleLogout}
                        title="Reset session"
                        style={{
                            padding: 6, borderRadius: 8, border: "none",
                            backgroundColor: "transparent", cursor: "pointer",
                            color: C.dim, display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, transition: "color 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#f15c6d"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = C.dim}
                    >
                        <LogOut size={15} strokeWidth={2} />
                    </button>
                </div>
            </div>

        </div>
    );
}

/* ─────────────────────────────────── Exported Sidebar */
export function Sidebar({ open, setOpen }: { open: boolean, setOpen: (v: boolean) => void }) {
    return (
        <>
            {/* Desktop sidebar - always visible on large screens */}
            <aside
                className="hidden md:flex flex-col"
                style={{ width: 248, height: "100vh", position: "sticky", top: 0, flexShrink: 0, zIndex: 40 }}
            >
                <Panel />
            </aside>

            {/* Mobile drawer */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: "fixed", inset: 0, zIndex: 40, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
                            onClick={() => setOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 260 }}
                            className="show-mobile"
                            style={{ position: "fixed", left: 0, top: 0, height: "100%", width: 248, zIndex: 50, display: "flex", flexDirection: "column" }}
                        >
                            <button
                                onClick={() => setOpen(false)}
                                style={{
                                    position: "absolute", top: 14, right: 10, zIndex: 10,
                                    padding: 5, borderRadius: 8, border: "none",
                                    backgroundColor: "#202c33", color: "#8696a0", cursor: "pointer",
                                    display: "flex",
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
