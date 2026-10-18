import React, { useState } from 'react';
import { ArrowRight, RefreshCw, Zap, TrendingUp, Cpu, CheckCircle2 } from 'lucide-react';
import { ArbitrageTrade, DexName } from '../types';
import { playCyberSound } from '../utils/audio';

interface Props {
  arbitrageOpportunities: ArbitrageTrade[];
  onExecuteArbitrage: (trade: ArbitrageTrade) => void;
  autoArbitrageActive: boolean;
  onToggleAutoArbitrage: () => void;
}

export const ArbitrageMatrix: React.FC<Props> = ({
  arbitrageOpportunities,
  onExecuteArbitrage,
  autoArbitrageActive,
  onToggleAutoArbitrage,
}) => {
  const [minSpreadThreshold, setMinSpreadThreshold] = useState(0.35); // 0.35%
  const [tradeCapitalSol, setTradeCapitalSol] = useState(5.0); // 5 SOL

  const handleExecute = (trade: ArbitrageTrade) => {
    playCyberSound('ARBITRAGE');
    onExecuteArbitrage(trade);
  };

  return (
    <div className="bg-[#0b0f19] border border-[#1e2638] rounded-xl flex flex-col h-full shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e2638] flex items-center justify-between bg-[#0d121f]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#14F195]/20 text-[#14F195]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm font-mono tracking-wide">
                CROSS-DEX ARBITRAGE MATRIX
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-[#14F195] border border-emerald-500/30">
                Atomic Flash Swaps
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Triangular & spatial spreads across Raydium, Orca, Meteora & Phoenix
            </p>
          </div>
        </div>

        {/* Auto Arb Bot Switch */}
        <button
          onClick={() => {
            playCyberSound('CLICK');
            onToggleAutoArbitrage();
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
            autoArbitrageActive
              ? 'bg-[#14F195]/20 text-[#14F195] border-[#14F195] emerald-glow'
              : 'bg-[#151b29] text-slate-400 border-[#232c40] hover:text-white'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${autoArbitrageActive ? 'animate-spin text-[#14F195]' : ''}`} />
          {autoArbitrageActive ? 'AUTO-ROUTER RUNNING' : 'ACTIVATE AUTO-ROUTER'}
        </button>
      </div>

      {/* Control Ribbon */}
      <div className="px-4 py-2.5 bg-[#090d16] border-b border-[#1a2233] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-slate-400 text-[10px] block mb-1">FLASH CAPITAL (SOL)</label>
            <div className="flex items-center bg-[#151b29] px-2 py-1 rounded border border-[#232c40]">
              <input
                type="number"
                step="1"
                min="0.5"
                max="500"
                value={tradeCapitalSol}
                onChange={(e) => setTradeCapitalSol(parseFloat(e.target.value) || 1)}
                className="w-16 bg-transparent text-white font-bold outline-none text-xs"
              />
              <span className="text-purple-400 font-semibold ml-1">SOL</span>
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-[10px] block mb-1">MIN SPREAD THRESHOLD</label>
            <div className="flex items-center bg-[#151b29] px-2 py-1 rounded border border-[#232c40]">
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="5.0"
                value={minSpreadThreshold}
                onChange={(e) => setMinSpreadThreshold(parseFloat(e.target.value) || 0.2)}
                className="w-16 bg-transparent text-white font-bold outline-none text-xs"
              />
              <span className="text-[#14F195] font-semibold ml-1">%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Execution Latency: <strong className="text-[#14F195]">12ms - 18ms</strong></span>
          <span className="text-slate-600">•</span>
          <span>Slippage Guard: <strong className="text-[#00F0FF]">0.10%</strong></span>
        </div>
      </div>

      {/* Arbitrage Pairs Table */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#171f30]">
        {arbitrageOpportunities.map((trade) => {
          const isHighSpread = trade.spreadPercent >= 0.6;
          const isExecuted = trade.status === 'EXECUTED';

          return (
            <div
              key={trade.id}
              className="p-3.5 hover:bg-[#0f1524] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono"
            >
              {/* Token and Route */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2233] to-[#0f141e] border border-[#253046] flex items-center justify-center font-bold text-xs text-[#00F0FF]">
                  {trade.pair.split('/')[0]}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{trade.pair}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isHighSpread
                          ? 'bg-[#14F195]/20 text-[#14F195] border border-[#14F195]/40'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      +{trade.spreadPercent.toFixed(2)}% Net Spread
                    </span>
                  </div>

                  {/* Route Visualizer */}
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
                    <span className="px-1.5 py-0.5 rounded bg-[#1a2233] text-purple-300 border border-[#2c3852]">
                      Buy on {trade.buyDex} (${trade.buyPrice.toFixed(4)})
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#14F195]" />
                    <span className="px-1.5 py-0.5 rounded bg-[#1a2233] text-emerald-300 border border-[#2c3852]">
                      Sell on {trade.sellDex} (${trade.sellPrice.toFixed(4)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Profit & Action */}
              <div className="flex items-center gap-5 self-end md:self-center">
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">NET PROFIT (AFTER GAS)</div>
                  <div className="text-[#14F195] font-extrabold text-sm">
                    +{(trade.estimatedProfitSol * (tradeCapitalSol / 5)).toFixed(3)} SOL
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ~+${(trade.estimatedProfitUsd * (tradeCapitalSol / 5)).toFixed(2)} USD
                  </div>
                </div>

                <button
                  disabled={isExecuted}
                  onClick={() => handleExecute(trade)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isExecuted
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#14F195] to-[#00F0FF] text-black font-extrabold hover:opacity-90 active:scale-95 shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  {isExecuted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#14F195]" />
                      FLASHED
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      INSTANT ARB
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 bg-[#080b11] border-t border-[#1e2638] flex items-center justify-between text-xs font-mono text-slate-400">
        <div>DEX Scanning: 4 Pools Monitored (Raydium, Orca, Meteora, Phoenix)</div>
        <div className="text-[#14F195] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#14F195]"></span>
          Atomic Bundle: Reverts on zero profit
        </div>
      </div>
    </div>
  );
};
