import React, { useState } from 'react';
import { Play, LineChart, Award, TrendingUp, CheckCircle, BarChart, Sliders } from 'lucide-react';
import { BacktestRun } from '../types';
import { playCyberSound } from '../utils/audio';

export const StrategyBacktester: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState('Quantum Momentum Breakout');
  const [timeframe, setTimeframe] = useState('15m');
  const [initialCapitalSol, setInitialCapitalSol] = useState(25.0);
  const [marketCondition, setMarketCondition] = useState<'BULL' | 'BEAR' | 'CRAB' | 'HIGH_VOLATILITY'>('HIGH_VOLATILITY');
  const [isRunning, setIsRunning] = useState(false);

  // Preset backtest data
  const [result, setResult] = useState<BacktestRun>({
    strategyName: 'Quantum Momentum Breakout',
    timeframe: '15m',
    totalTrades: 148,
    winRate: 74.3,
    sharpeRatio: 2.84,
    profitFactor: 3.12,
    maxDrawdownPercent: 6.8,
    netProfitSol: 42.65,
    netProfitUsd: 6580.45,
    equityCurve: [
      { time: 'Day 1', equity: 25.0 },
      { time: 'Day 5', equity: 28.4 },
      { time: 'Day 10', equity: 32.1 },
      { time: 'Day 15', equity: 30.5 },
      { time: 'Day 20', equity: 38.2 },
      { time: 'Day 25', equity: 49.6 },
      { time: 'Day 30', equity: 67.65 },
    ],
  });

  const handleRunBacktest = () => {
    setIsRunning(true);
    playCyberSound('CLICK');

    setTimeout(() => {
      setIsRunning(false);
      playCyberSound('PROFIT');

      // Generate realistic metrics based on strategy
      const winRate = selectedStrategy.includes('Arb') ? 92.4 : selectedStrategy.includes('Pump') ? 61.2 : 75.8;
      const profitMult = marketCondition === 'HIGH_VOLATILITY' ? 2.1 : marketCondition === 'BULL' ? 1.8 : 1.2;
      const netSol = parseFloat((initialCapitalSol * 0.95 * profitMult).toFixed(2));
      const netUsd = parseFloat((netSol * 154.28).toFixed(2));

      setResult({
        strategyName: selectedStrategy,
        timeframe,
        totalTrades: Math.floor(100 + Math.random() * 80),
        winRate,
        sharpeRatio: parseFloat((2.2 + Math.random() * 1.2).toFixed(2)),
        profitFactor: parseFloat((2.5 + Math.random() * 1.4).toFixed(2)),
        maxDrawdownPercent: parseFloat((4.5 + Math.random() * 4).toFixed(1)),
        netProfitSol: netSol,
        netProfitUsd: netUsd,
        equityCurve: [
          { time: 'Day 1', equity: initialCapitalSol },
          { time: 'Day 5', equity: initialCapitalSol * 1.12 },
          { time: 'Day 10', equity: initialCapitalSol * 1.28 },
          { time: 'Day 15', equity: initialCapitalSol * 1.22 },
          { time: 'Day 20', equity: initialCapitalSol * 1.54 },
          { time: 'Day 25', equity: initialCapitalSol * 1.76 },
          { time: 'Day 30', equity: initialCapitalSol + netSol },
        ],
      });
    }, 1200);
  };

  // Compute SVG coordinates for equity curve
  const minEq = Math.min(...result.equityCurve.map((e) => e.equity));
  const maxEq = Math.max(...result.equityCurve.map((e) => e.equity));
  const rangeEq = maxEq - minEq || 1;

  const points = result.equityCurve
    .map((pt, i) => {
      const x = (i / (result.equityCurve.length - 1)) * 500;
      const y = 140 - ((pt.equity - minEq) / rangeEq) * 110 - 15;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-[#0b0f19] border border-[#1e2638] rounded-xl flex flex-col h-full shadow-2xl overflow-hidden font-mono">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e2638] flex items-center justify-between bg-[#0d121f]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-500/20 text-[#9945FF]">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm tracking-wide">
                QUANTUM STRATEGY LAB & BACKTESTER
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Solana Historical Data
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Simulate algorithmic execution models across varying market volatility conditions
            </p>
          </div>
        </div>

        <button
          disabled={isRunning}
          onClick={handleRunBacktest}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9945FF] to-[#14F195] text-black font-extrabold text-xs flex items-center gap-1.5 hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-purple-900/30 cursor-pointer"
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'SIMULATING TICKS...' : 'RUN 30-DAY BACKTEST'}
        </button>
      </div>

      {/* Strategy Control Settings */}
      <div className="p-4 bg-[#090d16] border-b border-[#1a2233] grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="text-slate-400 text-[10px] block mb-1">STRATEGY PRESET</label>
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            className="w-full bg-[#151b29] border border-[#232c40] text-white rounded p-1.5 outline-none font-mono text-xs cursor-pointer"
          >
            <option value="Quantum Momentum Breakout">Quantum Momentum Breakout</option>
            <option value="Raydium-Orca Flash Arb">Raydium-Orca Flash Arb</option>
            <option value="Pump.fun Liquidity Migrator">Pump.fun Liquidity Migrator</option>
            <option value="Mean Reversion Scalper">Mean Reversion Scalper</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 text-[10px] block mb-1">MARKET REGIME</label>
          <select
            value={marketCondition}
            onChange={(e) => setMarketCondition(e.target.value as any)}
            className="w-full bg-[#151b29] border border-[#232c40] text-white rounded p-1.5 outline-none font-mono text-xs cursor-pointer"
          >
            <option value="HIGH_VOLATILITY">High Volatility (Meme Season)</option>
            <option value="BULL">Sustained Bull Run</option>
            <option value="BEAR">Bearish Flash-Crash</option>
            <option value="CRAB">Sideways Range (Arb Favored)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 text-[10px] block mb-1">TIMEFRAME</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full bg-[#151b29] border border-[#232c40] text-white rounded p-1.5 outline-none font-mono text-xs cursor-pointer"
          >
            <option value="1s">1-Second Tick Level</option>
            <option value="1m">1-Minute Candles</option>
            <option value="5m">5-Minute Candles</option>
            <option value="15m">15-Minute Candles</option>
            <option value="1h">1-Hour Trend</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 text-[10px] block mb-1">STARTING EQUITY (SOL)</label>
          <input
            type="number"
            value={initialCapitalSol}
            onChange={(e) => setInitialCapitalSol(parseFloat(e.target.value) || 1)}
            className="w-full bg-[#151b29] border border-[#232c40] text-white rounded p-1.5 outline-none font-mono text-xs"
          />
        </div>
      </div>

      {/* Backtest Results Cards */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-[#121824] p-3 rounded-xl border border-[#1e273a]">
            <span className="text-[10px] text-slate-400 block">NET PROFIT</span>
            <div className="text-base font-extrabold text-[#14F195] mt-0.5">
              +{result.netProfitSol.toFixed(2)} SOL
            </div>
            <span className="text-[10px] text-slate-400">+${result.netProfitUsd.toLocaleString()}</span>
          </div>

          <div className="bg-[#121824] p-3 rounded-xl border border-[#1e273a]">
            <span className="text-[10px] text-slate-400 block">WIN RATE</span>
            <div className="text-base font-extrabold text-white mt-0.5">
              {result.winRate.toFixed(1)}%
            </div>
            <span className="text-[10px] text-emerald-400">{result.totalTrades} Total Trades</span>
          </div>

          <div className="bg-[#121824] p-3 rounded-xl border border-[#1e273a]">
            <span className="text-[10px] text-slate-400 block">SHARPE RATIO</span>
            <div className="text-base font-extrabold text-[#00F0FF] mt-0.5">
              {result.sharpeRatio}
            </div>
            <span className="text-[10px] text-slate-400">Institutional Tier</span>
          </div>

          <div className="bg-[#121824] p-3 rounded-xl border border-[#1e273a]">
            <span className="text-[10px] text-slate-400 block">PROFIT FACTOR</span>
            <div className="text-base font-extrabold text-purple-300 mt-0.5">
              {result.profitFactor}
            </div>
            <span className="text-[10px] text-slate-400">Gross Wins/Losses</span>
          </div>

          <div className="bg-[#121824] p-3 rounded-xl border border-[#1e273a]">
            <span className="text-[10px] text-slate-400 block">MAX DRAWDOWN</span>
            <div className="text-base font-extrabold text-amber-400 mt-0.5">
              -{result.maxDrawdownPercent}%
            </div>
            <span className="text-[10px] text-slate-400">Peak-to-Trough</span>
          </div>
        </div>

        {/* Equity Curve SVG Chart */}
        <div className="bg-[#121824] p-4 rounded-xl border border-[#1e273a]">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#14F195]" />
              Cumulative Equity Growth Curve
            </span>
            <span className="text-slate-400 text-[11px]">
              {result.strategyName} • 30-Day Period
            </span>
          </div>

          <div className="h-44 w-full relative">
            <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14F195" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#9945FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="35" x2="500" y2="35" stroke="#1c2538" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#1c2538" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="115" x2="500" y2="115" stroke="#1c2538" strokeWidth="1" strokeDasharray="3 3" />

              {/* Fill Area */}
              <polygon
                points={`0,140 ${points} 500,140`}
                fill="url(#equityGrad)"
              />

              {/* Line */}
              <polyline
                fill="none"
                stroke="#14F195"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />

              {/* Data points */}
              {result.equityCurve.map((pt, i) => {
                const x = (i / (result.equityCurve.length - 1)) * 500;
                const y = 140 - ((pt.equity - minEq) / rangeEq) * 110 - 15;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#080b11"
                    stroke="#14F195"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 mt-2">
            {result.equityCurve.map((e, idx) => (
              <span key={idx}>{e.time} ({e.equity.toFixed(1)} SOL)</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
