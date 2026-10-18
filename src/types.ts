export type DexName = 'Raydium' | 'Orca' | 'Meteora' | 'Phoenix';

export interface TokenItem {
  symbol: string;
  name: string;
  address: string;
  priceUsd: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  volatility: number;
  baseDecimals: number;
  iconBg: string;
  dexQuotes: Record<string, number>;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Position {
  id: string;
  tokenSymbol: string;
  side: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice: number;
  amount: number;
  investedSol: number;
  pnlUsd: number;
  roiPercent: number;
  trailingStopPrice: number;
  takeProfitPrice: number;
  dex: DexName;
  timestamp: number;
}

export interface SniperPool {
  id: string;
  symbol: string;
  name: string;
  pair: string;
  dex: string;
  initialLiquidityUsd: number;
  liquiditySol: number;
  price: number;
  createdAt: number;
  safetyScore: number;
  isMintRenounced: boolean;
  isFreezeRevoked: boolean;
  isLpBurned: boolean;
  top10HoldersPercent: number;
  riskRating: 'SAFE' | 'MODERATE' | 'DEGEN' | 'HONEYPOT';
  status: 'NEW_POOL' | 'SNIPED' | 'SKIPPED' | 'WATCHING';
}

export interface ArbitrageTrade {
  id: string;
  pair: string;
  buyDex: DexName;
  sellDex: DexName;
  buyPrice: number;
  sellPrice: number;
  spreadPercent: number;
  estimatedProfitSol: number;
  estimatedProfitUsd: number;
  timestamp: number;
  status: 'READY' | 'EXECUTED' | 'ROUTING';
}

export interface WalletAccount {
  id: string;
  name: string;
  address: string;
  balanceSol: number;
  balanceUsd: number;
  tokens: {
    symbol: string;
    amount: number;
    valueUsd: number;
  }[];
  isPrimary: boolean;
}

export interface TradeAlert {
  id: string;
  title: string;
  message: string;
  type: 'SNIPE' | 'ARBITRAGE' | 'RISK' | 'SENTIMENT' | 'PROFIT';
  timestamp: number;
  audioGenerated?: boolean;
}

export interface BacktestRun {
  strategyName: string;
  timeframe: string;
  totalTrades: number;
  winRate: number;
  sharpeRatio: number;
  profitFactor: number;
  maxDrawdownPercent: number;
  netProfitSol: number;
  netProfitUsd: number;
  equityCurve: { time: string; equity: number }[];
}

export interface UserSession {
  isAuthenticated: boolean;
  user?: {
    name: string;
    email: string;
    avatar: string;
    provider: 'google' | 'github';
  };
  isOffline: boolean;
  lastSyncedAt: number;
}
