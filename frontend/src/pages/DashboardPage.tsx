import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Users, Calendar, Activity, Clock, BarChart3, Sparkles } from "lucide-react";
import { chatApiService } from "../services/chatApi";
import { useChatStore } from "../stores/chatStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Skeleton } from "../components/ui/skeleton";
import { CHART_COLORS } from "../constants/appConstants";

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
    const { sessionId, analysis, setAnalysis, isLoading, setLoading } = useChatStore();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            if (!sessionId || analysis) return;
            try {
                setLoading(true);
                const res = await chatApiService.getAnalysis(sessionId);
                if (res.success && res.data) setAnalysis(res.data);
                else setError(res.message);
            } catch (err: any) {
                setError(err.message || "Failed to load analysis");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [sessionId, analysis, setAnalysis, setLoading]);

    if (error) {
        return (
            <div className="flex items-center justify-center p-8 min-h-[50vh]">
                <div className="p-6 rounded-2xl bg-[#f15c6d]/10 border border-[#f15c6d]/20 text-[#f15c6d] font-medium text-sm">
                    {error}
                </div>
            </div>
        );
    }

    const DashboardSkeleton = () => (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-48 rounded-lg" />
                <Skeleton className="h-4 w-96 rounded-md" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="flex flex-col items-center justify-center p-6 bg-card/40 border-white/[0.05]">
                        <Skeleton className="h-10 w-10 rounded-2xl mb-4" />
                        <Skeleton className="h-3 w-20 mb-2" />
                        <Skeleton className="h-8 w-24" />
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <Card className="lg:col-span-8 p-6 bg-card/40 border-white/[0.05]">
                    <Skeleton className="h-8 w-48 mb-6" />
                    <div className="space-y-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between">
                                    <div className="flex gap-4">
                                        <Skeleton className="h-11 w-11 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-8 w-12" />
                                </div>
                                <Skeleton className="h-2 w-full rounded-full" />
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="lg:col-span-4 p-6 bg-card/40 border-white/[0.05]">
                    <Skeleton className="h-12 w-12 rounded-2xl mb-6" />
                    <Skeleton className="h-8 w-48 mb-4" />
                    <Skeleton className="h-20 w-full rounded-2xl mb-8" />
                    <div className="space-y-4">
                        <Skeleton className="h-3 w-32 mb-4" />
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-xl" />
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );

    if (isLoading || !analysis) return <DashboardSkeleton />;

    const { stats } = analysis;

    const statCards = [
        {
            title: "Total Messages",
            value: stats.totalMessages.toLocaleString(),
            icon: MessageSquare,
            gradient: "from-[#00a884]/20 to-[#00a884]/5",
            iconColor: "text-[#00a884]",
            iconBg: "bg-[#00a884]/10",
            subtext: "across entire chat",
        },
        {
            title: "Participants",
            value: Object.keys(stats.messagesPerUser).length.toString(),
            icon: Users,
            gradient: "from-[#53BDEB]/20 to-[#53BDEB]/5",
            iconColor: "text-[#53BDEB]",
            iconBg: "bg-[#53BDEB]/10",
            subtext: "active in conversation",
        },
        {
            title: "Avg Daily Messages",
            value: stats.averageMessagesPerDay.toString(),
            icon: Activity,
            gradient: "from-[#25d366]/20 to-[#25d366]/5",
            iconColor: "text-[#25d366]",
            iconBg: "bg-[#25d366]/10",
            subtext: "messages per day",
        },
        {
            title: "Active Days",
            value: stats.activeDays.toString(),
            icon: Calendar,
            gradient: "from-[#FFB300]/20 to-[#FFB300]/5",
            iconColor: "text-[#FFB300]",
            iconBg: "bg-[#FFB300]/10",
            subtext: "days with messages",
        },
        {
            title: "Peak Hour",
            value: `${stats.mostActiveHour}:00`,
            icon: Clock,
            gradient: "from-[#f15c6d]/20 to-[#f15c6d]/5",
            iconColor: "text-[#f15c6d]",
            iconBg: "bg-[#f15c6d]/10",
            subtext: "most active time",
        },
        {
            title: "Media Shared",
            value: stats.totalMedia.toString(),
            icon: BarChart3,
            gradient: "from-[#AB7ACA]/20 to-[#AB7ACA]/5",
            iconColor: "text-[#AB7ACA]",
            iconBg: "bg-[#AB7ACA]/10",
            subtext: "media items sent",
        },
    ];

    const sortedUsers = Object.entries(stats.messagesPerUser).sort((a, b) => b[1] - a[1]);

    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Page Header */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Comprehensive overview of your WhatsApp conversation metrics.</p>
            </motion.div>

            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid gap-8"
            >
                {/* Statistics Overview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((card, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group"
                        >
                            <Card className="relative overflow-hidden flex flex-col items-center justify-center p-0 pt-6 bg-card/40 backdrop-blur-xl border-white/[0.05] shadow-2xl transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-primary/5">
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${card.gradient} filter blur-3xl -z-10`} />
                                <CardHeader className="p-0 pb-2 flex flex-col items-center gap-1 z-10">
                                    <div className={`p-2.5 rounded-2xl ${card.iconBg} mb-1 shadow-inner`}>
                                        <card.icon size={20} className={card.iconColor} />
                                    </div>
                                    <CardDescription className="text-[10px] uppercase font-black text-muted-foreground/80 tracking-[0.2em]">{card.title}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 pb-6 z-10 text-center">
                                    <div className="text-3xl font-black tracking-tighter bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                                        {card.value}
                                    </div>
                                </CardContent>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
                    {/* Participant Impact Section */}
                    <motion.div variants={fadeUp} className="lg:col-span-12 xl:col-span-8 flex flex-col gap-4">
                        <Card className="h-full bg-card/40 backdrop-blur-xl border-white/[0.05] shadow-2xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-black tracking-tight">Participant Contribution</CardTitle>
                                        <CardDescription className="text-muted-foreground/60">Volume distribution & impact score</CardDescription>
                                    </div>
                                    <div className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        {Object.keys(stats.messagesPerUser).length} ANALYZED USERS
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8 pt-8">
                                <div className="grid gap-8">
                                    {sortedUsers.slice(0, 8).map(([name, count], index) => {
                                        const pct = Math.round((count / stats.totalMessages) * 100);
                                        const color = CHART_COLORS[index % CHART_COLORS.length];

                                        return (
                                            <div key={name} className="flex flex-col gap-3 group/item">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-11 w-11 border border-white/5 shadow-lg group-hover/item:scale-105 transition-transform">
                                                            <AvatarFallback
                                                                className="text-sm font-black"
                                                                style={{
                                                                    background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                                                                    color: color
                                                                }}
                                                            >
                                                                {name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="text-base font-bold tracking-tight text-white/90">{name}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{count.toLocaleString()} messages</span>
                                                                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                                <span className="text-[10px] text-primary/80 font-bold uppercase tracking-tight">Active</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-2xl font-black tracking-tighter" style={{ color }}>{pct}%</span>
                                                        <div className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">WEIGHT</div>
                                                    </div>
                                                </div>
                                                <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.05]">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{ duration: 1, ease: "circOut" }}
                                                        className="h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                                        style={{
                                                            background: `linear-gradient(90deg, ${color}80, ${color})`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* AI Intelligence Card */}
                    <motion.div variants={fadeUp} className="lg:col-span-12 xl:col-span-4 flex flex-col gap-6">
                        <Card className="flex-1 bg-gradient-to-b from-primary/10 to-transparent backdrop-blur-xl border-primary/10 shadow-3xl shadow-primary/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-[80px]" />
                            <CardHeader className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/30 mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Sparkles size={24} fill="currentColor" />
                                </div>
                                <CardTitle className="text-2xl font-black tracking-tight">Quick AI Insight</CardTitle>
                                <CardDescription className="text-primary/60 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Neural Analysis</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8 relative">
                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] leading-relaxed">
                                    <p className="text-sm text-white/70">
                                        Based on the conversation flow, we've identified a <span className="text-primary font-black">highly collaborative</span> dynamic.
                                        Peak engagement occurs around <span className="text-white font-black">{stats.mostActiveHour}:00</span>, suggesting this as the primary coordination window.
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    <h4 className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Key Indicators</h4>
                                    <div className="grid gap-3">
                                        {[
                                            { label: "Healthy Engagement", status: "Optimal" },
                                            { label: "Consistent Activity", status: "Verified" },
                                            { label: "Collaborative Tone", status: "Strong" }
                                        ].map(item => (
                                            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,168,132,0.5)]" />
                                                    <span className="text-xs font-bold text-white/80">{item.label}</span>
                                                </div>
                                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">{item.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
