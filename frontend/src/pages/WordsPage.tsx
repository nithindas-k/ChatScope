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

            {/* Page Header */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Linguistic Insights</h2>
                    <p className="text-muted-foreground/60 font-medium mt-1">Deep dive into vocabulary & emoji patterns</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
                        <SelectTrigger className="w-[180px] h-10 rounded-xl bg-secondary/50 border-white/5 shadow-xl backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-primary" />
                                <SelectValue placeholder="Select Context" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl bg-[#1c1c21] border-white/10">
                            <SelectItem value="global" className="focus:bg-primary/20">Global Chat</SelectItem>
                            {participants.map(p => (
                                <SelectItem key={p} value={p} className="focus:bg-primary/20 capitalize">{p}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-3 bg-card/40 backdrop-blur-md border border-white/5 rounded-xl px-4 py-2 h-10 shadow-xl">
                        <Type size={16} className="text-primary" />
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.1em]">Avg Length</p>
                            <p className="font-black text-sm tabular-nums">
                                {selectedParticipant === "global"
                                    ? wordAnalysis.avgMessageLength
                                    : (wordAnalysis.perSenderAvgLength[selectedParticipant] || 0)
                                } <span className="text-muted-foreground/40 font-bold text-[9px]">CHARS</span>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Top Words Chart */}
                <motion.div variants={fadeUp}>
                    <Card className="bg-card/40 border-white/5 backdrop-blur-xl rounded-2xl h-full shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-3 text-lg font-black tracking-tight">
                                    <div className="p-2.5 rounded-xl bg-primary/10 shadow-inner">
                                        <MessageCircle size={18} className="text-primary" />
                                    </div>
                                    Top Most Used Words
                                </CardTitle>
                                <span className="text-[10px] font-black text-primary/60 bg-primary/10 px-3 py-1 rounded-lg uppercase tracking-widest">
                                    Top 15
                                </span>
                            </div>
                            <CardDescription className="text-[10px] text-muted-foreground/50 uppercase font-bold tracking-widest mt-1">
                                {selectedParticipant === "global" ? "Full conversation vocabulary" : `Personal vocabulary for ${selectedParticipant}`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <ChartContainer config={chartConfig} className="h-[480px] w-full">
                                <BarChart
                                    data={activeWords}
                                    layout="vertical"
                                    margin={{ left: -10, right: 20 }}
                                >
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="word"
                                        type="category"
                                        tickLine={false}
                                        axisLine={false}
                                        stroke="#8696a0"
                                        fontSize={12}
                                        width={110}
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
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-3 text-lg font-black tracking-tight">
                                <div className="p-2.5 rounded-xl bg-orange-500/10 shadow-inner">
                                    <Smile size={18} className="text-orange-500" />
                                </div>
                                Emoji Sentiment
                            </CardTitle>
                            <CardDescription className="text-[10px] text-muted-foreground/50 uppercase font-bold tracking-widest mt-1">
                                Top expressive icons in this context
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 px-6">
                            {activeEmojis.length === 0 ? (
                                <div className="flex flex-col items-center gap-4 py-20 text-center">
                                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                                        <Hash size={32} className="text-muted-foreground/20" />
                                    </div>
                                    <p className="text-muted-foreground/40 font-bold text-sm uppercase tracking-widest">No emojis detected</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-4">
                                    {activeEmojis.map((emojiObj: any, idx: number) => (
                                        <motion.div
                                            key={idx}
                                            variants={fadeUp}
                                            whileHover={{ scale: 1.05, translateY: -4 }}
                                            className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border transition-all cursor-default overflow-hidden group/emoji ${idx === 0
                                                ? "bg-primary/10 border-primary/20 shadow-xl shadow-primary/5"
                                                : "bg-white/[0.02] border-white/5 hover:border-primary/20 hover:bg-primary/5"
                                                }`}
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/emoji:opacity-100 transition-opacity`} />
                                            <span className="text-4xl leading-none mb-3 drop-shadow-xl z-10 filter group-hover/emoji:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all">
                                                {emojiObj.emoji}
                                            </span>
                                            <span className="text-base font-black tracking-tighter tabular-nums z-10">{emojiObj.count}</span>
                                            {idx === 0 && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                </div>
                                            )}
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
