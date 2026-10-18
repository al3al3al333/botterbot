import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateArbitrage,
  calculateSlippageBoundary,
  calculatePositionPnL,
  checkTrailingStopTrigger,
  calculateRSI,
  calculateBollingerBands,
  evaluateSnipeSafety,
  calculatePrioritizationFees,
  assessNetworkCongestion,
  autoOptimizeGasFees,
} from './trading-math.ts';
import type { DexPriceQuote } from './trading-math.ts';

test('calculateArbitrage computes net profit correctly after fees and Jito MEV tips', () => {
  const buyQuote: DexPriceQuote = {
    dexName: 'Raydium',
    price: 150.0,
    liquidity: 500000,
    feePercent: 0.25,
  };

  const sellQuote: DexPriceQuote = {
    dexName: 'Orca',
    price: 152.0, // +1.33%
    liquidity: 450000,
    feePercent: 0.20,
  };

  const opp = calculateArbitrage(buyQuote, sellQuote, 1000, 0.002, 150);
  assert.equal(opp.isViable, true);
  assert.equal(opp.buyDex, 'Raydium');
  assert.equal(opp.sellDex, 'Orca');
  assert.ok(opp.netProfitPercent > 0.5);
  assert.ok(opp.estimatedProfitUsd > 5);
});

test('calculateArbitrage detects non-viable negative spread', () => {
  const buyQuote: DexPriceQuote = {
    dexName: 'Raydium',
    price: 151.0,
    liquidity: 500000,
    feePercent: 0.25,
  };

  const sellQuote: DexPriceQuote = {
    dexName: 'Orca',
    price: 150.5, // lower than buy
    liquidity: 450000,
    feePercent: 0.20,
  };

  const opp = calculateArbitrage(buyQuote, sellQuote, 1000, 0.005, 150);
  assert.equal(opp.isViable, false);
  assert.ok(opp.netProfitPercent < 0);
});

test('calculateSlippageBoundary limits buy price and guarantees minimum output', () => {
  const inputUsd = 1500;
  const expectedPrice = 150;
  const slippage = 1.0; // 1%
  const boundary = calculateSlippageBoundary(inputUsd, expectedPrice, slippage, true);

  assert.equal(boundary.executionPriceLimit, 151.5);
  assert.ok(boundary.minOutput < 10);
});

test('calculatePositionPnL calculates profit and ROI accurately', () => {
  const longPnL = calculatePositionPnL(150, 165, 10, 'long');
  assert.equal(longPnL.pnlUsd, 150);
  assert.equal(longPnL.roiPercent, 10);

  const shortPnL = calculatePositionPnL(150, 135, 10, 'short');
  assert.equal(shortPnL.pnlUsd, 150);
  assert.equal(shortPnL.roiPercent, 10);
});

test('checkTrailingStopTrigger detects when peak price drops below trailing threshold', () => {
  const peakPrice = 200;
  const safePrice = 195; // 2.5% drop
  const breachedPrice = 188; // 6% drop

  const safeCheck = checkTrailingStopTrigger(peakPrice, safePrice, 5); // 5% trail
  assert.equal(safeCheck.triggered, false);
  assert.equal(safeCheck.stopPrice, 190);

  const breachedCheck = checkTrailingStopTrigger(peakPrice, breachedPrice, 5);
  assert.equal(breachedCheck.triggered, true);
});

test('calculateRSI returns expected bounds for monotonic trends', () => {
  const uptrendCloses = [100, 102, 103, 105, 108, 110, 112, 115, 118, 120, 122, 125, 128, 130, 133, 136];
  const rsi = calculateRSI(uptrendCloses, 14);
  assert.ok(rsi >= 70, `Expected RSI >= 70 for strong uptrend, got ${rsi}`);
});

test('calculateBollingerBands returns middle SMA and upper/lower standard deviations', () => {
  const prices = Array.from({ length: 25 }, (_, i) => 100 + (i % 5));
  const bands = calculateBollingerBands(prices, 20);
  assert.ok(bands.upper > bands.middle);
  assert.ok(bands.lower < bands.middle);
  assert.ok(bands.volatilityPercent > 0);
});

test('evaluateSnipeSafety scores verified token higher than unrenounced token', () => {
  const safeToken = evaluateSnipeSafety({
    liquidityUsd: 120000,
    isMintRenounced: true,
    isFreezeRevoked: true,
    isLpBurned: true,
    top10HoldersPercent: 15,
  });
  assert.equal(safeToken.riskRating, 'SAFE');
  assert.ok(safeToken.score >= 85);
  assert.equal(safeToken.flags.length, 0);

  const honeyToken = evaluateSnipeSafety({
    liquidityUsd: 3000,
    isMintRenounced: false,
    isFreezeRevoked: false,
    isLpBurned: false,
    top10HoldersPercent: 65,
  });
  assert.equal(honeyToken.riskRating, 'HONEYPOT');
  assert.ok(honeyToken.flags.length >= 3);
});

test('calculatePrioritizationFees scales estimates with TPS and mempool ratio', () => {
  const normalFees = calculatePrioritizationFees(2500, 1.0);
  assert.ok(normalFees.medianMicroLamports >= 40000);
  assert.ok(normalFees.extremeMicroLamports > normalFees.medianMicroLamports);
  assert.ok(normalFees.estimatedSolCostMedian > 0);

  const spikeFees = calculatePrioritizationFees(3200, 1.5);
  assert.ok(spikeFees.medianMicroLamports > normalFees.medianMicroLamports);
  assert.ok(spikeFees.jitoTipMedianSol > normalFees.jitoTipMedianSol);
});

test('assessNetworkCongestion categorizes status accurately based on load', () => {
  const optimal = assessNetworkCongestion(2400, 15);
  assert.equal(optimal.status, 'OPTIMAL');

  const moderate = assessNetworkCongestion(2800, 22);
  assert.equal(moderate.status, 'MODERATE');

  const congested = assessNetworkCongestion(3400, 50);
  assert.equal(congested.status, 'CONGESTED');
});

test('autoOptimizeGasFees adapts fee rates and Jito tip to congestion without overpaying', () => {
  const optimalResult = autoOptimizeGasFees(2200, 14, 'DYNAMIC');
  assert.equal(optimalResult.congestionStatus, 'OPTIMAL');
  assert.equal(optimalResult.diodeColor, '#14F195');
  assert.ok(optimalResult.priorityMicroLamports <= 30000);
  assert.ok(optimalResult.jitoTipSol <= 0.001);
  assert.ok(optimalResult.savedSolEstimate > 0);

  const congestedResult = autoOptimizeGasFees(3400, 55, 'DYNAMIC');
  assert.equal(congestedResult.congestionStatus, 'CONGESTED');
  assert.equal(congestedResult.diodeColor, '#EF4444');
  assert.ok(congestedResult.priorityMicroLamports > optimalResult.priorityMicroLamports);
  assert.ok(congestedResult.jitoTipSol > optimalResult.jitoTipSol);
});


