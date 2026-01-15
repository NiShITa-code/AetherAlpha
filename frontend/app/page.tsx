"use client";

import PriceChart from "@/components/charts/PriceChart";
import NewsFeed from "@/components/news/NewsFeed";
import ChatInterface from "@/components/ai/ChatInterface";
import { Zap, Search, Bell } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [symbol, setSymbol] = useState("BTC-USD");
  const [searchInput, setSearchInput] = useState("");
  const [timeRange, setTimeRange] = useState(1); // Default 1 day (24H)

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      setSymbol(searchInput.toUpperCase());
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-white selection:bg-indigo-500/30">
      {/* ... Header ... */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between">
        {/* ... existing header content ... */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="text-white fill-white" size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            AetherAlpha
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-zinc-300 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search tickers (e.g. ETH-USD)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-zinc-900/50 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64 transition-all"
            />
          </div>
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors relative">
            <Bell size={18} className="text-zinc-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-zinc-950"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-tr from-indigo-500/20 to-rose-500/20 flex items-center justify-center text-xs font-bold">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Charts (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-100">Live Market Data</h2>
              <div className="flex gap-1 bg-zinc-900/50 p-1 rounded-lg border border-white/5">
                <button
                  onClick={() => setTimeRange(1)}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${timeRange === 1 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                  24H
                </button>
                <button
                  onClick={() => setTimeRange(7)}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${timeRange === 7 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                  7D
                </button>
                <button
                  onClick={() => setTimeRange(30)}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${timeRange === 30 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                  30D
                </button>
              </div>
            </div>
            <PriceChart symbol={symbol} days={timeRange} />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Secondary Charts or Stats could go here */}
            <div className="glass-card p-4 flex flex-col justify-between h-32">
              <span className="text-zinc-500 text-xs font-mono">VOLATILITY INDEX</span>
              <div className="text-2xl font-bold text-rose-400">HIGH</div>
              <div className="text-xs text-rose-400/70">+12.5% vs avg</div>
            </div>
            <div className="glass-card p-4 flex flex-col justify-between h-32">
              <span className="text-zinc-500 text-xs font-mono">MARKET SENTIMENT</span>
              <div className="text-2xl font-bold text-emerald-400">BULLISH</div>
              <div className="text-xs text-emerald-400/70">Driven by Tech Sector</div>
            </div>
          </section>
        </div>

        {/* Right Column: News & AI */}
        <div className="space-y-6">
          <section className="h-full flex flex-col">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <span>AI Intelligence Feed</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-mono">LIVE</span>
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 150px)' }}>
              <NewsFeed />
            </div>
          </section>

          <section>
            <ChatInterface />
          </section>
        </div>

      </div>
    </main>
  );
}
