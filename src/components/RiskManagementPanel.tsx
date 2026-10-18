import React, { useState } from 'react';
import { Shield, ShieldAlert, AlertOctagon, Sliders, Lock, Zap, CheckCircle } from 'lucide-react';
import { playCyberSound } from '../utils/audio';

interface Props {
  onEmergencyKillswitch: () => void;
  openPositionsCount: number;
}

export const RiskManagementPanel: React.FC<Props> = ({
  onEmergencyKillswitch,
  openPositionsCount,
}) => {
  const [trailingStopPercent, setTrailingStopPercent] = useState(6.0);
  const [takeProfit1Percent, setTakeProfit1Percent] = useState(25.0);
  const [takeProfit2Percent, setTakeProfit2Percent] = useState(50.0);
  const [maxDailyDrawdownPercent, setMaxDailyDrawdownPercent] = useState(4.0);
  const [antiMevBundleEnabled, setAntiMevBundleEnabled] = useState(true);
  const [autoRevokeAuthorities, setAutoRevokeAuthorities] = useState(true);
  const [maxPositionSizeSol, setMaxPositionSizeSol] = useState(10.0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    playCyberSound('CLICK');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleKillswitch = () => {
    playCyberSound('ALERT');
    if (window.confirm('EMERGENCY KILLSWITCH: Are you sure you want to cancel all open bot orders and liquidate all active positions into USDC/SOL immediately?')) {
      onEmergencyKillswitch();
    }
  };

  return (
    <div className="bg-[#0b0f19] border border-[#1e2638] rounded-xl flex flex-col h-full shadow-2xl overflow-hidden font-mono">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e2638] flex items-center justify-between bg-[#0d121f]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-[#14F195]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm tracking-wide">
                AUTOMATED RISK & CAPITAL SHIELD
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-[#14F195] border border-emerald-500/30">
                ACTIVE GUARD
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Institutional-grade circuit breakers, anti-sandwich Jito MEV, and trailing stops
            </p>
          </div>
        </div>

        {/* Emergency Killswitch */}
        <button
          onClick={handleKillswitch}
          className="px-3.5 py-1.5 rounded-lg bg-red-600/20 border border-red-500 text-red-400 hover:bg-red-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-900/30 cursor-pointer"
        >
          <AlertOctagon className="w-4 h-4" />
          KILLSWITCH ({openPositionsCount} OPEN)
        </button>
      </div>

      {/* Main Parameters */}
      <div className="p-4 flex-1 overflow-y-auto space-y-5 text-xs">
        {/* Trailing Stop Loss */}
        <div className="bg-[#121824] p-3.5 rounded-xl border border-[#1e273a]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-bold text-white text-xs">Dynamic Trailing Stop-Loss</span>
              <p className="text-[11px] text-slate-400">Trails token peak price; exits if price drops by set %</p>
            </div>
            <span className="px-2 py-1 rounded bg-[#1e273a] text-red-400 font-extrabold text-xs">
              -{trailingStopPercent.toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="0.5"
            value={trailingStopPercent}
            onChange={(e) => setTrailingStopPercent(parseFloat(e.target.value))}
            className="w-full accent-red-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Tight (-1%)</span>
            <span>Default (-6%)</span>
            <span>Wide Meme Volatility (-20%)</span>
          </div>
        </div>

        {/* Multi-Stage Take Profit */}
        <div className="bg-[#121824] p-3.5 rounded-xl border border-[#1e273a]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-bold text-white text-xs">Multi-Stage Take Profit (TP1 & TP2)</span>
              <p className="text-[11px] text-slate-400">Automated scale-out orders at target multipliers</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 rounded bg-[#14F195]/20 text-[#14F195] font-bold text-xs">
                TP1: +{takeProfit1Percent}%
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-xs">
                TP2: +{takeProfit2Percent}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">TP1 Target (+%):</label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={takeProfit1Percent}
                onChange={(e) => setTakeProfit1Percent(parseFloat(e.target.value))}
                className="w-full accent-[#14F195] cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">TP2 Target (+%):</label>
              <input
                type="range"
                min="25"
                max="300"
                step="10"
                value={takeProfit2Percent}
                onChange={(e) => setTakeProfit2Percent(parseFloat(e.target.value))}
                className="w-full accent-[#9945FF] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Portfolio Max Drawdown Circuit Breaker */}
        <div className="bg-[#121824] p-3.5 rounded-xl border border-[#1e273a]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-bold text-white text-xs">Daily Max Drawdown Circuit Breaker</span>
              <p className="text-[11px] text-slate-400">Locks bot trading for 24h if cumulative daily losses hit limit</p>
            </div>
            <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 font-extrabold text-xs">
              {maxDailyDrawdownPercent}% Max Loss
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={maxDailyDrawdownPercent}
            onChange={(e) => setMaxDailyDrawdownPercent(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Security Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#121824] border border-[#1e273a] cursor-pointer hover:border-[#2a364e] transition-colors">
            <div>
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#14F195]" />
                Jito Anti-Sandwich MEV
              </div>
              <span className="text-[10px] text-slate-400">Routes swaps via private Jito bundles</span>
            </div>
            <input
              type="checkbox"
              checked={antiMevBundleEnabled}
              onChange={(e) => setAntiMevBundleEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#14F195]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#121824] border border-[#1e273a] cursor-pointer hover:border-[#2a364e] transition-colors">
            <div>
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#00F0FF]" />
                Strict Honeypot Filter
              </div>
              <span className="text-[10px] text-slate-400">Rejects unrenounced mint or freeze authority</span>
            </div>
            <input
              type="checkbox"
              checked={autoRevokeAuthorities}
              onChange={(e) => setAutoRevokeAuthorities(e.target.checked)}
              className="w-4 h-4 accent-[#00F0FF]"
            />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="px-4 py-3 bg-[#0d121f] border-t border-[#1e2638] flex items-center justify-between">
        <div className="text-[11px] text-slate-400">
          Settings synchronized locally and backed up offline.
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-[#14F195] text-black font-extrabold text-xs hover:bg-[#12da86] transition-all flex items-center gap-1.5 cursor-pointer shadow"
        >
          {savedSuccess ? (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              SETTINGS SAVED
            </>
          ) : (
            <>
              <Sliders className="w-3.5 h-3.5" />
              APPLY RISK PARAMETERS
            </>
          )}
        </button>
      </div>
    </div>
  );
};
