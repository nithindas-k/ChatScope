import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    AreaChart, Area, XAxis, YAxis,
    BarChart, Bar, Cell, PieChart, Pie, Sector, Label
} from "recharts";
import { Activity, Clock, PieChart as PieIcon, TrendingUp } from "lucide-react";
import { useChatStore } from "../stores/chatStore";
import { Skeleton } from "../components/ui/skeleton";
import { CHART_COLORS } from "../constants/appConstants";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartStyle,
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
    visible: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function ActivityPage() {
    const { analysis, isLoading } = useChatStore();

    const ActivitySkeleton = () => (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 rounded" />
                    <Skeleton className="h-4 w-64 rounded" />
                </div>
                <Skeleton className="h-12 w-32 rounded-xl" />
            </div>

            <Card className="p-6 bg-card/40 border-white/[0.05]">
                <Skeleton className="h-6 w-40 mb-6" />
                <Skeleton className="h-[300px] w-full rounded-xl" />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 bg-card/40 border-white/[0.05]">
                    <Skeleton className="h-6 w-48 mb-6" />
                    <Skeleton className="h-[250px] w-full rounded-xl" />
                </Card>
                <Card className="p-6 bg-card/40 border-white/[0.05]">
                    <div className="flex justify-between items-center mb-6">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-8 w-32 rounded-xl" />
                    </div>
                    <div className="flex justify-center items-center h-[250px]">
                        <Skeleton className="h-48 w-48 rounded-full" />
                    </div>
                </Card>
            </div>
        </div>
    );

    if (isLoading || !analysis) return <ActivitySkeleton />;

    const { activity } = analysis;


    const activeData = useMemo(() => {
        return activity.messagesPerUser.map((item, idx) => ({
            ...item,
            fill: `var(--color-${idx})`,
            key: `sender-${idx}`
        }));
    }, [activity.messagesPerUser]);

    const [activeKey, setActiveKey] = useState(activeData[0]?.key || "");

    const activeIndex = useMemo(
        () => activeData.findIndex((item) => item.key === activeKey),
        [activeData, activeKey]
    )

    const pieConfig = useMemo(() => {
        const config: ChartConfig = {
            count: { label: "Messages" }
        };
        activity.messagesPerUser.forEach((_, idx) => {
            config[idx] = {
                color: CHART_COLORS[idx % CHART_COLORS.length]
            };
        });
        return config;
    }, [activity.messagesPerUser]);

    // --- Others ---
    const peakHour = activity.messagesPerHour.reduce((max: any, h: any) => h.count > max.count ? h : max, { count: 0 });

    const timelineConfig: ChartConfig = {
        count: {
            label: "Messages",
            color: "#00a884",
        },
    };

    const hourConfig: ChartConfig = {
        count: {
            label: "Volume",
            color: "#00a884",
        },
    };

    const chartId = "sender-distribution-pie";

    return (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8 pb-12">

            {/* Page Header */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Activity Analysis</h2>
                    <p className="text-muted-foreground mt-1">Timeline, hourly patterns & distribution</p>
                </div>
                <div className="flex items-center gap-3 bg-secondary border border-border rounded-xl px-4 py-2.5 w-fit">
                    <TrendingUp size={16} className="text-primary" />
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Peak Hour</p>
                        <p className="font-bold text-sm">{peakHour.hour}:00</p>
                    </div>
                </div>
            </motion.div>

            {/* Area Chart - Messages over Time */}
            <motion.div variants={fadeUp}>
                <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
                    <CardHeader className="pb-0">
                        <CardTitle className="flex items-center gap-3 text-base">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Activity size={16} className="text-primary" />
                            </div>
                            Messages Over Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ChartContainer config={timelineConfig} className="h-[300px] w-full">
                            <AreaChart data={activity.messagesPerDay} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#8696a0" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                                <YAxis stroke="#8696a0" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                                <Area type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2.5} fillOpacity={1} fill="url(#areaGrad)" dot={false} activeDot={{ r: 5, fill: "var(--color-count)" }} />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Bottom Row - Bar + Pie */}
            <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Hourly Bar Chart */}
                <motion.div variants={fadeUp}>
                    <Card className="h-full border-border/50 bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
                        <CardHeader className="pb-0">
                            <CardTitle className="flex items-center gap-3 text-base">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Clock size={16} className="text-primary" />
                                </div>
                                Hourly Activity (24h)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ChartContainer config={hourConfig} className="h-[300px] w-full">
                                <BarChart data={activity.messagesPerHour} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="hour" stroke="#8696a0" fontSize={10} tickFormatter={(h) => `${h}h`} tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis stroke="#8696a0" fontSize={10} tickLine={false} axisLine={false} tickMargin={8} />
                                    <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={20}>
                                        {activity.messagesPerHour.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill="var(--color-count)" fillOpacity={entry.count > (peakHour.count * 0.5) ? 1 : 0.4} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Interactive Pie Chart */}
                <motion.div variants={fadeUp}>
                    <Card data-chart={chartId} className="h-full border-border/50 bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                        <ChartStyle id={chartId} config={pieConfig} />
                        <CardHeader className="flex-row items-center justify-between pb-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <PieIcon size={16} className="text-primary" />
                                </div>
                                <div className="grid gap-0.5">
                                    <CardTitle className="text-base">Sender Distribution</CardTitle>
                                    <CardDescription className="text-[10px] uppercase font-bold tracking-tighter">Share by total messages</CardDescription>
                                </div>
                            </div>
                            <Select value={activeKey} onValueChange={setActiveKey}>
                                <SelectTrigger className="h-8 w-[140px] rounded-xl bg-secondary/50 border-white/5 text-xs">
                                    <SelectValue placeholder="Select Sender" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl bg-[#1c1c21] border-white/10">
                                    {activeData.map((sender, idx) => (
                                        <SelectItem key={sender.key} value={sender.key} className="text-xs focus:bg-primary/20">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                                                {sender.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="flex-1 flex justify-center pb-0 pt-4">
                            <ChartContainer id={chartId} config={pieConfig} className="mx-auto aspect-square w-full max-w-[280px]">
                                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Pie
                                        data={activeData}
                                        dataKey="count"
                                        nameKey="name"
                                        innerRadius={65}
                                        outerRadius={85}
                                        strokeWidth={5}
                                        {...({
                                            activeIndex,
                                            activeShape: ({ outerRadius = 0, ...props }: any) => (
                                                <g>
                                                    <Sector {...props} outerRadius={outerRadius + 10} />
                                                    <Sector
                                                        {...props}
                                                        outerRadius={outerRadius + 25}
                                                        innerRadius={outerRadius + 12}
                                                    />
                                                </g>
                                            )
                                        } as any)}
                                    >
                                        <Label
                                            content={({ viewBox }) => {
                                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                    const selected = activeData[activeIndex];
                                                    return (
                                                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-white text-3xl font-black tabular-nums">
                                                                {selected?.count.toLocaleString()}
                                                            </tspan>
                                                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-[10px] font-black uppercase tracking-widest">
                                                                Messages
                                                            </tspan>
                                                        </text>
                                                    );
                                                }
                                            }}
                                        />
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
