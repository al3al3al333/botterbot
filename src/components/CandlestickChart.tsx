import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Activity, BarChart2, TrendingUp, Zap, Maximize2 } from 'lucide-react';
import { CandleData, TokenItem } from '../types';
import { calculateBollingerBands, calculateRSI } from '../utils/trading-math';

interface Props {
  token: TokenItem;
  candles: CandleData[];
  timeframe: string;
  onTimeframeChange: (tf: string) => void;
}

export const CandlestickChart: React.FC<Props> = ({
  token,
  candles,
  timeframe,
  onTimeframeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [crosshair, setCrosshair] = useState<{ x: number; y: number; candle?: CandleData } | null>(null);
  const [showBollinger, setShowBollinger] = useState(true);
  const [showRsi, setShowRsi] = useState(true);
  const [showEMA, setShowEMA] = useState(true);

  // Calculate metrics
  const closes = useMemo(() => candles.map((c) => c.close), [candles]);
  const bollinger = useMemo(() => calculateBollingerBands(closes, 20), [closes]);
  const rsi = useMemo(() => calculateRSI(closes, 14), [closes]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Split height: 75% main candle chart, 25% RSI if enabled
    const mainHeight = showRsi ? height * 0.72 : height;
    const rsiHeight = showRsi ? height * 0.22 : 0;
    const rsiTop = height - rsiHeight;

    // Clear background
    ctx.fillStyle = '#080b11';
    ctx.fillRect(0, 0, width, height);

    // Compute price scale bounds
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVolume = 0;

    candles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.volume > maxVolume) maxVolume = c.volume;
    });

    // Add padding to price scale
    const priceRange = maxPrice - minPrice || 1;
    const paddedMin = minPrice - priceRange * 0.05;
    const paddedMax = maxPrice + priceRange * 0.05;
    const paddedRange = paddedMax - paddedMin;

    const priceToY = (price: number) => {
      return mainHeight - ((price - paddedMin) / paddedRange) * (mainHeight - 30) - 20;
    };

    // Grid lines
    ctx.strokeStyle = '#151b28';
    ctx.lineWidth = 1;
    const gridSteps = 6;
    for (let i = 1; i <= gridSteps; i++) {
      const y = (mainHeight / (gridSteps + 1)) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width - 65, y);
      ctx.stroke();

      // Price labels on right
      const p = paddedMax - (paddedRange / (gridSteps + 1)) * i;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(p >= 1 ? p.toFixed(2) : p.toFixed(6), width - 8, y + 3);
    }

    const n = candles.length;
    const rightMargin = 70;
    const chartWidth = width - rightMargin;
    const candleWidth = Math.max(3, (chartWidth / n) * 0.75);
    const spacing = chartWidth / n;

    // 1. Draw Bollinger Bands corridor
    if (showBollinger && candles.length >= 20) {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = i * spacing + spacing / 2;
        const slice = closes.slice(0, i + 1);
        const bb = calculateBollingerBands(slice, 20);
        const yUpper = priceToY(bb.upper);
        if (i === 0) ctx.moveTo(x, yUpper);
        else ctx.lineTo(x, yUpper);
      }
      for (let i = n - 1; i >= 0; i--) {
        const x = i * spacing + spacing / 2;
        const slice = closes.slice(0, i + 1);
        const bb = calculateBollingerBands(slice, 20);
        const yLower = priceToY(bb.lower);
        ctx.lineTo(x, yLower);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(153, 69, 255, 0.06)';
      ctx.fill();

      // Upper band line
      ctx.strokeStyle = 'rgba(153, 69, 255, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // 2. Draw 9 EMA Line
    if (showEMA && candles.length >= 9) {
      ctx.beginPath();
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < n; i++) {
        const x = i * spacing + spacing / 2;
        const emaSub = closes.slice(Math.max(0, i - 9), i + 1);
        const ema = emaSub.reduce((a, b) => a + b, 0) / emaSub.length;
        const y = priceToY(ema);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // 3. Draw Volume Bars
    candles.forEach((c, i) => {
      const x = i * spacing + (spacing - candleWidth) / 2;
      const volHeight = (c.volume / (maxVolume || 1)) * 45;
      const y = mainHeight - volHeight;
      const isUp = c.close >= c.open;
      ctx.fillStyle = isUp ? 'rgba(20, 241, 149, 0.18)' : 'rgba(239, 68, 68, 0.18)';
      ctx.fillRect(x, y, candleWidth, volHeight);
    });

    // 4. Draw Candlesticks with glowing wicks and bodies
    candles.forEach((c, i) => {
      const centerX = i * spacing + spacing / 2;
      const x = i * spacing + (spacing - candleWidth) / 2;
      const isUp = c.close >= c.open;
      const color = isUp ? '#14F195' : '#EF4444';

      const openY = priceToY(c.open);
      const closeY = priceToY(c.close);
      const highY = priceToY(c.high);
      const lowY = priceToY(c.low);

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(centerX, highY);
      ctx.lineTo(centerX, lowY);
      ctx.stroke();

      // Candle body
      const top = Math.min(openY, closeY);
      const bodyH = Math.max(2, Math.abs(closeY - openY));

      ctx.fillStyle = color;
      ctx.fillRect(x, top, candleWidth, bodyH);

      // Flash glow on last active candle
      if (i === n - 1) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fillRect(x, top, candleWidth, bodyH);
        ctx.shadowBlur = 0; // reset
      }
    });

    // 5. Draw RSI Sub-chart
    if (showRsi) {
      // Separator line
      ctx.strokeStyle = '#1e2638';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, rsiTop - 10);
      ctx.lineTo(width, rsiTop - 10);
      ctx.stroke();

      // RSI bounds 70 & 30
      const rsiToY = (val: number) => rsiTop + (1 - val / 100) * (rsiHeight - 20) + 10;

      // Overbought 70
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, rsiToY(70));
      ctx.lineTo(width - 65, rsiToY(70));
      ctx.stroke();

      // Oversold 30
      ctx.strokeStyle = 'rgba(20, 241, 149, 0.35)';
      ctx.beginPath();
      ctx.moveTo(0, rsiToY(30));
      ctx.lineTo(width - 65, rsiToY(30));
      ctx.stroke();
      ctx.setLineDash([]); // reset

      ctx.fillStyle = '#64748b';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText('70', width - 8, rsiToY(70) + 3);
      ctx.fillText('30', width - 8, rsiToY(30) + 3);

      // RSI plot line
      ctx.strokeStyle = '#9945FF';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = i * spacing + spacing / 2;
        const rsiVal = calculateRSI(closes.slice(0, i + 1), 14);
        const y = rsiToY(rsiVal);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Label
      ctx.fillStyle = '#a855f7';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`RSI (14): ${rsi.toFixed(1)}`, 10, rsiTop + 6);
    }

    // 6. Crosshair Rendering
    if (crosshair && crosshair.x < chartWidth && crosshair.y < mainHeight) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(crosshair.x, 0);
      ctx.lineTo(crosshair.x, mainHeight);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, crosshair.y);
      ctx.lineTo(chartWidth, crosshair.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Crosshair price tag
      const crosshairPrice = paddedMax - ((crosshair.y - 20) / (mainHeight - 30)) * paddedRange;
      ctx.fillStyle = '#9945FF';
      ctx.fillRect(width - 65, crosshair.y - 10, 60, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        crosshairPrice >= 1 ? crosshairPrice.toFixed(2) : crosshairPrice.toFixed(6),
        width - 35,
        crosshair.y + 4
      );
    }
  }, [candles, showBollinger, showRsi, showEMA, crosshair, rsi]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const chartWidth = rect.width - 70;
    const candleIndex = Math.floor((x / chartWidth) * candles.length);
    const candle = candles[Math.max(0, Math.min(candles.length - 1, candleIndex))];

    setCrosshair({ x, y, candle });
  };

  const handleMouseLeave = () => {
    setCrosshair(null);
  };

  const currentPrice = token.priceUsd;
  const isPositive = token.change24h >= 0;

  return (
    <div className="bg-[#0b0f19] border border-[#1e2638] rounded-xl flex flex-col h-full shadow-2xl overflow-hidden relative" ref={containerRef}>
      {/* Top Header & Ticker Bar */}
      <div className="px-4 py-3 border-b border-[#1e2638] flex flex-wrap items-center justify-between gap-3 bg-[#0d121f]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center font-bold text-black text-xs shadow-md">
            {token.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base font-mono">{token.symbol}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e2638] text-slate-300">
                Solana DEX Raydium/Orca
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-lg font-extrabold text-white">
                ${currentPrice >= 1 ? currentPrice.toFixed(4) : currentPrice.toFixed(8)}
              </span>
              <span
                className={`text-xs font-mono font-semibold flex items-center gap-0.5 ${
                  isPositive ? 'text-[#14F195]' : 'text-red-400'
                }`}
              >
                {isPositive ? '+' : ''}
                {token.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry badges */}
        <div className="hidden lg:flex items-center gap-5 text-xs font-mono">
          <div>
            <div className="text-slate-400 text-[10px]">24H HIGH</div>
            <div className="text-slate-200 font-medium">
              ${token.high24h >= 1 ? token.high24h.toFixed(2) : token.high24h.toFixed(6)}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">24H LOW</div>
            <div className="text-slate-200 font-medium">
              ${token.low24h >= 1 ? token.low24h.toFixed(2) : token.low24h.toFixed(6)}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">24H VOLUME</div>
            <div className="text-[#14F195] font-medium">
              ${(token.volume24h / 1000000).toFixed(2)}M
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">VOLATILITY INDEX</div>
            <div className="text-[#00F0FF] flex items-center gap-1 font-semibold">
              <Activity className="w-3 h-3 text-[#00F0FF]" />
              {bollinger.volatilityPercent.toFixed(1)}% (High)
            </div>
          </div>
        </div>

        {/* Controls: Timeframes & Indicators */}
        <div className="flex items-center gap-2">
          {/* Timeframe switchers */}
          <div className="flex items-center bg-[#151b29] rounded-lg p-0.5 border border-[#232c40]">
            {['1s', '5s', '1m', '5m', '15m', '1h'].map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-[#9945FF] text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicator toggles */}
          <div className="flex items-center gap-1 bg-[#151b29] rounded-lg p-0.5 border border-[#232c40]">
            <button
              onClick={() => setShowBollinger(!showBollinger)}
              className={`px-2 py-1 text-[11px] font-mono rounded ${
                showBollinger ? 'bg-[#9945FF]/30 text-[#00F0FF] font-semibold' : 'text-slate-400'
              }`}
              title="Bollinger Bands corridor"
            >
              BB
            </button>
            <button
              onClick={() => setShowEMA(!showEMA)}
              className={`px-2 py-1 text-[11px] font-mono rounded ${
                showEMA ? 'bg-[#14F195]/30 text-[#14F195] font-semibold' : 'text-slate-400'
              }`}
              title="9-period EMA"
            >
              EMA
            </button>
            <button
              onClick={() => setShowRsi(!showRsi)}
              className={`px-2 py-1 text-[11px] font-mono rounded ${
                showRsi ? 'bg-purple-500/30 text-purple-300 font-semibold' : 'text-slate-400'
              }`}
              title="RSI Oscillator"
            >
              RSI
            </button>
          </div>
        </div>
      </div>

      {/* Crosshair details bar when hovered */}
      {crosshair?.candle && (
        <div className="px-4 py-1.5 bg-[#090d16] border-b border-[#1a2233] flex items-center gap-4 text-[11px] font-mono text-slate-300">
          <span>O: <strong className="text-white">${crosshair.candle.open.toFixed(4)}</strong></span>
          <span>H: <strong className="text-[#14F195]">${crosshair.candle.high.toFixed(4)}</strong></span>
          <span>L: <strong className="text-red-400">${crosshair.candle.low.toFixed(4)}</strong></span>
          <span>C: <strong className="text-white">${crosshair.candle.close.toFixed(4)}</strong></span>
          <span>Vol: <strong className="text-[#00F0FF]">{crosshair.candle.volume.toLocaleString()}</strong></span>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 w-full min-h-[380px] relative">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Live Execution Watermark */}
        <div className="absolute bottom-3 left-3 pointer-events-none flex items-center gap-2 text-[10px] font-mono text-slate-500 bg-[#080b11]/80 px-2 py-1 rounded border border-[#1e2638]">
          <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse"></span>
          REAL-TIME WEBSOCKET FEED (SUB-50MS) • JITO-MEV ENABLED
        </div>
      </div>
    </div>
  );
};
