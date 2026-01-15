"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { TrendingUp, TrendingDown, Minus, ExternalLink, Bot } from "lucide-react";

interface NewsItem {
    id: string;
    title: string;
    source: string;
    published_at: string;
    sentiment_score: number;
    sentiment_label: "Bullish" | "Bearish" | "Neutral";
    summary?: string;
}

export default function NewsFeed() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await api.get<NewsItem[]>("/news?limit=5");
                setNews(data);
            } catch (e) {
                console.error("Failed to fetch news", e);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const getSentimentBadge = (label: string) => {
        switch (label) {
            case "Bullish":
                return <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20"><TrendingUp size={12} /> BULLISH</span>;
            case "Bearish":
                return <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-400/10 px-2 py-1 rounded-md border border-rose-400/20"><TrendingDown size={12} /> BEARISH</span>;
            default:
                return <span className="flex items-center gap-1 text-xs font-bold text-zinc-400 bg-zinc-400/10 px-2 py-1 rounded-md border border-zinc-400/20"><Minus size={12} /> NEUTRAL</span>;
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card p-4 h-24 animate-pulse bg-zinc-800/50"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {news.map((item) => (
                <div key={item.id} className="glass-card p-5 hover:bg-zinc-800/80 transition-all duration-300 group cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider">{item.source}</span>
                        {getSentimentBadge(item.sentiment_label)}
                    </div>
                    <h3 className="text-sm font-medium text-zinc-100 leading-snug group-hover:text-indigo-300 transition-colors mb-3">
                        {item.title}
                    </h3>

                    <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-3">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Bot size={14} className="text-indigo-400" />
                            <span>AI Confidence: {Math.abs(item.sentiment_score * 100).toFixed(0)}%</span>
                        </div>
                        <ExternalLink size={14} className="text-zinc-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}
