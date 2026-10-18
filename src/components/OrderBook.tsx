import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Zap, ShieldAlert } from 'lucide-react';
import { TokenItem } from '../types';
import { playCyberSound } from '../utils/audio';

interface Props {
  token: TokenItem;
  onExecuteTrade: (side: 'BUY' | 'SELL', amountSol: number) => void;
}

export const OrderBook: React.FC<Props> = ({ token, onExecuteTrade }) => {
  const [tradeAmount, setTradeAmount] = useState(1.0);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [limitPrice, setLimitPrice] = useState(token.priceUsd);

  const price = token.priceUsd;

  // Generate realistic live order book levels around current price
  const asks = [
    { price: price * 1.0035, size: 84.5, total: 245.2 },
    { price: price * 1.0024, size: 42.1, total: 160.7 },
    { price: price * 1.0016, size: 68.9, total: 118.6 },
    { price: price * 1.0008, size: 35.4, total: 49.7 },
    { price: price * 1.0003, size: 14.3, total: 14.3 },
  ];

  const bids = [
    { price: price * 0.9997, size: 18.2, total: 18.2 },
    { price: price * 0.9991, size: 45.6, total: 63.8 },
    { price: price * 0.9984, size: 72.3, total: 136.1 },
    { price: price * 0.9976, size: 55.1, total: 191.2 },
    { price: price * 0.9965, size: 98.4, total: 289.6 },
  ];

  const maxTotal = 300;

  const handleTrade = (side: 'BUY' | 'SELL') => {
    playCyberSound('SNIPE');
    onExecuteTrade(side, tradeAmount);
  };

  return (
    <div className="bg-[#0b0f19] border border-[#1e2638] rounded-xl flex flex-col h-full shadow-2xl overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-[#1e2638] bg-[#0d121f] flex items-center justify-between">
        <span className="font-bold text-white text-xs tracking-wider">L2 ORDER BOOK & ROUTING</span>
        <span className="text-[10px] text-slate-400">JITO BUNDLE ENABLED</span>
      </div>

      {/* Asks (Sells) */}
      <div className="p-2 space-y-0.5">
        <div className="flex justify-between text-[10px] text-slate-500 px-2 pb-1">
          <span>PRICE (USD)</span>
          <span>SIZE (SOL)</span>
          <span>TOTAL</span>
        </div>

        {asks.map((ask, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between px-2 py-0.5 relative group hover:bg-red-500/10 cursor-pointer"
          >
            <div
              className="absolute right-0 top-0 bottom-0 bg-red-500/15 pointer-events-none transition-all"
              style={{ width: `${(ask.total / maxTotal) * 100}%` }}
            />
            <span className="text-red-400 font-bold z-10">
              ${ask.price >= 1 ? ask.price.toFixed(4) : ask.price.toFixed(6)}
            </span>
            <span className="text-slate-300 z-10">{ask.size.toFixed(1)}</span>
            <span className="text-slate-400 z-10">{ask.total.toFixed(1)}</span>
          </div>
        ))}
      </div>

      {/* Mid Market Spread */}
      <div className="py-1.5 px-4 bg-[#121824] border-y border-[#1a2336] flex items-center justify-between font-bold">
        <div className="flex items-center gap-1.5 text-white text-sm">
          <span>${price >= 1 ? price.toFixed(4) : price.toFixed(6)}</span>
          <ArrowUp className="w-3.5 h-3.5 text-[#14F195]" />
        </div>
        <span className="text-[10px] text-slate-400 font-normal">
          Spread: 0.0006 (0.04%)
        </span>
      </div>

      {/* Bids (Buys) */}
      <div className="p-2 space-y-0.5 flex-1">
        {bids.map((bid, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between px-2 py-0.5 relative group hover:bg-[#14F195]/10 cursor-pointer"
          >
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#14F195]/15 pointer-events-none transition-all"
              style={{ width: `${(bid.total / maxTotal) * 100}%` }}
            />
            <span className="text-[#14F195] font-bold z-10">
              ${bid.price >= 1 ? bid.price.toFixed(4) : bid.price.toFixed(6)}
            </span>
            <span className="text-slate-300 z-10">{bid.size.toFixed(1)}</span>
            <span className="text-slate-400 z-10">{bid.total.toFixed(1)}</span>
          </div>
        ))}
      </div>

      {/* Trade Execution Controls */}
      <div className="p-3 bg-[#090d16] border-t border-[#1e2638] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-[#151b29] p-0.5 rounded border border-[#232c40]">
            <button
              onClick={() => setOrderType('MARKET')}
              className={`px-2 py-0.5 rounded text-[10px] ${
                orderType === 'MARKET' ? 'bg-[#9945FF] text-white font-bold' : 'text-slate-400'
              }`}
            >
              MARKET
            </button>
            <button
              onClick={() => setOrderType('LIMIT')}
              className={`px-2 py-0.5 rounded text-[10px] ${
                orderType === 'LIMIT' ? 'bg-[#9945FF] text-white font-bold' : 'text-slate-400'
              }`}
            >
              LIMIT
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            {[0.5, 1, 5, 10].map((amt) => (
              <button
                key={amt}
                onClick={() => setTradeAmount(amt)}
                className={`px-1.5 py-0.5 rounded border ${
                  tradeAmount === amt
                    ? 'bg-[#14F195]/20 text-[#14F195] border-[#14F195]/40'
                    : 'bg-[#151b29] text-slate-400 border-[#232c40]'
                }`}
              >
                {amt}S
              </button>
            ))}
          </div>
        </div>

        {/* Input amount */}
        <div className="flex items-center bg-[#151b29] px-2.5 py-1.5 rounded-lg border border-[#232c40]">
          <span className="text-[10px] text-slate-400 mr-2">SIZE:</span>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={tradeAmount}
            onChange={(e) => setTradeAmount(parseFloat(e.target.value) || 0.1)}
            className="w-full bg-transparent text-white font-bold text-xs outline-none"
          />
          <span className="text-purple-400 font-bold ml-1">SOL</span>
        </div>

        {/* Execution Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleTrade('BUY')}
            className="py-2 rounded-lg bg-[#14F195] hover:bg-[#12da86] active:scale-95 text-black font-extrabold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            BUY / SNIPE
          </button>
          <button
            onClick={() => handleTrade('SELL')}
            className="py-2 rounded-lg bg-red-500 hover:bg-red-600 active:scale-95 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-md shadow-red-900/30 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            SELL / EXIT
          </button>
        </div>
      </div>
    </div>
  );
};
