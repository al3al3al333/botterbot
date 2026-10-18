import React, { useState } from 'react';
import { Crosshair, ShieldCheck, AlertTriangle, Zap, Flame, ExternalLink, Settings, Radio } from 'lucide-react';
import { SniperPool } from '../types';
import { playCyberSound } from '../utils/audio';

interface Props {
  pools: SniperPool[];
  onSnipe: (pool: SniperPool, amountSol: number, slippage: number, jitoTip: number) => void;
  autoSniperActive: boolean;
  onToggleAutoSniper: () => void;
}

export const SnipingRadar: React.FC<Props> = ({
  pools,
  onSnipe,
  autoSniperActive,
  onToggleAutoSniper,
}) => {
  const [selectedPool, setSelectedPool] = useState<SniperPool | null>(pools[0] || null);
  const [snipeAmountSol, setSnipeAmountSol] = useState(0.5);
  const [slippagePercent, setSlippagePercent] = useState(1.5);
  const [jitoTipSol, setJitoTipSol] = useState(0.005);
  const [minSafetyScore, setMinSafetyScore] = useState(70);

  const handleManualSnipe = (pool: SniperPool) => {
    playCyberSound('SNIPE');
    onSnipe(pool, snipeAmountSol, slippagePercent, jitoTipSol);
  };

  return (
    <div className="bg-[#0b0f19] border border-[#1e2638] rounded-xl flex flex-col h-full shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e2638] flex items-center justify-between bg-[#0d121f]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#9945FF]/20 text-[#9945FF]">
            <Crosshair className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm font-mono tracking-wide">
                SOLANA QUANTUM SNIPER
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Pump.fun & Raydium
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Low-latency mempool listener with Jito-MEV sandwich protection
            </p>
          </div>
        </div>

        {/* Auto Sniper Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playCyberSound('CLICK');
              onToggleAutoSniper();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
              autoSniperActive
                ? 'bg-[#14F195]/20 text-[#14F195] border-[#14F195] emerald-glow'
                : 'bg-[#151b29] text-slate-400 border-[#232c40] hover:text-white'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${autoSniperActive ? 'animate-pulse text-[#14F195]' : ''}`} />
            {autoSniperActive ? 'AUTO-SNIPER ENGAGED' : 'ENGAGE AUTO-SNIPER'}
          </button>
        </div>
      </div>

      {/* Configuration Ribbon */}
      <div className="px-4 py-2.5 bg-[#090d16] border-b border-[#1a2233] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div>
          <label className="text-slate-400 text-[10px] block mb-1">SNIPE SIZE (SOL)</label>
          <div className="flex items-center bg-[#151b29] px-2 py-1 rounded border border-[#232c40]">
            <input
              type="number"
              step="0.1"
              min="0.05"
              max="50"
              value={snipeAmountSol}
              onChange={(e) => setSnipeAmountSol(parseFloat(e.target.value) || 0.1)}
              className="w-full bg-transparent text-white font-bold outline-none text-xs"
            />
            <span className="text-purple-400 font-semibold ml-1">SOL</span>
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-[10px] block mb-1">MAX SLIPPAGE (%)</label>
          <div className="flex items-center bg-[#151b29] px-2 py-1 rounded border border-[#232c40]">
            <input
              type="number"
              step="0.5"
              min="0.1"
              max="25"
              value={slippagePercent}
              onChange={(e) => setSlippagePercent(parseFloat(e.target.value) || 1)}
              className="w-full bg-transparent text-white font-bold outline-none text-xs"
            />
            <span className="text-[#14F195] font-semibold ml-1">%</span>
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-[10px] block mb-1">JITO MEV TIP (SOL)</label>
          <div className="flex items-center bg-[#151b29] px-2 py-1 rounded border border-[#232c40]">
            <input
              type="number"
              step="0.001"
              min="0.001"
              max="0.5"
              value={jitoTipSol}
              onChange={(e) => setJitoTipSol(parseFloat(e.target.value) || 0.001)}
              className="w-full bg-transparent text-white font-bold outline-none text-xs"
            />
            <span className="text-[#00F0FF] font-semibold ml-1">JITO</span>
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-[10px] block mb-1">MIN SAFETY SCORE</label>
          <div className="flex items-center bg-[#151b29] px-2 py-1 rounded border border-[#232c40]">
            <input
              type="number"
              step="5"
              min="20"
              max="95"
              value={minSafetyScore}
              onChange={(e) => setMinSafetyScore(parseInt(e.target.value, 10) || 70)}
              className="w-full bg-transparent text-white font-bold outline-none text-xs"
            />
            <span className="text-emerald-400 font-semibold ml-1">/100</span>
          </div>
        </div>
      </div>

      {/* Main Content: Live Pool Feed */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#171f30]">
        {pools.map((pool) => {
          const isSelected = selectedPool?.id === pool.id;
          const isSafe = pool.safetyScore >= 80;
          const isDegen = pool.safetyScore < 50;

          return (
            <div
              key={pool.id}
              onClick={() => setSelectedPool(pool)}
              className={`p-3.5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer ${
                isSelected
                  ? 'bg-[#151b29] border-l-4 border-l-[#9945FF]'
                  : 'hover:bg-[#0f1524]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1c2438] border border-[#2b374e] flex flex-col items-center justify-center font-mono font-bold text-xs text-white">
                  <span>{pool.symbol.slice(0, 4)}</span>
                  <span className="text-[9px] text-[#14F195] font-normal">{pool.dex}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm font-mono">{pool.name}</span>
                    <span className="text-xs text-slate-400 font-mono">({pool.pair})</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isSafe
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isDegen
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {pool.riskRating} ({pool.safetyScore}/100)
                    </span>
                  </div>

                  {/* Audit Flags */}
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] font-mono">
                    <span
                      className={`flex items-center gap-1 ${
                        pool.isMintRenounced ? 'text-[#14F195]' : 'text-red-400'
                      }`}
                    >
                      {pool.isMintRenounced ? 'MINT RENOUNCED' : 'MINT ACTIVE'}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span
                      className={`flex items-center gap-1 ${
                        pool.isFreezeRevoked ? 'text-[#14F195]' : 'text-red-400'
                      }`}
                    >
                      {pool.isFreezeRevoked ? 'FREEZE REVOKED' : 'FREEZE ACTIVE'}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span
                      className={`flex items-center gap-1 ${
                        pool.isLpBurned ? 'text-[#14F195]' : 'text-amber-400'
                      }`}
                    >
                      {pool.isLpBurned ? '100% LP BURN' : 'LP UNBURNED'}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300">
                      Top 10: {pool.top10HoldersPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Execution Action */}
              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right font-mono">
                  <div className="text-slate-400 text-[10px]">INITIAL LIQUIDITY</div>
                  <div className="text-white font-bold text-xs">
                    ${pool.initialLiquidityUsd.toLocaleString()} ({pool.liquiditySol} SOL)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Est. Price: ${pool.price < 0.001 ? pool.price.toExponential(3) : pool.price.toFixed(4)}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManualSnipe(pool);
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9945FF] to-[#7928CA] hover:from-[#8832ec] hover:to-[#6a20b3] text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-purple-900/30 transition-all active:scale-95 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-[#14F195]" />
                  SNIPE ({snipeAmountSol} SOL)
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Status */}
      <div className="px-4 py-2.5 bg-[#080b11] border-t border-[#1e2638] flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#14F195] animate-ping"></span>
          <span>Mempool Monitor: Active on Raydium CPMM & Pump.fun Migrations</span>
        </div>
        <div className="text-[#00F0FF]">
          Tip Threshold: Priority Level 99.8% (~0.005 SOL)
        </div>
      </div>
    </div>
  );
};
