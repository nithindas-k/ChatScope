// ============================================================
// App-wide Constants & WhatsApp Dark Theme Colors
// ============================================================

export const APP_NAME = "ChatScope";
export const APP_TAGLINE = "AI-Powered WhatsApp Chat Analyzer";

export const WA_COLORS = {
    darkBg: "#111B21",
    panelBg: "#202C33",
    inputBg: "#2A3942",
    primary: "#00A884",
    primaryHover: "#06CF9C",
    messageSent: "#005C4B",
    messageRecv: "#202C33",
    textMain: "#E9EDEF",
    textMuted: "#8696A0",
    border: "#2A3942",
    accentGreen: "#25D366",
    danger: "#F15C6D",
    warning: "#FFB300",
    info: "#53BDEB",
} as const;

export const CHART_COLORS = [
    "#00A884", "#25D366", "#53BDEB", "#FFB300",
    "#F15C6D", "#AB7ACA", "#FC8C55", "#8BAFFF",
];

export const ANIMATION_DURATION = 0.4;

export const NAV_ITEMS = [
    { label: "Upload", icon: "Upload", path: "/" },
    { label: "Overview", icon: "BarChart2", path: "/dashboard" },
    { label: "Activity", icon: "Activity", path: "/activity" },
    { label: "Words", icon: "Type", path: "/words" },
    { label: "AI Insights", icon: "Sparkles", path: "/insights" },
] as const;
