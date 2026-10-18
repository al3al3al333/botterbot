import React, { useState, useRef, useEffect } from 'react';
import { Zap, Sparkles, ChevronDown, Check, ShieldCheck, Gauge, Sliders, Info } from 'lucide-react';
import { autoOptimizeGasFees, OptimizedFeeResult } from '../utils/trading-math';
import { playCyberSound } from '../utils/audio';

interface Props {
  tps: number;
  pingMs: number;
  autoOptimizeActive: boolean;
  onToggleAutoOptimize: () => void;
  optimizationMode: 'CONSERVATIVE' | 'DYNAMIC' | 'AGGRESSIVE';
  onChangeMode: (mode: 'CONSERVATIVE' | 'DYNAMIC' | 'AGGRESSIVE') => void;
}

export const AutoOptimizeFeesToggle: React.FC<Props> = ({
  tps,
  pingMs,
  autoOptimizeActive,
  onToggleAutoOptimize,
  optimizationMode,
  onChangeMode,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const optimized: OptimizedFeeResult = autoOptimizeGasFees(tps, pingMs, optimizationMode);

  // Close details popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDetails(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative font-mono select-none" ref={containerRef}>
      {/* 
        LAYERED GLASS & PERSPEX HOUSING WITH BRILLIANT GLOWING DIODES
      */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.14] shadow-[0_4px_24px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.25)] transition-all hover:border-white/[0.25]">
        {/* Toggle Switch Component */}
        <button
          onClick={() => {
            playCyberSound('CLICK');
            onToggleAutoOptimize();
          }}
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg transition-all cursor-pointer group"
          title="Toggle real-time automated priority fee & Jito tip optimizer"
        >
          {/* Glowing Hardware Diode Indicator */}
          <div className="relative flex items-center justify-center">
            {/* Ambient Diode Bloom / Lens Flare */}
            <span
              className={`absolute w-3.5 h-3.5 rounded-full blur-[3px] transition-all duration-300 ${
                autoOptimizeActive ? 'opacity-100' : 'opacity-20'
              }`}
              style={{
                backgroundColor: autoOptimizeActive ? optimized.diodeColor : '#64748b',
                boxShadow: autoOptimizeActive
                  ? `0 0 10px ${optimized.diodeColor}, 0 0 20px ${optimized.diodeColor}`
                  : 'none',
              }}
            />
            {/* Core Diode Lens with Glass Refraction */}
            <span
              className={`relative w-2.5 h-2.5 rounded-full border border-white/40 transition-all ${
                autoOptimizeActive ? 'animate-pulse' : ''
              }`}
              style={{
                backgroundColor: autoOptimizeActive ? optimized.diodeColor : '#334155',
                boxShadow: autoOptimizeActive
                  ? `0 0 6px ${optimized.diodeColor}, inset 0 1px 2px rgba(255,255,255,0.8)`
                  : 'inset 0 1px 1px rgba(0,0,0,0.5)',
              }}
            />
          </div>

          {/* Perspex Glass Label */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1 text-[10px] tracking-wider font-extrabold text-white">
              <span>AUTO-OPTIMIZE FEES</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border transition-colors ${
                  autoOptimizeActive
                    ? 'bg-[#14F195]/20 text-[#14F195] border-[#14F195]/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {autoOptimizeActive ? 'ACTIVE' : 'OFF'}
              </span>
            </div>

            {/* Sub-label with live tuning feedback */}
            <div className="text-[9px] text-slate-300 flex items-center gap-1.5">
              {autoOptimizeActive ? (
                <>
                  <span className="text-[#00F0FF] font-semibold">
                    {(optimized.priorityMicroLamports / 1000).toFixed(0)}k µL
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-purple-300 font-semibold">
                    {optimized.jitoTipSol} Jito
                  </span>
                  <span className="text-slate-600 hidden xl:inline">•</span>
                  <span className="text-[#14F195] hidden xl:inline">
                    Saved +{optimized.savedSolEstimate} SOL
                  </span>
                </>
              ) : (
                <span className="text-slate-500">Mempool Autopilot Disabled</span>
              )}
            </div>
          </div>
        </button>

        {/* Perspex Beveled Details Button */}
        <button
          onClick={() => {
            playCyberSound('CLICK');
            setShowDetails(!showDetails);
          }}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer backdrop-blur-md ${
            showDetails
              ? 'bg-white/10 text-white border-white/30'
              : 'bg-white/[0.04] text-slate-400 hover:text-white border-white/[0.08] hover:bg-white/[0.08]'
          }`}
          title="Open Perspex Gas Telemetry Conduit"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* 
        EXPANDABLE TRANSLUCENT PERSPEX GLASS TELEMETRY CONDUIT
      */}
      {showDetails && (
        <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-80 sm:w-[380px] rounded-2xl bg-[#090d16]/85 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] p-4 z-50 text-xs space-y-4">
          {/* Perspex Glass Shimmer Bevel Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#9945FF] to-[#14F195] p-0.5 flex items-center justify-center">
                <Gauge className="w-3.5 h-3.5 text-black" />
              </div>
              <div>
                <span className="font-extrabold text-white text-xs tracking-wider block">
                  PERSPEX GAS TELEMETRY
                </span>
                <span className="text-[10px] text-slate-400">
                  Zero Overpay • Real-Time Inclusion Engine
                </span>
              </div>
            </div>

            {/* Glowing Status Diode Array */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 border border-white/10">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: optimized.diodeColor,
                  boxShadow: `0 0 8px ${optimized.diodeColor}`,
                }}
              />
              <span
                className="text-[10px] font-bold"
                style={{ color: optimized.diodeColor }}
              >
                {optimized.congestionStatus}
              </span>
            </div>
          </div>

          {/* Diode Array Visualizer (3 Glass Diode Cells) */}
          <div className="grid grid-cols-3 gap-2">
            {/* Diode 1: Priority Rate */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400">PRIORITY CU</span>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: '#00F0FF',
                    boxShadow: '0 0 6px #00F0FF',
                  }}
                />
              </div>
              <div className="text-sm font-extrabold text-white mt-1">
                {optimized.priorityMicroLamports.toLocaleString()}
              </div>
              <span className="text-[9px] text-[#00F0FF]">micro-lamports</span>
            </div>

            {/* Diode 2: Jito MEV Tip */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400">JITO BRIBE</span>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: '#9945FF',
                    boxShadow: '0 0 6px #9945FF',
                  }}
                />
              </div>
              <div className="text-sm font-extrabold text-white mt-1">
                {optimized.jitoTipSol}
              </div>
              <span className="text-[9px] text-purple-300">SOL tip</span>
            </div>

            {/* Diode 3: Inclusion Probability */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400">INCLUSION</span>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: '#14F195',
                    boxShadow: '0 0 6px #14F195',
                  }}
                />
              </div>
              <div className="text-sm font-extrabold text-[#14F195] mt-1">
                {optimized.inclusionProbabilityPercent}%
              </div>
              <span className="text-[9px] text-slate-400">1st slot chance</span>
            </div>
          </div>

          {/* Mode Selector (Translucent Perspex Segmented Buttons) */}
          <div>
            <label className="text-[10px] text-slate-400 block mb-1.5 uppercase tracking-wider">
              Optimization Profile:
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
              {(['CONSERVATIVE', 'DYNAMIC', 'AGGRESSIVE'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    playCyberSound('CLICK');
                    onChangeMode(m);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    optimizationMode === m
                      ? 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-black shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {m === 'CONSERVATIVE' ? 'Thrifty' : m === 'DYNAMIC' ? 'Dynamic' : 'Snipe Guard'}
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Recommendation Note */}
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-start gap-2 text-[10px] text-slate-300">
            <Info className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
            <p>{optimized.recommendationNote}</p>
          </div>

          {/* Cumulative Saved Capital Display */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/20 to-purple-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">EST. OVERPAY PREVENTED</span>
              <span className="text-[#14F195] font-extrabold text-sm">
                +{optimized.savedSolEstimate} SOL / Trade
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">SAVINGS PER 100 SWAPS</span>
              <span className="text-white font-bold text-xs">
                ~+{(optimized.savedSolEstimate * 100).toFixed(2)} SOL (${((optimized.savedSolEstimate * 100) * 154.28).toFixed(2)})
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
