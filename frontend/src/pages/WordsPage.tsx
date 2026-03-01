import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Smile, Type, Hash, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import { chatApiService } from "../services/chatApi";
import { useChatStore } from "../stores/chatStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig
} from "../components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";

import { Emoji, EmojiStyle } from "emoji-picker-react";

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function WordsPage() {
    const { sessionId, wordAnalysis, setWordAnalysis, setLoading } = useChatStore();
    const [error, setError] = useState<string | null>(null);
    const [selectedParticipant, setSelectedParticipant] = useState<string>("global");

    useEffect(() => {
        async function fetchWords() {
            if (!sessionId || wordAnalysis) return;
            try {
                setLoading(true);
                const res = await chatApiService.getWordAnalysis(sessionId);
                if (res.success && res.data) setWordAnalysis(res.data);
                else setError(res.message);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchWords();
    }, [sessionId, wordAnalysis, setWordAnalysis, setLoading]);

    const activeWords = useMemo(() => {
        if (!wordAnalysis) return [];
        if (selectedParticipant === "global") {
            return wordAnalysis.topWords.slice(0, 15);
        }
        return (wordAnalysis.perSenderWords[selectedParticipant] || []).slice(0, 15);
    }, [wordAnalysis, selectedParticipant]);

    const activeEmojis = useMemo(() => {
        if (!wordAnalysis) return [];
        if (selectedParticipant === "global") {
            return wordAnalysis.emojiFrequency.slice(0, 16);
        }
        return (wordAnalysis.perSenderEmojis[selectedParticipant] || []).slice(0, 16);
    }, [wordAnalysis, selectedParticipant]);

    const participants = useMemo(() => {
        if (!wordAnalysis) return [];
        return Object.keys(wordAnalysis.perSenderWords);
    }, [wordAnalysis]);

    if (error) {
        return (
            <div className="flex items-center justify-center p-8 min-h-[50vh]">
                <div className="p-6 rounded-2xl bg-[#f15c6d]/10 border border-[#f15c6d]/20 text-[#f15c6d] font-medium text-sm">{error}</div>
            </div>
        );
    }
    if (!wordAnalysis) return null;

    const chartConfig: ChartConfig = {
        count: {
            label: "Occurrences",
            color: "#00a884",
        },
    };

    return (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8 pb-12">

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-1">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Linguistic Insights</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground/60 font-medium mt-1">Deep dive into vocabulary & emoji patterns</p>
                </div>

                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 w-full sm:w-auto">
                    <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
                        <SelectTrigger className="w-full sm:w-[200px] h-11 sm:h-10 rounded-xl bg-secondary/50 border-white/5 shadow-xl backdrop-blur-md">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <Users size={14} className="text-primary shrink-0" />
                                <SelectValue placeholder="Select Context" className="truncate" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl bg-[#1c1c21] border-white/10 max-w-[90vw]">
                            <SelectItem value="global" className="focus:bg-primary/20">Global Chat</SelectItem>
                            {participants.map(p => (
                                <SelectItem key={p} value={p} className="focus:bg-primary/20 capitalize truncate">{p}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 bg-secondary/50 backdrop-blur-md border border-white/5 rounded-xl px-5 h-11 sm:h-10 shadow-xl group hover:bg-secondary/70 transition-all flex-1 sm:flex-none justify-center xs:justify-start">
                        <Type size={14} className="text-primary" />
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest whitespace-nowrap">Avg Len:</span>
                            <span className="font-black text-sm tabular-nums text-primary/90">
                                {selectedParticipant === "global"
                                    ? Math.round(wordAnalysis.avgMessageLength)
                                    : Math.round(wordAnalysis.perSenderAvgLength[selectedParticipant] || 0)
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Top Words Chart */}
                <motion.div variants={fadeUp}>
                    <Card className="bg-card/40 border-white/5 backdrop-blur-xl rounded-2xl h-full shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-2 p-4 sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-black tracking-tight">
                                    <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 shadow-inner shrink-0">
                                        <MessageCircle size={16} className="text-primary" />
                                    </div>
                                    <span className="truncate">Top Used Words</span>
                                </CardTitle>
                                <span className="text-[9px] sm:text-[10px] font-black text-primary/60 bg-primary/10 px-2 sm:px-3 py-1 rounded-lg uppercase tracking-widest shrink-0">
                                    Top 15
                                </span>
                            </div>
                            <CardDescription className="text-[9px] sm:text-[10px] text-muted-foreground/50 uppercase font-bold tracking-widest mt-1 truncate">
                                {selectedParticipant === "global" ? "Full conversation vocabulary" : `Personal vocabulary: ${selectedParticipant}`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 sm:pt-8 px-2 sm:px-6">
                            <ChartContainer config={chartConfig} className="h-[400px] sm:h-[480px] w-full">
                                <BarChart
                                    data={activeWords}
                                    layout="vertical"
                                    margin={{ left: -20, right: 10, top: 0, bottom: 0 }}
                                >
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="word"
                                        type="category"
                                        tickLine={false}
                                        axisLine={false}
                                        stroke="#8696a0"
                                        fontSize={10}
                                        width={85}
                                        className="capitalize font-bold tabular-nums"
                                    />
                                    <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                                    <Bar
                                        dataKey="count"
                                        radius={[0, 6, 6, 0]}
                                        barSize={28}
                                    >
                                        {activeWords.map((_, index: number) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill="var(--color-count)"
                                                fillOpacity={index < 3 ? 1 : 0.4 + (1 - index / 15) * 0.4}
                                                className="transition-all duration-500"
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Emoji Leaderboard */}
                <motion.div variants={fadeUp}>
                    <Card className="bg-card/40 border-white/5 backdrop-blur-xl rounded-2xl h-full shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-2 p-4 sm:p-6">
                            <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-black tracking-tight">
                                <div className="p-2 sm:p-2.5 rounded-xl bg-orange-500/10 shadow-inner shrink-0">
                                    <Smile size={16} className="text-orange-500" />
                                </div>
                                Emoji Sentiment
                            </CardTitle>
                            <CardDescription className="text-[9px] sm:text-[10px] text-muted-foreground/50 uppercase font-bold tracking-widest mt-1">
                                Top expressive icons in this context
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 sm:pt-8 px-4 sm:px-6">
                            {activeEmojis.length === 0 ? (
                                <div className="flex flex-col items-center gap-4 py-20 text-center">
                                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                                        <Hash size={32} className="text-muted-foreground/20" />
                                    </div>
                                    <p className="text-muted-foreground/40 font-bold text-sm uppercase tracking-widest">No emojis detected</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3">
                                    {activeEmojis.map((emojiObj: any, idx: number) => (
                                        <motion.div
                                            key={idx}
                                            variants={fadeUp}
                                            whileHover={{ scale: 1.02, translateY: -2 }}
                                            className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-default overflow-hidden group/emoji ${idx === 0
                                                ? "bg-primary/10 border-primary/20 shadow-xl shadow-primary/5"
                                                : "bg-[#1c1c21]/50 border-white/5 hover:border-primary/20 hover:bg-primary/5"
                                                }`}
                                        >
                                            <div className="relative z-10 flex flex-col items-center gap-3">
                                                <div className="filter drop-shadow-lg transform transition-transform group-hover/emoji:scale-110 duration-300">
                                                    <Emoji
                                                        unified={Array.from(emojiObj.emoji).map((c: any) => c.codePointAt(0).toString(16)).join("-")}
                                                        emojiStyle={EmojiStyle.APPLE}
                                                        size={42}
                                                    />
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mb-0.5">Count</span>
                                                    <span className="text-lg font-black tracking-tight tabular-nums text-white/90">{emojiObj.count}</span>
                                                </div>
                                            </div>

                                            {idx === 0 && (
                                                <div className="absolute top-3 right-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                </div>
                                            )}

                                            {/* Rank badge */}
                                            <div className="absolute top-3 left-3 bg-white/5 w-6 h-6 rounded-lg flex items-center justify-center border border-white/5">
                                                <span className="text-[10px] font-black text-muted-foreground/60">#{idx + 1}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
