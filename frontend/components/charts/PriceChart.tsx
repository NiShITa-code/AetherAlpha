"use client";

import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useWebSocket } from "@/hooks/useWebSocket";
import { API_BASE_URL } from "@/lib/api-client";
import { Activity, Wifi, WifiOff } from "lucide-react";

interface TickerData {
    symbol: string;
    price: number;
    timestamp: string;
}

export default function PriceChart({ symbol = "BTC-USD", days = 1 }: { symbol?: string, days?: number }) {
    const [data, setData] = useState<TickerData[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Fetch History when symbol or days changes
    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                // api-client needs to import { api }
                const history = await import("@/lib/api-client").then(m => m.api.get<TickerData[]>(`/market/history/${symbol}?days=${days}`));
                setData(history);
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [symbol, days]);

    const { isConnected } = useWebSocket(
        `${API_BASE_URL.replace("http", "ws")}/market/ws/${symbol}`,
        {
            onMessage: (newData: TickerData) => {
                setData((prev) => {
                    // Avoid duplicates if possible, or just append
                    // For a smooth chart, we append to history
                    const updated = [...prev, newData];
                    // Limit total points based on range to prevent memory issues?
                    // For now, keep growing or limit to ~500
                    if (updated.length > 500) updated.shift();
                    return updated;
                });
            },
        }
    );

    return (
        <div className="glass-card p-6 h-[400px] flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-4 z-10">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-xl font-bold tracking-tight text-white">{symbol}</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-mono">
                    {isConnected ? (
                        <><Wifi className="w-3 h-3 text-emerald-400" /> <span className="text-emerald-400">LIVE</span></>
                    ) : (
                        <><WifiOff className="w-3 h-3 text-rose-400" /> <span className="text-rose-400">OFFLINE</span></>
                    )}
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="timestamp"
                                hide
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                orientation="right"
                                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val: number) => `$${val.toFixed(2)}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#fff" }}
                                itemStyle={{ color: "#818cf8" }}
                                labelStyle={{ display: "none" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#818cf8"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-zinc-500">
                        Loading chart...
                    </div>
                )}
            </div>

            {!isConnected && data.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-0">
                    <p className="text-zinc-500 animate-pulse">Waiting for market data stream...</p>
                </div>
            )}
        </div>
    );
}
