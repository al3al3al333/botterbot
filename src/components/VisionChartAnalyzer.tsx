import React, { useState } from 'react';
import { Camera, Upload, Eye, CheckCircle2, AlertTriangle, Sparkles, FileText, Image as ImageIcon } from 'lucide-react';
import { playCyberSound } from '../utils/audio';

export const VisionChartAnalyzer: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/png');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string>('sample1');

  // Sample SVG Data URLs as instant testable presets
  const samplePresets: Record<string, { name: string; desc: string; dataUrl: string }> = {
    sample1: {
      name: 'SOL/USDC Breakout Flag',
      desc: 'Bullish pennant consolidation above 200 EMA with volume compression',
      dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="%230b0f19"/><line x1="20" y1="180" x2="380" y2="180" stroke="%231e2638"/><polyline points="30,190 70,140 110,160 150,110 210,130 260,95 320,110 370,60" fill="none" stroke="%2314F195" stroke-width="3"/><line x1="200" y1="70" x2="380" y2="70" stroke="%23EF4444" stroke-dasharray="4"/><text x="30" y="30" fill="%23FFFFFF" font-family="monospace" font-size="12">SOL/USDC 15M - RESISTANCE $158.40</text><text x="30" y="50" fill="%2314F195" font-family="monospace" font-size="10">BREAKOUT SETUP CONFIRMED</text></svg>',
    },
    sample2: {
      name: 'RugCheck Contract Audit',
      desc: 'Token contract showing active freeze authority and high top-holder concentration',
      dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="%230b0f19"/><rect x="20" y="20" width="360" height="200" rx="8" fill="%23121824" stroke="%23EF4444"/><text x="40" y="50" fill="%23EF4444" font-family="monospace" font-size="14" font-weight="bold">RUGCHECK SECURITY REPORT: HIGH RISK</text><text x="40" y="80" fill="%23FFFFFF" font-family="monospace" font-size="11">Mint Authority: Renounced (PASS)</text><text x="40" y="105" fill="%23EF4444" font-family="monospace" font-size="11">Freeze Authority: ACTIVE (FAIL - HONEYPOT)</text><text x="40" y="130" fill="%23EF4444" font-family="monospace" font-size="11">Top 10 Wallets: 68.4% Supply Concentration</text><text x="40" y="155" fill="%23F59E0B" font-family="monospace" font-size="11">LP Status: 45% Burned / 55% Unlocked</text><text x="40" y="185" fill="%2394A3B8" font-family="monospace" font-size="10">SOLANA CONTRACT AUDIT • BOT AUTO-REJECT</text></svg>',
    },
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/png');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunAnalysis = async (customImage?: string) => {
    const imgData = customImage || imagePreview || samplePresets[activePreset].dataUrl;
    setAnalyzing(true);
    playCyberSound('CLICK');

    try {
      // Extract base64 without prefix
      const base64Clean = imgData.split(',')[1] || imgData;
      const detectedMime = imgData.startsWith('data:image/svg+xml')
        ? 'image/svg+xml'
        : imgData.startsWith('data:image/jpeg')
        ? 'image/jpeg'
        : 'image/png';

      const res = await fetch('/api/analyze-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Clean,
          mimeType: detectedMime,
          prompt: 'Analyze this Solana crypto chart or security report. Identify technical structure, breakout levels, risk flags, and provide high-confidence bot sniping and stop-loss recommendations.',
        }),
      });

      if (!res.ok) {
        throw new Error('Analysis request failed.');
      }

      const data = await res.json();
      setAnalysisResult(data.analysis);
      playCyberSound('PROFIT');
    } catch (err: any) {
      console.error(err);
      setAnalysisResult('Error running vision analysis. Please verify server connectivity.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#0b0f19] border border-[#1e2638] rounded-xl flex flex-col h-full shadow-2xl overflow-hidden font-mono">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e2638] flex items-center justify-between bg-[#0d121f]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm tracking-wide">
                GEMINI VISION CHART & CONTRACT AUDITOR
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-pink-400" />
                gemini-4-argon
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Upload any chart screenshot, RugCheck scan, or order book to trigger multimodal AI analysis
            </p>
          </div>
        </div>
      </div>

      {/* Preset Selection & Upload Area */}
      <div className="p-4 bg-[#090d16] border-b border-[#1a2233] grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload box */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#232c40] hover:border-[#9945FF] rounded-xl p-4 bg-[#121824] transition-colors relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <Upload className="w-7 h-7 text-[#00F0FF] mb-2" />
          <span className="text-xs font-bold text-white">Click or Drop Chart Photo</span>
          <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WebP screenshots</span>
        </div>

        {/* Demo Presets */}
        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 block uppercase">Or Test Instant Demo Assets:</span>
          {Object.entries(samplePresets).map(([key, item]) => (
            <button
              key={key}
              onClick={() => {
                setActivePreset(key);
                setImagePreview(item.dataUrl);
                setAnalysisResult(null);
                handleRunAnalysis(item.dataUrl);
              }}
              className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
                activePreset === key && !imagePreview
                  ? 'bg-[#182033] border-[#9945FF] text-white'
                  : 'bg-[#121824] border-[#1e273a] text-slate-300 hover:border-slate-600'
              }`}
            >
              <div>
                <span className="font-bold block">{item.name}</span>
                <span className="text-[10px] text-slate-400">{item.desc}</span>
              </div>
              <ImageIcon className="w-4 h-4 text-purple-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Preview and Analysis Results */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Render Preview */}
        <div className="bg-[#121824] p-3 rounded-xl border border-[#1e273a] flex flex-col md:flex-row items-center gap-4">
          <img
            src={imagePreview || samplePresets[activePreset].dataUrl}
            alt="Chart Inspection"
            className="w-full md:w-64 h-36 object-contain rounded-lg bg-[#080b11] border border-[#1e2638]"
          />
          <div className="flex-1 space-y-2 text-xs">
            <span className="text-[11px] text-[#14F195] font-bold block">
              ● Ready for Multimodal Deep Inspection
            </span>
            <p className="text-slate-300 text-[11px]">
              Gemini 4 Argon will extract key technical levels, chart patterns, liquidity pool depth, and risk vulnerabilities.
            </p>
            <button
              disabled={analyzing}
              onClick={() => handleRunAnalysis()}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-[#9945FF] text-white font-extrabold text-xs flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-pink-900/30 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
              {analyzing ? 'ARGON ANALYZING MULTIMODAL TOKENS...' : 'AUDIT IMAGE WITH GEMINI 4'}
            </button>
          </div>
        </div>

        {/* Output Dossier */}
        {analysisResult && (
          <div className="bg-[#121824] p-4 rounded-xl border border-[#1e273a]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#1e273a]">
              <FileText className="w-4 h-4 text-[#14F195]" />
              <span className="font-bold text-white text-xs">
                Institutional Tactical Dossier (gemini-4-argon)
              </span>
            </div>
            <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed font-sans text-xs whitespace-pre-line">
              {analysisResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
