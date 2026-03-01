import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Sparkles, Brain, Heart, HeartCrack,
    Minus, User,
    Zap, Quote, Eye
} from "lucide-react";
import { chatApiService } from "../services/chatApi";
import { useChatStore } from "../stores/chatStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function InsightsPage() {
    const { sessionId, aiSummary, setAiSummary, isLoading, setLoading } = useChatStore();
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

    const InsightsSkeleton = () => (
        <div className="space-y-6 container mx-auto py-6 animate-in fade-in duration-500 max-w-6xl px-4">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 rounded" />
                    <Skeleton className="h-4 w-64 rounded" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-card/40 border-white/5">
                        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                        <CardContent><Skeleton className="h-20 w-full" /></CardContent>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-card/40 border-white/5 h-48">
                            <CardHeader><Skeleton className="h-4 w-24" /></CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-2 w-full" />)}
                            </CardContent>
                        </Card>
                        <Card className="bg-card/40 border-white/5 h-48">
                            <CardHeader><Skeleton className="h-4 w-24" /></CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="bg-card/40 border-white/5">
                        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                        </CardContent>
                    </Card>
                </div>
                <Card className="bg-card/40 border-white/5 h-[600px]">
                    <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                    <CardContent className="space-y-3">
                        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    if (error) {
        return (
            <div className="flex items-center justify-center p-8 min-h-[50vh]">
                <div className="p-6 rounded-2xl bg-[#f15c6d]/10 border border-[#f15c6d]/20 text-[#f15c6d] text-sm font-medium">{error}</div>
            </div>
        );
    }

    if (isLoading || !aiSummary) return <InsightsSkeleton />;

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
        <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="container mx-auto py-6 space-y-6 max-w-6xl pb-20 px-4"
        >
            {/* Header Section */}
            <motion.div variants={fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <Brain className="text-primary w-6 h-6" />
                        AI Analysis Engine
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium">
                        Sophisticated behavioral synthesis and linguistic patterns
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" />
                    Llama 3.1 Pro
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Side: Summary & Archetypes */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Core Narrative */}
                    <motion.div variants={fadeUp}>
                        <Card className="bg-card/40 border-white/5 shadow-xl">
                            <CardHeader className="pb-3 pt-4 px-6">
                                <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                                    <Quote className="w-4 h-4 text-primary" />
                                    Linguistic Narrative
                                </CardTitle>
                                <CardDescription className="text-[10px]">Relationship dynamic and context overview</CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <p className="text-sm sm:text-base text-[#e9edef] leading-relaxed italic pr-4">
                                        "{summary}"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Behavioral Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

                        {/* Sentiment Spectrum */}
                        <motion.div variants={fadeUp} className="h-full">
                            <Card className="h-full bg-card/40 border-white/5">
                                <CardHeader className="pb-2 pt-4 px-6">
                                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Heart className="w-3 h-3 text-rose-500" />
                                        Sentiment Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-2 px-6 pb-6">
                                    {sentiments.map((s) => (
                                        <div key={s.label} className="space-y-1.5">
                                            <div className="flex justify-between text-[10px] font-bold">
                                                <span className="text-[#e9edef] flex items-center gap-1.5 opacity-70">
                                                    <s.icon size={10} style={{ color: s.color }} />
                                                    {s.label}
                                                </span>
                                                <span style={{ color: s.color }}>{s.value}%</span>
                                            </div>
                                            <Progress
                                                value={s.value}
                                                className="h-1.5 bg-white/5"
                                            />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Tone & Style */}
                        <motion.div variants={fadeUp} className="h-full">
                            <Card className="h-full bg-card/40 border-white/5">
                                <CardHeader className="pb-2 pt-4 px-6">
                                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Zap className="w-3 h-3 text-amber-500" />
                                        Style mechanics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 pt-2 px-6 pb-6">
                                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                        <span className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-wider">Communication Tone</span>
                                        <span className="text-sm font-bold text-white capitalize">{communicationTone}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                        <span className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-wider">Relational Style</span>
                                        <span className="text-sm font-bold text-white capitalize">{relationshipStyle}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Participant Profiles */}
                    <motion.div variants={fadeUp}>
                        <Card className="bg-card/40 border-white/5">
                            <CardHeader className="pt-4 px-6 pb-2">
                                <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                                    <User className="w-4 h-4 text-emerald-500" />
                                    Participant Profiles
                                </CardTitle>
                                <CardDescription className="text-[10px]">Deep behavioral archetypes of chatters</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 px-6 pb-6">
                                {personalityProfiles && Object.entries(personalityProfiles).map(([name, data]: [string, any]) => (
                                    <div
                                        key={name}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
                                    >
                                        <Avatar className="w-8 h-8 border border-white/10 shrink-0 mt-0.5">
                                            <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs uppercase">
                                                {name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1 min-w-0 flex-1">
                                            <div className="flex items-baseline justify-between gap-2">
                                                <h4 className="text-xs font-bold text-white truncate">{name}</h4>
                                                <span className="text-[7px] font-black uppercase text-primary tracking-widest px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 shrink-0">
                                                    {data.coreTrait}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground leading-snug italic">
                                                "{data.archetype}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Right Side: Deep Insights Feed */}
                <div className="space-y-6">
                    <motion.div variants={fadeUp} className="h-full">
                        <Card className="bg-card/40 border-white/5 h-full relative overflow-hidden group">
                            <CardHeader className="pb-3 pt-4 px-6">
                                <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    Synthesized Insights
                                </CardTitle>
                                <CardDescription className="text-[10px]">Unique behavioral observations</CardDescription>
                            </CardHeader>

                            <CardContent className="px-6 pb-6 space-y-2">
                                {keyInsights.concat(mainTopics).slice(0, 8).map((insight, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all group/item"
                                    >
                                        <div className="shrink-0 flex items-center justify-center w-5 h-5 rounded-md bg-white/5 text-[8px] font-black group-hover/item:text-primary transition-colors text-muted-foreground">
                                            {idx + 1}
                                        </div>
                                        <p className="text-[11px] font-medium text-[#e9edef] leading-relaxed">
                                            {insight}
                                        </p>
                                    </div>
                                ))}

                                <Separator className="bg-white/5 my-4" />
                                <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] justify-center pt-2">
                                    <Eye className="w-3 h-3" />
                                    Analysis Complete
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
