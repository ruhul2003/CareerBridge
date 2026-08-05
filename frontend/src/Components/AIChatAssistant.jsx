'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send, X, Minimize2, RefreshCw, User } from 'lucide-react';

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! 👋 I am **CareerBridge AI Assistant** powered by Gemini. Ask me about resume tips, interview prep, or career guidance!'
    }
  ]);

  const messagesEndRef = useRef(null);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${SERVER_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `⚠️ ${data.message || 'Sorry, I ran into an error generating a response. Please try again.'}` }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Network error. Please check backend server status.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "⚡ How to format a resume for ATS?",
    "🎯 Top 5 interview tips for developers",
    "💼 How to ask for a salary raise?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-full shadow-2xl shadow-indigo-500/30 transition-all transform hover:scale-105 cursor-pointer group border border-white/10"
        >
          <div className="relative">
            <Bot size={20} className="text-white group-hover:rotate-12 transition-transform" />
            <Sparkles size={10} className="absolute -top-1 -right-1 text-amber-300 animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-wide">Ask AI Assistant</span>
        </button>
      )}

      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600/90 to-violet-600/90 flex items-center justify-between border-b border-indigo-500/30 text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-xl border border-white/20">
                <Bot size={20} className="text-indigo-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm leading-none">CareerBridge AI</h3>
                  <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">Gemini 2.0</span>
                </div>
                <p className="text-[11px] text-indigo-100/80 mt-0.5">Your personal career coach</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/15 rounded-lg text-indigo-100 transition cursor-pointer"
                title="Minimize"
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} className="text-indigo-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} className="text-violet-400" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center">
                  <Bot size={14} className="text-indigo-400 animate-spin" />
                </div>
                <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl rounded-bl-none text-xs text-indigo-300 flex items-center gap-2">
                  <RefreshCw size={12} className="animate-spin text-indigo-400" />
                  Thinking with Gemini AI...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length < 3 && !loading && (
            <div className="px-4 py-2 flex flex-col gap-1.5 border-t border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Suggested topics:</span>
              <div className="flex flex-col gap-1">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-left text-[11px] text-slate-300 hover:text-indigo-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AI anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-slate-900 border border-slate-700/80 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
