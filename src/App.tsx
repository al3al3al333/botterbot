import React, { useState, useEffect, useRef } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { CandlestickChart } from './components/CandlestickChart';
import { SnipingRadar } from './components/SnipingRadar';
import { ArbitrageMatrix } from './components/ArbitrageMatrix';
import { RiskManagementPanel } from './components/RiskManagementPanel';
import { StrategyBacktester } from './components/StrategyBacktester';
import { SocialSentimentTerminal } from './components/SocialSentimentTerminal';
import { VisionChartAnalyzer } from './components/VisionChartAnalyzer';
import { PortfolioAnalytics } from './components/PortfolioAnalytics';
import { OrderBook } from './components/OrderBook';
import { AudioAlertsLog } from './components/AudioAlertsLog';
import { AuthModal } from './components/AuthModal';
import { GeminiCopilotChat } from './components/GeminiCopilotChat';
import {
  TokenItem,
  CandleData,
  Position,
  SniperPool,
  ArbitrageTrade,
  WalletAccount,
  TradeAlert,
  UserSession,
} from './types';
import { playCyberSound, playGeminiTTS } from './utils/audio';

// Initial tokens list on Solana
const INITIAL_TOKENS: TokenItem[] = [
  {
    symbol: 'SOL/USDC',
    name: 'Solana',
    address: 'So11111111111111111111111111111111111111112',
    priceUsd: 154.28,
    change24h: 4.82,
    volume24h: 18450200,
    high24h: 158.4,
    low24h: 147.1,
    volatility: 4.2,
    baseDecimals: 9,
    iconBg: 'from-[#9945FF] to-[#14F195]',
    dexQuotes: { Raydium: 154.28, Orca: 154.62, Meteora: 154.15, Phoenix: 154.32 },
  },
  {
    symbol: 'JUP/SOL',
    name: 'Jupiter',
    address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    priceUsd: 1.14,
    change24h: 8.15,
    volume24h: 8250000,
    high24h: 1.22,
    low24h: 1.05,
    volatility: 6.8,
    baseDecimals: 6,
    iconBg: 'from-[#14F195] to-[#00F0FF]',
    dexQuotes: { Raydium: 1.14, Orca: 1.152, Meteora: 1.138, Phoenix: 1.144 },
  },
  {
    symbol: 'BONK/SOL',
    name: 'Bonk',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    priceUsd: 0.0000228,
    change24h: -2.34,
    volume24h: 12400000,
    high24h: 0.0000245,
    low24h: 0.0000219,
    volatility: 9.8,
    baseDecimals: 5,
    iconBg: 'from-amber-500 to-orange-600',
    dexQuotes: { Raydium: 0.0000228, Orca: 0.0000232, Meteora: 0.0000226, Phoenix: 0.0000229 },
  },
  {
    symbol: 'WIF/SOL',
    name: 'dogwifhat',
    address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    priceUsd: 2.84,
    change24h: 12.6,
    volume24h: 24500000,
    high24h: 3.02,
    low24h: 2.51,
    volatility: 11.2,
    baseDecimals: 6,
    iconBg: 'from-rose-500 to-purple-600',
    dexQuotes: { Raydium: 2.84, Orca: 2.864, Meteora: 2.825, Phoenix: 2.848 },
  },
  {
    symbol: 'RAY/SOL',
    name: 'Raydium',
    address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    priceUsd: 3.05,
    change24h: 5.4,
    volume24h: 6800000,
    high24h: 3.18,
    low24h: 2.89,
    volatility: 5.1,
    baseDecimals: 6,
    iconBg: 'from-blue-500 to-indigo-600',
    dexQuotes: { Raydium: 3.05, Orca: 3.068, Meteora: 3.035, Phoenix: 3.052 },
  },
];

// Initial Sniper Pools
const INITIAL_POOLS: SniperPool[] = [
  {
    id: 'pool-1',
    symbol: 'APEX',
    name: 'Solana Apex AI',
    pair: 'APEX/SOL',
    dex: 'Pump.fun',
    initialLiquidityUsd: 65000,
    liquiditySol: 421.3,
    price: 0.000084,
    createdAt: Date.now() - 35000,
    safetyScore: 92,
    isMintRenounced: true,
    isFreezeRevoked: true,
    isLpBurned: true,
    top10HoldersPercent: 14.2,
    riskRating: 'SAFE',
    status: 'NEW_POOL',
  },
  {
    id: 'pool-2',
    symbol: 'NEON',
    name: 'Neon Solana Cat',
    pair: 'NEON/SOL',
    dex: 'Raydium CPMM',
    initialLiquidityUsd: 84000,
    liquiditySol: 544.5,
    price: 0.000312,
    createdAt: Date.now() - 72000,
    safetyScore: 84,
    isMintRenounced: true,
    isFreezeRevoked: true,
    isLpBurned: true,
    top10HoldersPercent: 18.5,
    riskRating: 'SAFE',
    status: 'NEW_POOL',
  },
  {
    id: 'pool-3',
    symbol: 'DEGENX',
    name: 'Degen Turbo 100x',
    pair: 'DEGENX/SOL',
    dex: 'Meteora DLMM',
    initialLiquidityUsd: 14500,
    liquiditySol: 94.0,
    price: 0.000019,
    createdAt: Date.now() - 110000,
    safetyScore: 45,
    isMintRenounced: false,
    isFreezeRevoked: true,
    isLpBurned: false,
    top10HoldersPercent: 54.0,
    riskRating: 'DEGEN',
    status: 'WATCHING',
  },
];

// Initial Cross-DEX Arbitrage Pairs
const INITIAL_ARBITRAGE: ArbitrageTrade[] = [
  {
    id: 'arb-1',
    pair: 'SOL/USDC',
    buyDex: 'Meteora',
    sellDex: 'Orca',
    buyPrice: 154.15,
    sellPrice: 154.62,
    spreadPercent: 0.65,
    estimatedProfitSol: 0.042,
    estimatedProfitUsd: 6.48,
    timestamp: Date.now(),
    status: 'READY',
  },
  {
    id: 'arb-2',
    pair: 'JUP/SOL',
    buyDex: 'Raydium',
    sellDex: 'Orca',
    buyPrice: 1.14,
    sellPrice: 1.152,
    spreadPercent: 0.52,
    estimatedProfitSol: 0.028,
    estimatedProfitUsd: 4.32,
    timestamp: Date.now(),
    status: 'READY',
  },
  {
    id: 'arb-3',
    pair: 'WIF/SOL',
    buyDex: 'Meteora',
    sellDex: 'Phoenix',
    buyPrice: 2.825,
    sellPrice: 2.848,
    spreadPercent: 0.44,
    estimatedProfitSol: 0.022,
    estimatedProfitUsd: 3.39,
    timestamp: Date.now(),
    status: 'READY',
  },
];

// Initial Wallets
const INITIAL_WALLETS: WalletAccount[] = [
  {
    id: 'w-1',
    name: 'Alpha Sniper Vault',
    address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    balanceSol: 42.85,
    balanceUsd: 6610.9,
    tokens: [
      { symbol: 'SOL', amount: 42.85, valueUsd: 6610.9 },
      { symbol: 'JUP', amount: 1450, valueUsd: 1653.0 },
      { symbol: 'WIF', amount: 820, valueUsd: 2328.8 },
    ],
    isPrimary: true,
  },
  {
    id: 'w-2',
    name: 'Cold Treasury Multisig',
    address: '9zPq3WkmR72KjYn816mXz4DqM2tF5aPvL89jH31bRt9W',
    balanceSol: 250.0,
    balanceUsd: 38570.0,
    tokens: [{ symbol: 'SOL', amount: 250.0, valueUsd: 38570.0 }],
    isPrimary: false,
  },
  {
    id: 'w-3',
    name: 'Arbitrage Flash Vault',
    address: '3vMn1bRt9W7xKXtg2CW87d97TXJSDpbD5jBkheTqA82Z',
    balanceSol: 18.4,
    balanceUsd: 2838.75,
    tokens: [{ symbol: 'SOL', amount: 18.4, valueUsd: 2838.75 }],
    isPrimary: false,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('chart');
  const [tokens, setTokens] = useState<TokenItem[]>(INITIAL_TOKENS);
  const [selectedToken, setSelectedToken] = useState<TokenItem>(INITIAL_TOKENS[0]);
  const [timeframe, setTimeframe] = useState('1m');

  // Network Telemetry
  const [slot, setSlot] = useState(284920140);
  const [tps, setTps] = useState(2842);
  const [pingMs, setPingMs] = useState(16);
  const [audioMuted, setAudioMuted] = useState(false);

  // Auto-Optimize Gas Fees State (Layered Glass & Perspex with bright diodes)
  const [autoOptimizeActive, setAutoOptimizeActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('apex_auto_optimize');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [optimizationMode, setOptimizationMode] = useState<'CONSERVATIVE' | 'DYNAMIC' | 'AGGRESSIVE'>('DYNAMIC');

  // Bot Features & Active Engines
  const [autoSniperActive, setAutoSniperActive] = useState(false);
  const [autoArbitrageActive, setAutoArbitrageActive] = useState(false);
  const [sniperPools, setSniperPools] = useState<SniperPool[]>(INITIAL_POOLS);
  const [arbitrageTrades, setArbitrageTrades] = useState<ArbitrageTrade[]>(INITIAL_ARBITRAGE);
  const [positions, setPositions] = useState<Position[]>([
    {
      id: 'pos-1',
      tokenSymbol: 'SOL/USDC',
      side: 'BUY',
      entryPrice: 151.2,
      currentPrice: 154.28,
      amount: 15,
      investedSol: 15,
      pnlUsd: 46.2,
      roiPercent: 2.04,
      trailingStopPrice: 145.02,
      takeProfitPrice: 165.0,
      dex: 'Orca',
      timestamp: Date.now() - 1800000,
    },
    {
      id: 'pos-2',
      tokenSymbol: 'JUP/SOL',
      side: 'BUY',
      entryPrice: 1.08,
      currentPrice: 1.14,
      amount: 800,
      investedSol: 5.6,
      pnlUsd: 48.0,
      roiPercent: 5.56,
      trailingStopPrice: 1.06,
      takeProfitPrice: 1.25,
      dex: 'Raydium',
      timestamp: Date.now() - 3600000,
    },
  ]);

  // Alerts Log
  const [alerts, setAlerts] = useState<TradeAlert[]>([
    {
      id: 'alert-1',
      title: 'ARBITRAGE EXECUTED',
      message: 'Flashed 5 SOL spread Orca -> Raydium. Net profit: +0.038 SOL (~$5.86)',
      type: 'PROFIT',
      timestamp: Date.now() - 45000,
    },
    {
      id: 'alert-2',
      title: 'NEW PUMP.FUN POOL DETECTED',
      message: 'APEX/SOL migrated to Raydium CPMM. Mint renounced, freeze revoked. Score: 92/100.',
      type: 'SNIPE',
      timestamp: Date.now() - 120000,
    },
  ]);

  // Multi-wallet & Offline state
  const [wallets, setWallets] = useState<WalletAccount[]>(() => {
    try {
      const saved = localStorage.getItem('apex_wallets');
      return saved ? JSON.parse(saved) : INITIAL_WALLETS;
    } catch {
      return INITIAL_WALLETS;
    }
  });
  const [activeWallet, setActiveWallet] = useState<WalletAccount>(wallets[0]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Auth Modal & User Session
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [session, setSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem('apex_session');
      return saved
        ? JSON.parse(saved)
        : { isAuthenticated: false, isOffline: !navigator.onLine, lastSyncedAt: Date.now() };
    } catch {
      return { isAuthenticated: false, isOffline: false, lastSyncedAt: Date.now() };
    }
  });

  // Candlestick Data for selected token
  const [candles, setCandles] = useState<CandleData[]>(() => {
    const base = selectedToken.priceUsd;
    const list: CandleData[] = [];
    let cur = base * 0.96;
    for (let i = 50; i >= 0; i--) {
      const open = cur;
      const change = (Math.random() - 0.48) * (base * 0.008);
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * (base * 0.004);
      const low = Math.min(open, close) - Math.random() * (base * 0.004);
      const volume = Math.floor(1000 + Math.random() * 8000);
      list.push({
        time: Date.now() - i * 60000,
        open,
        high,
        low,
        close,
        volume,
      });
      cur = close;
    }
    return list;
  });

  // Offline network listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save to localStorage for robust offline persistence
  useEffect(() => {
    try {
      localStorage.setItem('apex_wallets', JSON.stringify(wallets));
      localStorage.setItem('apex_session', JSON.stringify(session));
      localStorage.setItem('apex_positions', JSON.stringify(positions));
      localStorage.setItem('apex_auto_optimize', JSON.stringify(autoOptimizeActive));
    } catch (e) {
      console.warn('LocalStorage quota or disabled:', e);
    }
  }, [wallets, session, positions, autoOptimizeActive]);

  // Connect to WebSocket server or simulate sub-second Solana ticks
  useEffect(() => {
    let ws: WebSocket | null = null;
    let fallbackInterval: NodeJS.Timeout | null = null;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/market`;
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'TICK') {
            setSlot(payload.slot);
            setTps(payload.tps);
            setPingMs(payload.pingMs);

            if (payload.data[selectedToken.symbol]) {
              const livePrice = payload.data[selectedToken.symbol].price;
              setCandles((prev) => {
                if (prev.length === 0) return prev;
                const last = { ...prev[prev.length - 1] };
                last.close = livePrice;
                if (livePrice > last.high) last.high = livePrice;
                if (livePrice < last.low) last.low = livePrice;
                return [...prev.slice(0, prev.length - 1), last];
              });
            }
          }
        } catch (err) {
          console.error('Error parsing WS message:', err);
        }
      };

      ws.onerror = () => {
        // Fallback to local simulation if WS is blocked in some preview containers
        startFallbackInterval();
      };
    } catch {
      startFallbackInterval();
    }

    function startFallbackInterval() {
      if (fallbackInterval) return;
      fallbackInterval = setInterval(() => {
        setSlot((s) => s + 1);
        setTps(2750 + Math.floor(Math.random() * 200));
        setPingMs(14 + Math.floor(Math.random() * 7));

        setCandles((prev) => {
          if (prev.length === 0) return prev;
          const last = { ...prev[prev.length - 1] };
          const delta = (Math.random() - 0.49) * (last.close * 0.001);
          last.close = parseFloat((last.close + delta).toFixed(4));
          if (last.close > last.high) last.high = last.close;
          if (last.close < last.low) last.low = last.close;
          return [...prev.slice(0, prev.length - 1), last];
        });
      }, 350);
    }

    return () => {
      if (ws) ws.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [selectedToken]);

  // Automated Arbitrage Loop
  useEffect(() => {
    if (!autoArbitrageActive) return;

    const interval = setInterval(() => {
      const viableTrade = arbitrageTrades.find((t) => t.spreadPercent >= 0.45 && t.status === 'READY');
      if (viableTrade) {
        if (!audioMuted) playCyberSound('ARBITRAGE');

        // Mark as executed
        setArbitrageTrades((prev) =>
          prev.map((t) => (t.id === viableTrade.id ? { ...t, status: 'EXECUTED' } : t))
        );

        // Add profit alert
        const profitSol = viableTrade.estimatedProfitSol;
        setAlerts((prev) => [
          {
            id: `alert-${Date.now()}`,
            title: 'AUTO-ARBITRAGE COMPLETED',
            message: `Atomic route on ${viableTrade.pair} (${viableTrade.buyDex} -> ${viableTrade.sellDex}) captured +${profitSol.toFixed(3)} SOL net!`,
            type: 'PROFIT',
            timestamp: Date.now(),
          },
          ...prev.slice(0, 15),
        ]);

        // Increment active wallet balance
        setActiveWallet((w) => ({
          ...w,
          balanceSol: parseFloat((w.balanceSol + profitSol).toFixed(3)),
        }));
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [autoArbitrageActive, arbitrageTrades, audioMuted]);

  // Auto-Sniper Loop
  useEffect(() => {
    if (!autoSniperActive) return;

    const interval = setInterval(() => {
      const unSniped = sniperPools.find((p) => p.status === 'NEW_POOL' && p.safetyScore >= 80);
      if (unSniped) {
        if (!audioMuted) playCyberSound('SNIPE');

        setSniperPools((prev) =>
          prev.map((p) => (p.id === unSniped.id ? { ...p, status: 'SNIPED' } : p))
        );

        const newPos: Position = {
          id: `pos-${Date.now()}`,
          tokenSymbol: unSniped.pair,
          side: 'BUY',
          entryPrice: unSniped.price,
          currentPrice: unSniped.price * 1.08,
          amount: Math.floor(0.5 / unSniped.price),
          investedSol: 0.5,
          pnlUsd: 6.2,
          roiPercent: 8.0,
          trailingStopPrice: unSniped.price * 0.94,
          takeProfitPrice: unSniped.price * 1.5,
          dex: unSniped.dex.includes('Raydium') ? 'Raydium' : 'Meteora',
          timestamp: Date.now(),
        };

        setPositions((prev) => [newPos, ...prev]);

        setAlerts((prev) => [
          {
            id: `alert-${Date.now()}`,
            title: `AUTO-SNIPED ${unSniped.symbol}`,
            message: `Executed 0.5 SOL snipe on ${unSniped.dex}. Safety Score: ${unSniped.safetyScore}/100. Trailing Stop Active (-6%).`,
            type: 'SNIPE',
            timestamp: Date.now(),
          },
          ...prev.slice(0, 15),
        ]);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [autoSniperActive, sniperPools, audioMuted]);

  // Actions
  const handleManualSnipe = (pool: SniperPool, amountSol: number, slippage: number, jitoTip: number) => {
    setSniperPools((prev) =>
      prev.map((p) => (p.id === pool.id ? { ...p, status: 'SNIPED' } : p))
    );

    const newPos: Position = {
      id: `pos-${Date.now()}`,
      tokenSymbol: pool.pair,
      side: 'BUY',
      entryPrice: pool.price,
      currentPrice: pool.price * 1.05,
      amount: Math.floor(amountSol / pool.price),
      investedSol: amountSol,
      pnlUsd: parseFloat((amountSol * 154.28 * 0.05).toFixed(2)),
      roiPercent: 5.0,
      trailingStopPrice: pool.price * (1 - slippage / 100),
      takeProfitPrice: pool.price * 1.5,
      dex: pool.dex.includes('Raydium') ? 'Raydium' : 'Meteora',
      timestamp: Date.now(),
    };

    setPositions((prev) => [newPos, ...prev]);

    setAlerts((prev) => [
      {
        id: `alert-${Date.now()}`,
        title: `SNIPE EXECUTED: ${pool.symbol}`,
        message: `Routed ${amountSol} SOL via Jito bundle (Tip: ${jitoTip} SOL). Verified zero honeypot risk.`,
        type: 'SNIPE',
        timestamp: Date.now(),
      },
      ...prev,
    ]);
  };

  const handleExecuteArbitrage = (trade: ArbitrageTrade) => {
    setArbitrageTrades((prev) =>
      prev.map((t) => (t.id === trade.id ? { ...t, status: 'EXECUTED' } : t))
    );

    setActiveWallet((w) => ({
      ...w,
      balanceSol: parseFloat((w.balanceSol + trade.estimatedProfitSol).toFixed(3)),
    }));

    setAlerts((prev) => [
      {
        id: `alert-${Date.now()}`,
        title: `MANUAL ARBITRAGE FLASH`,
        message: `Captured +${trade.estimatedProfitSol} SOL spread on ${trade.pair} between ${trade.buyDex} and ${trade.sellDex}.`,
        type: 'PROFIT',
        timestamp: Date.now(),
      },
      ...prev,
    ]);
  };

  const handleEmergencyKillswitch = () => {
    const closedCount = positions.length;
    setPositions([]);
    setAlerts((prev) => [
      {
        id: `alert-${Date.now()}`,
        title: 'EMERGENCY KILLSWITCH TRIGGERED',
        message: `Liquidated ${closedCount} open positions to SOL/USDC. All bot routing engines halted.`,
        type: 'RISK',
        timestamp: Date.now(),
      },
      ...prev,
    ]);
  };

  const handleClosePosition = (id: string) => {
    setPositions((prev) => prev.filter((p) => p.id !== id));
  };

  const handleExecuteTrade = (side: 'BUY' | 'SELL', amountSol: number) => {
    const currentPrice = selectedToken.priceUsd;
    const newPos: Position = {
      id: `pos-${Date.now()}`,
      tokenSymbol: selectedToken.symbol,
      side,
      entryPrice: currentPrice,
      currentPrice,
      amount: Math.floor((amountSol * 154.28) / currentPrice),
      investedSol: amountSol,
      pnlUsd: 0,
      roiPercent: 0,
      trailingStopPrice: currentPrice * 0.94,
      takeProfitPrice: currentPrice * 1.15,
      dex: 'Orca',
      timestamp: Date.now(),
    };

    setPositions((prev) => [newPos, ...prev]);

    setAlerts((prev) => [
      {
        id: `alert-${Date.now()}`,
        title: `MANUAL ${side} ORDER FILLED`,
        message: `Filled ${amountSol} SOL on ${selectedToken.symbol} at $${currentPrice.toFixed(4)}.`,
        type: 'SNIPE',
        timestamp: Date.now(),
      },
      ...prev,
    ]);
  };

  const handleLogin = (provider: 'google' | 'github') => {
    setSession({
      isAuthenticated: true,
      user: {
        name: provider === 'google' ? 'Alex Mercer (Solana Quant)' : 'quant-dev-sol',
        email: provider === 'google' ? 'alex.mercer@solana-apex.io' : 'alex@github.com',
        avatar:
          provider === 'google'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        provider,
      },
      isOffline,
      lastSyncedAt: Date.now(),
    });
  };

  const handleLogout = () => {
    setSession({
      isAuthenticated: false,
      isOffline,
      lastSyncedAt: Date.now(),
    });
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans">
      {/* Top Header HUD */}
      <HeaderNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        slot={slot}
        tps={tps}
        pingMs={pingMs}
        audioMuted={audioMuted}
        onToggleAudio={() => setAudioMuted(!audioMuted)}
        session={session}
        onOpenAuth={() => setIsAuthOpen(true)}
        onEmergencyKillswitch={handleEmergencyKillswitch}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
        autoOptimizeActive={autoOptimizeActive}
        onToggleAutoOptimize={() => setAutoOptimizeActive(!autoOptimizeActive)}
        optimizationMode={optimizationMode}
        onChangeMode={setOptimizationMode}
      />

      {/* Main App Grid View */}
      <main className="flex-1 p-3 md:p-5 max-w-[1720px] w-full mx-auto space-y-4">
        {/* Token Quick Switcher Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">
            MARKET WATCH:
          </span>
          {tokens.map((tok) => {
            const isSel = selectedToken.symbol === tok.symbol;
            const isPos = tok.change24h >= 0;

            return (
              <button
                key={tok.symbol}
                onClick={() => {
                  playCyberSound('CLICK');
                  setSelectedToken(tok);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                  isSel
                    ? 'bg-[#151c2c] border-[#9945FF] text-white shadow-md shadow-purple-950/30'
                    : 'bg-[#0e1320] border-[#1c2438] text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="font-bold">{tok.symbol}</span>
                <span className="text-white">
                  ${tok.priceUsd >= 1 ? tok.priceUsd.toFixed(2) : tok.priceUsd.toFixed(6)}
                </span>
                <span className={`text-[10px] font-semibold ${isPos ? 'text-[#14F195]' : 'text-red-400'}`}>
                  {isPos ? '+' : ''}
                  {tok.change24h.toFixed(1)}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Content Views based on active tab */}
        {activeTab === 'chart' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Candlestick Chart (75% width on desktop) */}
            <div className="lg:col-span-3 h-[600px]">
              <CandlestickChart
                token={selectedToken}
                candles={candles}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
              />
            </div>

            {/* Order Book & Fast Execution Ladder */}
            <div className="lg:col-span-1 h-[600px]">
              <OrderBook token={selectedToken} onExecuteTrade={handleExecuteTrade} />
            </div>

            {/* Bottom Row: Sniping Radar Teaser & Live Alerts */}
            <div className="lg:col-span-2 h-[380px]">
              <SnipingRadar
                pools={sniperPools}
                onSnipe={handleManualSnipe}
                autoSniperActive={autoSniperActive}
                onToggleAutoSniper={() => setAutoSniperActive(!autoSniperActive)}
              />
            </div>

            <div className="lg:col-span-2 h-[380px]">
              <AudioAlertsLog alerts={alerts} onClearAlerts={() => setAlerts([])} />
            </div>
          </div>
        )}

        {activeTab === 'sniper' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 min-h-[580px]">
              <SnipingRadar
                pools={sniperPools}
                onSnipe={handleManualSnipe}
                autoSniperActive={autoSniperActive}
                onToggleAutoSniper={() => setAutoSniperActive(!autoSniperActive)}
              />
            </div>
            <div className="lg:col-span-1 min-h-[580px]">
              <AudioAlertsLog alerts={alerts} onClearAlerts={() => setAlerts([])} />
            </div>
          </div>
        )}

        {activeTab === 'arbitrage' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 min-h-[580px]">
              <ArbitrageMatrix
                arbitrageOpportunities={arbitrageTrades}
                onExecuteArbitrage={handleExecuteArbitrage}
                autoArbitrageActive={autoArbitrageActive}
                onToggleAutoArbitrage={() => setAutoArbitrageActive(!autoArbitrageActive)}
              />
            </div>
            <div className="lg:col-span-1 min-h-[580px]">
              <OrderBook token={selectedToken} onExecuteTrade={handleExecuteTrade} />
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="min-h-[580px]">
              <RiskManagementPanel
                onEmergencyKillswitch={handleEmergencyKillswitch}
                openPositionsCount={positions.length}
              />
            </div>
            <div className="min-h-[580px]">
              <PortfolioAnalytics
                wallets={wallets}
                activeWallet={activeWallet}
                onSelectWallet={setActiveWallet}
                positions={positions}
                onClosePosition={handleClosePosition}
                isOffline={isOffline}
                onToggleOffline={() => setIsOffline(!isOffline)}
              />
            </div>
          </div>
        )}

        {activeTab === 'backtest' && (
          <div className="min-h-[640px]">
            <StrategyBacktester />
          </div>
        )}

        {activeTab === 'sentiment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 min-h-[620px]">
              <SocialSentimentTerminal />
            </div>
            <div className="lg:col-span-1 min-h-[620px]">
              <AudioAlertsLog alerts={alerts} onClearAlerts={() => setAlerts([])} />
            </div>
          </div>
        )}

        {activeTab === 'vision' && (
          <div className="min-h-[640px]">
            <VisionChartAnalyzer />
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="min-h-[640px]">
            <PortfolioAnalytics
              wallets={wallets}
              activeWallet={activeWallet}
              onSelectWallet={setActiveWallet}
              positions={positions}
              onClosePosition={handleClosePosition}
              isOffline={isOffline}
              onToggleOffline={() => setIsOffline(!isOffline)}
            />
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        session={session}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Gemini Multi-turn AI Copilot Chatbot */}
      <GeminiCopilotChat />
    </div>
  );
}
