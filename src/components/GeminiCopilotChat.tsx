import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Minimize2,
  Maximize2,
  Cpu,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { playCyberSound } from '../utils/audio';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  modelUsed?: string;
  timestamp: number;
}

export const GeminiCopilotChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [rolePreset, setRolePreset] = useState<'QUANT' | 'AUDITOR' | 'FAST_SNIPER'>('QUANT');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'model',
      text: `Greetings, Commander. I am the Apex Quantum Copilot. 
I monitor live Solana mempool transactions, cross-DEX spreads (Raydium, Orca, Meteora, Phoenix), and Jito MEV bundle routing. 
Ask me to analyze token liquidity, calculate optimal priority fees, or audit trading risk.`,
      modelUsed: 'gemini-3.8-flash',
      timestamp: Date.now() - 60000,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const roleInstructions: Record<string, string> = {
    QUANT:
      'You are the Apex Quant Strategist. Focus on Solana DEX arbitrage math, volume momentum, liquidity spreads, and Sharpe ratio optimization.',
    AUDITOR:
      'You are the Argon Deep Security Auditor. Focus on smart contract vulnerabilities, active mint/freeze authorities, honeypots, and dev wallet clustering.',
    FAST_SNIPER:
      'You are the Lite HFT Executioner. Give ultra-short, sub-second tactical numbers: optimal slippage %, micro-lamport fee, and entry trigger.',
  };

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    playCyberSound('CLICK');

    try {
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          model: selectedModel,
          roleInstruction: roleInstructions[rolePreset],
        }),
      });

      if (!res.ok) throw new Error('Copilot response failed.');
      const data = await res.json();

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply,
        modelUsed: data.modelUsed,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botReply]);
      playCyberSound('PROFIT');
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          text: 'Telemetry link interrupted. Please verify backend server state.',
          modelUsed: selectedModel,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    playCyberSound('CLICK');
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'model',
        text: 'Session history cleared. Ready for new quantitative directives.',
        modelUsed: selectedModel,
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => {
            playCyberSound('CLICK');
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-5 right-5 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-[#9945FF] via-[#7928CA] to-[#14F195] text-white font-mono font-bold text-xs flex items-center gap-2.5 shadow-2xl shadow-purple-900/60 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#14F195] absolute -top-1 -right-1 animate-ping" />
          </div>
          <span>APEX COPILOT AI</span>
          <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-[#14F195]">
            Gemini
          </span>
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div
          className={`fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 bg-[#0c111c] border border-[#232d44] rounded-2xl shadow-2xl flex flex-col transition-all overflow-hidden font-mono ${
            isMinimized
              ? 'w-72 h-14'
              : 'w-[95vw] sm:w-[460px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#1c2438] bg-[#0e1422] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#9945FF] to-[#14F195] p-0.5 flex items-center justify-center">
                <Bot className="w-4 h-4 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-xs">APEX AI COPILOT</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {selectedModel}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14F195]"></span>
                  Multi-turn Context Active
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1a2336]"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleClearHistory}
                className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-[#1a2336]"
                title="Clear conversation history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1a2336]"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Role & Model Selector Ribbon */}
              <div className="px-3 py-2 bg-[#080d16] border-b border-[#182133] flex flex-wrap items-center justify-between gap-2 text-[10px]">
                {/* Role Tabs */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">ROLE:</span>
                  {[
                    { id: 'QUANT', label: 'Quant', model: 'gemini-3.8-flash' },
                    { id: 'AUDITOR', label: 'Argon Auditor', model: 'gemini-4-argon' },
                    { id: 'FAST_SNIPER', label: 'Lite HFT', model: 'gemini-3.1-flash-lite' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRolePreset(r.id as any);
                        setSelectedModel(r.model as any);
                        playCyberSound('CLICK');
                      }}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        rolePreset === r.id
                          ? 'bg-[#9945FF] text-white font-bold'
                          : 'bg-[#151b29] text-slate-400 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <div className="text-[#00F0FF] text-[10px] font-medium">
                  {selectedModel === 'gemini-4-argon'
                    ? 'Argon Reasoning'
                    : selectedModel === 'gemini-3.1-flash-lite'
                    ? 'Sub-500ms Speed'
                    : 'Standard Quant'}
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {messages.map((m) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-6 h-6 rounded bg-[#9945FF]/20 text-[#14F195] flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                          isUser
                            ? 'bg-gradient-to-r from-[#9945FF] to-[#7928CA] text-white font-medium rounded-tr-none'
                            : 'bg-[#141b2a] text-slate-200 border border-[#212c42] rounded-tl-none font-sans text-xs'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{m.text}</div>
                        <div className="flex items-center justify-between gap-3 mt-1.5 text-[9px] text-slate-400/80 font-mono">
                          <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {m.modelUsed && <span className="text-[#00F0FF]">{m.modelUsed}</span>}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-6 h-6 rounded bg-[#1e283d] text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex gap-2.5 justify-start items-center text-xs text-slate-400">
                    <div className="w-6 h-6 rounded bg-[#9945FF]/20 text-[#14F195] flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-[#14F195]" />
                    </div>
                    <span className="italic">Apex Copilot is computing tactical parameters...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Recommended Quick Chips */}
              <div className="px-3 py-1.5 bg-[#080d16] border-t border-[#182133] flex items-center gap-1.5 overflow-x-auto text-[10px]">
                {[
                  'Recommend Jito tip for SOL snipe',
                  'Audit Raydium vs Orca spread',
                  'Explain Trailing Stop Loss mechanics',
                  'Check Solana TPS congestion',
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSend(chip)}
                    className="px-2 py-0.5 rounded bg-[#151b29] hover:bg-[#202b3f] text-slate-300 hover:text-[#14F195] whitespace-nowrap transition-colors border border-[#232d42]"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-[#0c111c] border-t border-[#1c2438] flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={`Ask ${rolePreset === 'AUDITOR' ? 'Argon Auditor' : 'Apex Copilot'}...`}
                  className="flex-1 bg-[#141b2a] border border-[#212c42] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#9945FF] transition-colors"
                />
                <button
                  disabled={loading || !input.trim()}
                  onClick={() => handleSend()}
                  className="p-2 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#14F195] text-black font-extrabold disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
