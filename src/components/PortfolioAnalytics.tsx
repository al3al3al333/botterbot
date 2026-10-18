import React, { useState } from 'react';
import { Wallet, TrendingUp, ArrowDownRight, ArrowUpRight, DollarSign, XCircle, HardDrive, Wifi, WifiOff, RefreshCw, Copy, Check } from 'lucide-react';
import { Position, WalletAccount } from '../types';
import { playCyberSound } from '../utils/audio';

interface Props {
  wallets: WalletAccount[];
  activeWallet: WalletAccount;
  onSelectWallet: (wallet: WalletAccount) => void;
  positions: Position[];
  onClosePosition: (id: string) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const PortfolioAnalytics: React.FC<Props> = ({
  wallets,
  activeWallet,
  onSelectWallet,
  positions,
  onClosePosition,
  isOffline,
  onToggleOffline,
}) => {
  const [copied, setCopied] = useState(false);

  // Compute portfolio statistics
  const totalBalanceSol = wallets.reduce((acc, w) => acc + w.balanceSol, 0);
  const totalBalanceUsd = totalBalanceSol * 154.28;
  const totalUnrealizedPnlUsd = positions.reduce((acc, p) => acc + p.pnlUsd, 0);
  const totalInvestedSol = positions.reduce((acc, p) => acc + p.investedSol, 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeWallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-[#0b0f19] border border-[#1e2638] rounded-xl flex flex-col h-full shadow-2xl overflow-hidden font-mono">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e2638] flex flex-wrap items-center justify-between gap-3 bg-[#0d121f]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#14F195]/20 text-[#14F195]">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm tracking-wide">
                MULTI-WALLET PORTFOLIO & PROFIT VAULT
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-[#14F195] border border-emerald-500/30">
                Solana Mainnet
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Realized PnL, active positions, and encrypted offline storage
            </p>
          </div>
        </div>

        {/* Offline Mode Toggle & Wallet Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playCyberSound('CLICK');
              onToggleOffline();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              isOffline
                ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                : 'bg-emerald-500/10 text-[#14F195] border-emerald-500/30'
            }`}
            title="Simulate network disconnect to verify offline portfolio persistence"
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            {isOffline ? 'OFFLINE VAULT CACHE' : 'LIVE NETWORK SYNC'}
          </button>

          {/* Active Wallet Selector */}
          <select
            value={activeWallet.id}
            onChange={(e) => {
              const found = wallets.find((w) => w.id === e.target.value);
              if (found) {
                playCyberSound('CLICK');
                onSelectWallet(found);
              }
            }}
            className="bg-[#151b29] border border-[#232c40] text-white rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer"
          >
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.balanceSol.toFixed(2)} SOL)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Offline Alert Ribbon if Offline */}
      {isOffline && (
        <div className="bg-amber-950/40 border-b border-amber-600/30 px-4 py-2 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>OFFLINE VAULT ENGAGED:</strong> Your portfolio, open positions, and analytics are cached locally in encrypted storage. All reads are active without network.
            </span>
          </div>
          <span className="text-[10px] text-amber-400/80">Cached: {new Date().toLocaleTimeString()}</span>
        </div>
      )}

      {/* Overall KPI Metrics */}
      <div className="p-4 bg-[#090d16] border-b border-[#1a2233] grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-[#121824] p-3 rounded-xl border border-[#1e273a]">
          <span className="text-[10px] text-slate-400 block">TOTAL COMBINED BALANCE</span>
          <div className="text-base font-extrabold text-white mt-0.5">
            {totalBalanceSol.toFixed(2)} SOL
          </div>
          <span className="text-[10px] text-[#14F195] font-semibold">
            ${totalBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bg-[#121824] p-3 rounded-xl border border-[#1e273a]">
          <span className="text-[10px] text-slate-400 block">UNREALIZED BOT PNL</span>
          <div className={`text-base font-extrabold mt-0.5 ${totalUnrealizedPnlUsd >= 0 ? 'text-[#14F195]' : 'text-red-400'}`}>
            {totalUnrealizedPnlUsd >= 0 ? '+' : ''}${totalUnrealizedPnlUsd.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400">Across {positions.length} Positions</span>
        </div>

        <div className="bg-[#121824] p-3 rounded-xl border border-[#1e273a]">
          <span className="text-[10px] text-slate-400 block">ACTIVE CAPITAL AT RISK</span>
          <div className="text-base font-extrabold text-[#00F0FF] mt-0.5">
            {totalInvestedSol.toFixed(2)} SOL
          </div>
          <span className="text-[10px] text-slate-400">~${(totalInvestedSol * 154.28).toFixed(2)}</span>
        </div>

        <div className="bg-[#121824] p-3 rounded-xl border border-[#1e273a]">
          <span className="text-[10px] text-slate-400 block">ACTIVE WALLET ADDRESS</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-slate-300 text-xs font-mono">
              {activeWallet.address.slice(0, 4)}...{activeWallet.address.slice(-4)}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded bg-[#1e273a] hover:bg-[#2b374e] text-slate-300 hover:text-white"
            >
              {copied ? <Check className="w-3 h-3 text-[#14F195]" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <span className="text-[10px] text-purple-400">{activeWallet.name}</span>
        </div>
      </div>

      {/* Open Positions Table */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#14F195]" />
            Live Active Positions ({positions.length})
          </span>
          <span className="text-[11px] text-slate-400">
            Real-time Stop-Loss & Target Monitoring
          </span>
        </div>

        {positions.length === 0 ? (
          <div className="p-8 text-center bg-[#121824] rounded-xl border border-[#1e273a] text-slate-400 text-xs">
            No active positions open. Engage the Sniper or Arbitrage Matrix to open trades.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1e2638] text-slate-400 text-[10px]">
                  <th className="py-2.5 px-3">ASSET</th>
                  <th className="py-2.5 px-3">SIDE / DEX</th>
                  <th className="py-2.5 px-3">SIZE</th>
                  <th className="py-2.5 px-3">ENTRY</th>
                  <th className="py-2.5 px-3">CURRENT</th>
                  <th className="py-2.5 px-3">TRAILING STOP</th>
                  <th className="py-2.5 px-3">UNREALIZED PNL</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171f30]">
                {positions.map((pos) => {
                  const isProfitable = pos.pnlUsd >= 0;

                  return (
                    <tr key={pos.id} className="hover:bg-[#151c2c] transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{pos.tokenSymbol}</td>
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-[#14F195] font-bold">
                          {pos.side}
                        </span>
                        <span className="text-slate-400 text-[10px] ml-1.5">{pos.dex}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-white font-medium">{pos.investedSol} SOL</div>
                        <div className="text-[10px] text-slate-400">{pos.amount.toLocaleString()} tokens</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">${pos.entryPrice.toFixed(4)}</td>
                      <td className="py-3 px-3 font-bold text-white">${pos.currentPrice.toFixed(4)}</td>
                      <td className="py-3 px-3 text-red-400 font-medium">
                        ${pos.trailingStopPrice.toFixed(4)}
                      </td>
                      <td className="py-3 px-3">
                        <div className={`font-bold flex items-center gap-0.5 ${isProfitable ? 'text-[#14F195]' : 'text-red-400'}`}>
                          {isProfitable ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          {isProfitable ? '+' : ''}${pos.pnlUsd.toFixed(2)}
                        </div>
                        <div className={`text-[10px] ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isProfitable ? '+' : ''}{pos.roiPercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            playCyberSound('CLICK');
                            onClosePosition(pos.id);
                          }}
                          className="px-2.5 py-1 rounded bg-[#1e273a] hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-[#2b374e] hover:border-red-500/40 text-[11px] transition-colors cursor-pointer"
                        >
                          Close Pos
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
