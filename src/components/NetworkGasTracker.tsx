import React, { useState, useRef, useEffect } from 'react';
import { Fuel, Activity, ChevronDown, Check, Zap, Shield, Info, ArrowUpRight } from 'lucide-react';
import { calculatePrioritizationFees, assessNetworkCongestion } from '../utils/trading-math';
import { playCyberSound } from '../utils/audio';

interface Props {
  tps: number;
  pingMs: number;
}

export const NetworkGasTracker: React.FC<Props> = ({ tps, pingMs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'LOW' | 'MED' | 'HIGH' | 'TURBO'>('HIGH');
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const congestion = assessNetworkCongestion(tps, pingMs);
  const feeEstimates = calculatePrioritizationFees(tps, 1.1);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyFee = () => {
    const feeToCopy =
      selectedTier === 'LOW'
        ? feeEstimates.minMicroLamports
        : selectedTier === 'MED'
        ? feeEstimates.medianMicroLamports
        : selectedTier === 'HIGH'
        ? feeEstimates.highMicroLamports
        : feeEstimates.extremeMicroLamports;

    navigator.clipboard.writeText(feeToCopy.toString());
    setCopied(true);
    playCyberSound('CLICK');
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative font-mono" ref={dropdownRef}>
      {/* HUD Trigger Button */}
      <button
        onClick={() => {
          playCyberSound('CLICK');
          setIsOpen(!isOpen)}
        }
        className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] border transition-all cursor-pointer ${
          congestion.status === 'CONGESTED'
            ? 'bg-red-500/15 border-red-500/40 text-red-300'
            : congestion.status === 'MODERATE'
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
            : 'bg-[#131a29] border-[#222c42] text-slate-200 hover:border-[#14F195]/50'
        }`}
        title="View live Solana Priority Fee estimates and congestion"
      >
        {/* Fuel / Gas Icon */}
        <Fuel className="w-3.5 h-3.5 text-[#00F0FF]" />

        {/* Priority Fee & Status */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 hidden md:inline">GAS:</span>
          <span className="font-bold text-[#14F195]">
            {(feeEstimates.medianMicroLamports / 1000).toFixed(0)}k µL
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: congestion.color }}
          />
        </div>

        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Breakdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-80 sm:w-96 bg-[#0c111c] border border-[#232d44] rounded-xl shadow-2xl p-4 z-50 text-xs space-y-3.5">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1c2438]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#14F195]" />
              <span className="font-bold text-white text-xs">SOLANA MEMPOOL & PRIORITY FEES</span>
            </div>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold"
              style={{ backgroundColor: `${congestion.color}25`, color: congestion.color }}
            >
              {congestion.status}
            </span>
          </div>

          {/* Current Network Congestion Meter */}
          <div className="bg-[#121824] p-2.5 rounded-lg border border-[#1e273a] flex items-center justify-between text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">NETWORK STATUS</span>
              <span className="font-bold text-white">{congestion.label}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">AVERAGE RPC PING</span>
              <span className="text-[#00F0FF] font-bold">{pingMs}ms</span>
            </div>
          </div>

          {/* Priority Fee Tiers Grid */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 block uppercase">
              Dynamic Compute Unit (CU) Price Tiers:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {/* Low */}
              <div
                onClick={() => setSelectedTier('LOW')}
                className={`p-2 rounded-lg border cursor-pointer transition-all ${
                  selectedTier === 'LOW'
                    ? 'bg-[#182133] border-[#9945FF] text-white'
                    : 'bg-[#121824] border-[#1e273a] text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">LOW (Slow)</span>
                  <span className="text-emerald-400 font-bold">~92%</span>
                </div>
                <div className="font-bold text-white mt-1">
                  {feeEstimates.minMicroLamports.toLocaleString()} µL
                </div>
                <span className="text-[10px] text-slate-400">Standard transfers</span>
              </div>

              {/* Med */}
              <div
                onClick={() => setSelectedTier('MED')}
                className={`p-2 rounded-lg border cursor-pointer transition-all ${
                  selectedTier === 'MED'
                    ? 'bg-[#182133] border-[#9945FF] text-white'
                    : 'bg-[#121824] border-[#1e273a] text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">MEDIUM</span>
                  <span className="text-[#14F195] font-bold">~98%</span>
                </div>
                <div className="font-bold text-[#14F195] mt-1">
                  {feeEstimates.medianMicroLamports.toLocaleString()} µL
                </div>
                <span className="text-[10px] text-slate-400">Jupiter / Raydium</span>
              </div>

              {/* High */}
              <div
                onClick={() => setSelectedTier('HIGH')}
                className={`p-2 rounded-lg border cursor-pointer transition-all ${
                  selectedTier === 'HIGH'
                    ? 'bg-[#182133] border-[#14F195] text-white'
                    : 'bg-[#121824] border-[#1e273a] text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">HIGH (Sniper)</span>
                  <span className="text-[#00F0FF] font-bold">~99.8%</span>
                </div>
                <div className="font-bold text-[#00F0FF] mt-1">
                  {feeEstimates.highMicroLamports.toLocaleString()} µL
                </div>
                <span className="text-[10px] text-slate-400">Pump.fun Migrations</span>
              </div>

              {/* Turbo */}
              <div
                onClick={() => setSelectedTier('TURBO')}
                className={`p-2 rounded-lg border cursor-pointer transition-all ${
                  selectedTier === 'TURBO'
                    ? 'bg-[#182133] border-amber-400 text-white'
                    : 'bg-[#121824] border-[#1e273a] text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-amber-400">TURBO MEV</span>
                  <span className="text-amber-400 font-bold">&gt;99.9%</span>
                </div>
                <div className="font-bold text-amber-400 mt-1">
                  {feeEstimates.extremeMicroLamports.toLocaleString()} µL
                </div>
                <span className="text-[10px] text-slate-400">Frontrun Guard</span>
              </div>
            </div>
          </div>

          {/* Jito MEV Tip Level */}
          <div className="bg-[#121824] p-2.5 rounded-lg border border-[#1e273a] flex items-center justify-between text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">JITO MEV BUNDLE TIP (75th Percentile)</span>
              <span className="text-purple-300 font-bold">{feeEstimates.jitoTipMedianSol} SOL (~${(feeEstimates.jitoTipMedianSol * 154.28).toFixed(2)})</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">TOTAL SWAP COST</span>
              <span className="text-[#14F195] font-bold">~${(feeEstimates.estimatedSolCostMedian * 154.28).toFixed(3)}</span>
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyFee}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-[#9945FF] to-[#14F195] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-black" />
                COPIED {selectedTier} PRIORITY RATE
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current" />
                APPLY {selectedTier} FEE TO BOT CONFIG
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
