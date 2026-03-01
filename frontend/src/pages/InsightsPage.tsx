import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Sparkles, Brain, Heart, HeartCrack,
    Minus, MessageCircle, Palette
} from "lucide-react";
import { chatApiService } from "../services/chatApi";
import { useChatStore } from "../stores/chatStore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function InsightsPage() {
    const { sessionId, aiSummary, setAiSummary, setLoading } = useChatStore();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchInsights() {
            if (!sessionId || aiSummary) return;
            try {
                setLoading(true);
                const res = await chatApiService.getAiSummary(sessionId);
                if (res.success && res.data) setAiSummary(res.data);
                else setError(res.message);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchInsights();
    }, [sessionId, aiSummary, setAiSummary, setLoading]);

    if (error) {
        return (
            <div className="flex items-center justify-center p-8 min-h-[50vh]">
                <div className="p-6 rounded-2xl bg-[#f15c6d]/10 border border-[#f15c6d]/20 text-[#f15c6d] text-sm font-medium">{error}</div>
            </div>
        );
    }
    if (!aiSummary) return null;

    const {
        summary, mainTopics, communicationTone, relationshipStyle,
        sentimentBreakdown, personalityProfiles, keyInsights,
    } = aiSummary;

    const sentiments = [
        { label: "Positive", value: sentimentBreakdown.positive, color: "#00a884", icon: Heart },
        { label: "Neutral", value: sentimentBreakdown.neutral, color: "#53BDEB", icon: Minus },
        { label: "Negative", value: sentimentBreakdown.negative, color: "#f15c6d", icon: HeartCrack },
    ];

    return (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8 max-w-4xl">

            {/* Page Header */}
            <motion.div variants={fadeUp}>
                <h2 className="text-2xl font-extrabold text-[#e9edef] tracking-tight">AI Insights</h2>
                <p className="text-sm text-[#8696a0] mt-1">Deep learning analysis of your conversation</p>
            </motion.div>

            {/* AI Summary Banner */}
            <motion.div variants={fadeUp}>
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00a884]/20 via-[#111b21] to-[#202c33] border border-[#00a884]/20 p-6 md:p-8">
                    <Sparkles className="absolute -right-4 -top-4 text-[#00a884] opacity-10" size={140} />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 rounded-xl bg-[#00a884]/15 border border-[#00a884]/20">
                                <Brain size={20} className="text-[#00a884]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#00a884] uppercase tracking-widest">AI Generated</p>
                                <h3 className="text-lg font-bold text-[#e9edef]">Conversation Summary</h3>
                            </div>
                        </div>
                        <p className="text-[#e9edef] text-base leading-relaxed">{summary}</p>
                    </div>
                </div>
            </motion.div>

            {/* Tone & Style + Sentiment */}
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Tone & Style */}
                <motion.div variants={fadeUp}>
                    <Card className="bg-[#111b21] border-[#202c33] rounded-2xl h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-3 text-base font-bold text-[#e9edef]">
                                <div className="p-2 rounded-lg bg-[#AB7ACA]/10">
                                    <Palette size={16} className="text-[#AB7ACA]" />
                                </div>
                                Style &amp; Tone
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-3">
                            <div className="p-4 bg-[#202c33] rounded-2xl border border-[#2a3942]">
                                <p className="text-[10px] font-bold text-[#8696a0] uppercase tracking-widest mb-2">Communication Tone</p>
                                <p className="text-2xl font-extrabold text-[#53BDEB] capitalize">{communicationTone}</p>
                            </div>
                            <div className="p-4 bg-[#202c33] rounded-2xl border border-[#2a3942]">
                                <p className="text-[10px] font-bold text-[#8696a0] uppercase tracking-widest mb-2">Relationship Style</p>
                                <p className="text-2xl font-extrabold text-[#FFB300] capitalize">{relationshipStyle}</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Sentiment */}
                <motion.div variants={fadeUp}>
                    <Card className="bg-[#111b21] border-[#202c33] rounded-2xl h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-3 text-base font-bold text-[#e9edef]">
                                <div className="p-2 rounded-lg bg-[#f15c6d]/10">
                                    <Heart size={16} className="text-[#f15c6d]" />
                                </div>
                                Sentiment Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-3">
                            {sentiments.map((s) => (
                                <div key={s.label}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="flex items-center gap-2 text-sm font-semibold text-[#e9edef]">
                                            <s.icon size={14} style={{ color: s.color }} />
                                            {s.label}
                                        </span>
                                        <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}%</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-[#202c33] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${s.value}%` }}
                                            transition={{ duration: 1.2, ease: "easeOut" }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: s.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Key Insights + Behavioral Flags */}
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Key Insights */}
                <motion.div variants={fadeUp}>
                    <Card className="bg-[#111b21] border-[#202c33] rounded-2xl h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-3 text-base font-bold text-[#e9edef]">
                                <div className="p-2 rounded-lg bg-[#00a884]/10">
                                    <MessageCircle size={16} className="text-[#00a884]" />
                                </div>
                                Intelligence Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-3">
                            <ul className="space-y-3">
                                {keyInsights.concat(mainTopics).slice(0, 7).map((insight: string, idx: number) => (
                                    <motion.li
                                        key={idx}
                                        variants={fadeUp}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-[#202c33] border border-[#2a3942] text-sm"
                                    >
                                        <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#00a884]/15 border border-[#00a884]/20 flex items-center justify-center text-[9px] font-bold text-[#00a884]">
                                            {idx + 1}
                                        </span>
                                        <span className="text-[#e9edef] leading-relaxed">{insight}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Personality Archetypes */}
                <motion.div variants={fadeUp}>
                    <Card className="bg-[#111b21] border-[#202c33] rounded-2xl h-full border-t-2 border-t-[#53BDEB]">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-3 text-base font-bold text-[#e9edef]">
                                <div className="p-2 rounded-lg bg-[#53BDEB]/10">
                                    <Brain size={16} className="text-[#53BDEB]" />
                                </div>
                                Personality Archetypes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-3 space-y-4">
                            {personalityProfiles && Object.entries(personalityProfiles).map(([name, profile]) => (
                                <motion.div
                                    key={name}
                                    variants={fadeUp}
                                    className="p-4 rounded-2xl bg-[#202c33] border border-[#2a3942] relative overflow-hidden group"
                                >
                                    <div className="flex items-center gap-3 mb-2 relative z-10">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                        <h4 className="font-bold text-[#e9edef] text-sm">{name}</h4>
                                    </div>
                                    <p className="text-xs text-[#8696a0] leading-relaxed relative z-10">{profile}</p>
                                    <div className="absolute right-[-10%] bottom-[-20%] opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                        <Brain size={80} />
                                    </div>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
