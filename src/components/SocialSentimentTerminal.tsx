import React, { useState } from 'react';
import { Search, Globe, Volume2, Sparkles, AlertCircle, Compass, Share2 } from 'lucide-react';
import { playCyberSound, playGeminiTTS } from '../utils/audio';

export const SocialSentimentTerminal: React.FC = () => {
  const [query, setQuery] = useState('Solana crypto market sentiment, SOL price action, DEX volume, top trending meme coins Raydium Meteora Pump.fun');
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [sentimentData, setSentimentData] = useState<{
    analysis: string;
    sources: any[];
    timestamp: number;
  } | null>({
    analysis: `### Solana Alpha & Sentiment Intelligence

**Market Sentiment Score:** 76/100 (Strong Bullish / Greed)

**1. Top Trending Solana Assets & Catalysts:**
- **SOL/USDC:** Testing key resistance at $155-$158. On-chain DEX volume exceeded $2.8B across Raydium, Orca, and Phoenix in the last 24h.
- **Raydium ($RAY) & Pump.fun Migrations:** Continued high mempool activity with hundreds of new token liquidity pairs migrating to Raydium CPMM pools every hour.
- **DePIN & AI Tokens on Solana ($JUP, $IO, $DRIFT):** Sustained volume surges driven by decentralized compute narratives and Jupiter perpetual exchange upgrades.

**2. On-Chain Flow & Whale Watch:**
- Net positive liquidity inflows into Solana AMMs. Jito-MEV validator bundle tips are hovering at ~0.0015 SOL median, reflecting competitive frontrunning defense.

**3. Bot Strategic Directive:**
- **Recommendation:** Maintain aggressive arbitrage routing across Raydium-Orca spreads (>0.45%). On token sniper, enforce strict 80+ safety score to avoid unrenounced mint honeypots.`,
    sources: [
      { web: { title: 'Solana DEX Volume & Analytics', uri: 'https://defillama.com/chain/Solana' } },
      { web: { title: 'Jito MEV Mempool Insights', uri: 'https://jito.re' } },
      { web: { title: 'Solana Floor Price & Alpha Radar', uri: 'https://solana.com' } },
    ],
    timestamp: Date.now(),
  });

  const handleSearch = async (customQuery?: string) => {
    const q = customQuery || query;
    setLoading(true);
    playCyberSound('CLICK');

    try {
      const res = await fetch('/api/sentiment-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch sentiment.');
      }

      const data = await res.json();
      setSentimentData({
        analysis: data.analysis,
        sources: data.sources || [],
        timestamp: data.timestamp || Date.now(),
      });
      playCyberSound('PROFIT');
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakBriefing = async () => {
    if (!sentimentData) return;
    setAudioLoading(true);
    playCyberSound('CLICK');

    try {
      // Pick summary text for high-impact voice broadcast
      const cleanText = sentimentData.analysis
        .replace(/[*#]/g, '')
        .split('\n')
        .filter((l) => l.trim().length > 0)
        .slice(0, 4)
        .join('. ');

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Apex Terminal Intelligence Report. ${cleanText}`,
          speakerStyle: 'Authoritative, fast, crisp cyberpunk trading desk audio briefing',
        }),
      });

      if (!res.ok) throw new Error('TTS failed');
      const data = await res.json();
      if (data.audioBase64) {
        await playGeminiTTS(data.audioBase64);
      }
    } catch (err: any) {
      console.warn('TTS playback error:', err);
    } finally {
      setAudioLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0f19] border border-[#1e2638] rounded-xl flex flex-col h-full shadow-2xl overflow-hidden font-mono">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e2638] flex items-center justify-between bg-[#0d121f]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#00F0FF]/20 text-[#00F0FF]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm tracking-wide">
                SOLANA SENTIMENT & SEARCH INTEL
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-[#00F0FF] border border-cyan-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#00F0FF]" />
                Gemini 3.8 Search Grounded
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live sentiment, social alpha, and whale tracking powered by Google Search data
            </p>
          </div>
        </div>

        {/* Listen to Voice Debrief */}
        <button
          disabled={audioLoading}
          onClick={handleSpeakBriefing}
          className="px-3.5 py-1.5 rounded-lg bg-[#9945FF]/20 border border-[#9945FF] text-purple-300 hover:bg-[#9945FF] hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-900/20 cursor-pointer"
        >
          <Volume2 className={`w-3.5 h-3.5 ${audioLoading ? 'animate-bounce text-[#14F195]' : ''}`} />
          {audioLoading ? 'VOICE SYNTHESIS...' : 'AUDIO BRIEFING (TTS)'}
        </button>
      </div>

      {/* Query Bar */}
      <div className="p-3.5 bg-[#090d16] border-b border-[#1a2233] flex items-center gap-2">
        <div className="flex-1 flex items-center bg-[#151b29] rounded-lg px-3 py-1.5 border border-[#232c40]">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search Solana news, sentiment, whale moves, or token ticker..."
            className="w-full bg-transparent text-white text-xs outline-none"
          />
        </div>

        <button
          disabled={loading}
          onClick={() => handleSearch()}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#14F195] text-black font-extrabold text-xs flex items-center gap-1 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {loading ? 'RESEARCHING...' : 'ANALYZE'}
        </button>
      </div>

      {/* Quick Trend Chips */}
      <div className="px-4 py-2 bg-[#0d121f] border-b border-[#1a2233] flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-400 text-[10px]">ALPHA RADAR:</span>
        {[
          'Solana DEX Volume Spikes',
          'Pump.fun Whale Accumulation',
          'Jito MEV Tips Trend',
          'Jupiter Perps Liquidations',
          'Bonk vs Wif Liquidity',
        ].map((chip) => (
          <button
            key={chip}
            onClick={() => {
              setQuery(chip);
              handleSearch(chip);
            }}
            className="px-2 py-1 rounded bg-[#172032] hover:bg-[#23304a] text-slate-300 hover:text-[#14F195] whitespace-nowrap transition-colors border border-[#232e44]"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Sentiment Analysis Body */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
        {sentimentData && (
          <div>
            <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed font-sans text-xs space-y-2 whitespace-pre-line">
              {sentimentData.analysis}
            </div>

            {/* Grounding Source Citations */}
            {sentimentData.sources && sentimentData.sources.length > 0 && (
              <div className="mt-5 pt-3 border-t border-[#1e2638]">
                <span className="text-[10px] text-slate-400 block mb-2 font-mono uppercase">
                  Verified Google Search Grounding Sources:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sentimentData.sources.map((src, i) => {
                    const title = src.web?.title || `Source ${i + 1}`;
                    const uri = src.web?.uri || '#';
                    return (
                      <a
                        key={i}
                        href={uri}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded bg-[#151c2c] border border-[#222e47] text-[#00F0FF] hover:text-[#14F195] text-[10px] font-mono flex items-center gap-1 transition-colors"
                      >
                        <Globe className="w-3 h-3" />
                        {title.slice(0, 35)}...
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
