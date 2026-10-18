import React from 'react';
import {
  Zap,
  Activity,
  Shield,
  Crosshair,
  Cpu,
  LineChart,
  Globe,
  Eye,
  Wallet,
  Volume2,
  VolumeX,
  User,
  AlertOctagon,
  HardDrive,
  Radio,
} from 'lucide-react';
import { UserSession } from '../types';
import { playCyberSound } from '../utils/audio';
import { NetworkGasTracker } from './NetworkGasTracker';
import { AutoOptimizeFeesToggle } from './AutoOptimizeFeesToggle';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  slot: number;
  tps: number;
  pingMs: number;
  audioMuted: boolean;
  onToggleAudio: () => void;
  session: UserSession;
  onOpenAuth: () => void;
  onEmergencyKillswitch: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  autoOptimizeActive: boolean;
  onToggleAutoOptimize: () => void;
  optimizationMode: 'CONSERVATIVE' | 'DYNAMIC' | 'AGGRESSIVE';
  onChangeMode: (mode: 'CONSERVATIVE' | 'DYNAMIC' | 'AGGRESSIVE') => void;
}

export const HeaderNav: React.FC<Props> = ({
  activeTab,
  onTabChange,
  slot,
  tps,
  pingMs,
  audioMuted,
  onToggleAudio,
  session,
  onOpenAuth,
  onEmergencyKillswitch,
  isOffline,
  onToggleOffline,
  autoOptimizeActive,
  onToggleAutoOptimize,
  optimizationMode,
  onChangeMode,
}) => {
  const tabs = [
    { id: 'chart', label: 'Terminal', icon: Activity },
    { id: 'sniper', label: 'Sniper Radar', icon: Crosshair },
    { id: 'arbitrage', label: 'DEX Arbitrage', icon: Cpu },
    { id: 'risk', label: 'Risk Guard', icon: Shield },
    { id: 'backtest', label: 'Backtester', icon: LineChart },
    { id: 'sentiment', label: 'Sentiment AI', icon: Globe },
    { id: 'vision', label: 'Vision Auditor', icon: Eye },
    { id: 'portfolio', label: 'Vault Portfolio', icon: Wallet },
  ];

  return (
    <header className="bg-[#080b11] border-b border-[#1a2336] sticky top-0 z-40 select-none">
      {/* Top Telemetry & Network Status Bar */}
      <div className="px-4 py-1.5 bg-[#05070c] border-b border-[#141a29] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse"></span>
            <span className="font-bold text-white">SOLANA MAINNET</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/30 text-purple-300 border border-purple-500/30">
              Jito MEV Block Engine
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-slate-400">
            <span className="hidden md:inline">SLOT: <strong className="text-white">{slot.toLocaleString()}</strong></span>
            <span>TPS: <strong className="text-[#14F195]">{tps}</strong></span>
            <NetworkGasTracker tps={tps} pingMs={pingMs} />
            <AutoOptimizeFeesToggle
              tps={tps}
              pingMs={pingMs}
              autoOptimizeActive={autoOptimizeActive}
              onToggleAutoOptimize={onToggleAutoOptimize}
              optimizationMode={optimizationMode}
              onChangeMode={onChangeMode}
            />
            <span className="hidden 2xl:flex items-center gap-1">
              LATENCY: <strong className="text-[#00F0FF]">{pingMs}ms</strong>
            </span>
          </div>
        </div>

        {/* Right side telemetry & quick action */}
        <div className="flex items-center gap-3">
          {/* Audio toggle */}
          <button
            onClick={() => {
              if (audioMuted) playCyberSound('CLICK');
              onToggleAudio();
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border transition-colors cursor-pointer ${
              audioMuted
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
            }`}
            title="Audio alerts for sniping, arbitrage, and fills"
          >
            {audioMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-[#14F195]" />}
            <span>{audioMuted ? 'AUDIO MUTED' : 'CYBER AUDIO ON'}</span>
          </button>

          {/* Offline indicator button */}
          <button
            onClick={() => {
              playCyberSound('CLICK');
              onToggleOffline();
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border transition-colors cursor-pointer ${
              isOffline
                ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                : 'bg-[#121824] text-slate-300 border-[#1f293d] hover:border-slate-500'
            }`}
            title="Toggle simulated offline mode"
          >
            <HardDrive className="w-3 h-3" />
            <span>{isOffline ? 'OFFLINE CACHED' : 'ONLINE SYNC'}</span>
          </button>

          {/* Auth Button */}
          <button
            onClick={() => {
              playCyberSound('CLICK');
              onOpenAuth();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#151c2c] hover:bg-[#1d273d] text-white border border-[#2b3750] transition-colors cursor-pointer text-xs"
          >
            {session.isAuthenticated ? (
              <>
                <img
                  src={session.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                  alt="Avatar"
                  className="w-4 h-4 rounded-full"
                />
                <span className="text-[11px] font-bold text-[#14F195]">
                  {session.user?.name.split(' ')[0]}
                </span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px]">Sign In</span>
              </>
            )}
          </button>

          {/* Emergency Killswitch */}
          <button
            onClick={() => {
              playCyberSound('ALERT');
              onEmergencyKillswitch();
            }}
            className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-extrabold text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-red-900/50 shadow"
            title="Emergency Panic liquidation of all active positions"
          >
            <AlertOctagon className="w-3 h-3" />
            PANIC EXIT
          </button>
        </div>
      </div>

      {/* Main Brand & Navigation Tab Bar */}
      <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-3 bg-[#080b11]">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#9945FF] via-[#7928CA] to-[#14F195] p-0.5 shadow-lg shadow-purple-900/40 flex items-center justify-center">
            <div className="w-full h-full bg-[#080b11] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#14F195] fill-current" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base font-mono tracking-tight">
                APEX<span className="text-[#14F195]">QUANTUM</span>
              </span>
              <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-[#14F195]/20 text-[#14F195] border border-[#14F195]/30">
                v4.8 PRO
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              SOLANA SNIPING & CROSS-DEX ARBITRAGE BOT
            </p>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  playCyberSound('CLICK');
                  onTabChange(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#9945FF]/30 to-[#14F195]/20 text-white border border-[#9945FF]/60 shadow-md shadow-purple-950/40'
                    : 'text-slate-400 hover:text-white hover:bg-[#121824]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#14F195]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
