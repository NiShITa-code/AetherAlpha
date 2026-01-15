"use client";

import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { api } from "@/lib/api-client";

export default function ChatInterface() {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: 'Hello! I am Aether AI. Ask me about market correlations or news sentiment.' }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await api.post<{ response: string }>("/chat/", {
                body: JSON.stringify({ message: input })
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.response
            }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting to the AI service right now."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-card flex flex-col h-[400px] border border-white/5 shadow-2xl shadow-indigo-500/10">
            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/5 backdrop-blur-md">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Bot size={16} className="text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm text-zinc-100">Aether Assistant</h3>
                    <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Online
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar scroll-smooth">
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${m.role === 'user' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20' : 'bg-zinc-800 text-zinc-400 border border-white/5'}`}>
                            {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm max-w-[85%] leading-relaxed shadow-sm ${m.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-zinc-800/80 text-zinc-300 rounded-tl-none border border-white/5'
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3 animate-in fade-in duration-300">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 border border-white/5 flex items-center justify-center flex-shrink-0">
                            <Bot size={14} />
                        </div>
                        <div className="bg-zinc-800/80 p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask market questions..."
                        disabled={isLoading}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-full py-3 pl-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 shadow-inner"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-1.5 top-1.5 p-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-full text-white transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
